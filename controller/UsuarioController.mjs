import { state, logout, navigate } from './AppController.mjs';
import { UsuarioService } from '../service/UsuarioService.mjs';
import { MatriculaService } from '../service/MatriculaService.mjs';
import { CursoService } from '../service/CursoService.mjs';

const svc = new UsuarioService();
const matriculaSvc = new MatriculaService();
const cursoSvc = new CursoService();

// ─── Perfil do usuário logado ────────────────────────────────────────────────
export function renderPerfil() {
    const avatarSrc = state.currentUser.AvatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(state.currentUser.NomeCompleto)}&background=4361ee&color=fff`;

    const ativas = matriculaSvc.listarPorUsuario(state.currentUser.ID_Usuario)
        .filter(m => m.Status === 'Ativa');
    const cursos = cursoSvc.listar();

    state.contentDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title mb-0">Minha Conta e Configurações</h2>
            <button class="btn btn-outline-danger" onclick="logout()"><i class="fa-solid fa-right-from-bracket"></i> Sair da Conta</button>
        </div>
        <div class="profile-container">
            <div class="profile-sidebar">
                <div class="profile-pic-wrapper">
                    <img src="${avatarSrc}" id="perfilAvatarPreview" alt="Foto">
                    <label for="uploadFoto" class="profile-pic-overlay"><i class="fa-solid fa-camera"></i></label>
                    <input type="file" id="uploadFoto" style="display:none;" accept="image/*">
                </div>
                <h5 class="fw-bold">${state.currentUser.NomeCompleto}</h5>
                <p class="text-muted">${state.currentUser.Email}</p>
            </div>
            <div class="profile-content">
                <h5 class="mb-4">Dados Pessoais</h5>
                <form id="formPerfil">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label>Nome Completo</label>
                            <input type="text" id="perfilNome" class="form-control" value="${state.currentUser.NomeCompleto}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label>E-mail</label>
                            <input type="email" id="perfilEmail" class="form-control" value="${state.currentUser.Email}" required>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label>Nova Senha</label>
                            <input type="password" id="perfilSenha" class="form-control" placeholder="Deixe em branco para manter a atual">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary-custom mt-2">Salvar Alterações</button>
                </form>
                <h5 class="mt-5 mb-4 border-top pt-4 text-danger">Gerenciamento de Assinaturas (Cancelamento)</h5>
                <div class="list-group">
                    ${ativas.length === 0 ? '<p class="text-muted">Você não possui assinaturas ativas para cancelar.</p>' : ''}
                    ${ativas.map(m => {
                        const c = cursos.find(curso => curso.ID_Curso == m.ID_Curso);
                        return `
                            <div class="list-group-item d-flex justify-content-between align-items-center p-3 mb-2 rounded bg-light border">
                                <div>
                                    <h6 class="mb-0 fw-bold">${c ? c.Titulo : 'Curso Removido'}</h6>
                                    <small class="text-muted">Matrícula: ${new Date(m.DataMatricula).toLocaleDateString()}</small>
                                </div>
                                <button class="btn btn-sm btn-outline-danger shadow-sm" onclick="cancelarAssinatura(${m.ID_Matricula})">
                                    <i class="fa-solid fa-ban"></i> Cancelar Assinatura
                                </button>
                            </div>`;
                    }).join('')}
                </div>
            </div>
        </div>
    `;

    document.getElementById('uploadFoto').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target.result;
                document.getElementById('perfilAvatarPreview').src = base64;
                document.getElementById('loggedUserAvatar').src = base64;
                state.currentUser.AvatarUrl = base64;
                svc.atualizar(state.currentUser.ID_Usuario, { ...state.currentUser, AvatarUrl: base64 });
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('formPerfil').addEventListener('submit', (e) => {
        e.preventDefault();
        state.currentUser.NomeCompleto = document.getElementById('perfilNome').value;
        state.currentUser.Email = document.getElementById('perfilEmail').value;
        const newPwd = document.getElementById('perfilSenha').value;
        if (newPwd.trim() !== '') state.currentUser.SenhaHash = newPwd;
        svc.atualizar(state.currentUser.ID_Usuario, state.currentUser);
        document.getElementById('loggedUserName').textContent = state.currentUser.NomeCompleto;
        alert('Dados atualizados com sucesso!');
    });
}

export function cancelarAssinatura(idMatricula) {
    if (!confirm('Tem certeza que quer cancelar o acesso a este conteúdo? O valor será estornado.')) return;
    matriculaSvc.atualizar(idMatricula, { Status: 'Cancelada', DataConclusao: new Date().toISOString() });
    const pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]');
    const idx = pagamentos.findIndex(p => p.Status === 'Aprovado');
    if (idx > -1) { pagamentos[idx].Status = 'Estornado'; localStorage.setItem('pagamentos', JSON.stringify(pagamentos)); }
    alert('Matrícula revogada e valor devolvido!');
    renderPerfil();
}

// ─── CRUD Admin de Usuários ──────────────────────────────────────────────────
export function renderAdminUsuarios() {
    const lista = svc.listar();

    state.contentDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title mb-0"><i class="fa-solid fa-users me-2 text-primary"></i>Gestão de Usuários</h2>
            <button class="btn btn-primary-custom" onclick="abrirModalUsuario()">
                <i class="fa-solid fa-plus"></i> Novo Usuário
            </button>
        </div>
        <div class="custom-table-container">
            <table class="table custom-table">
                <thead>
                    <tr><th>Nome</th><th>E-mail</th><th>Papel</th><th>Cadastro</th><th>Ações</th></tr>
                </thead>
                <tbody id="tbodyUsuarios">
                    ${lista.length === 0 ? '<tr><td colspan="5" class="text-center text-muted py-4">Nenhum usuário cadastrado.</td></tr>' : ''}
                    ${lista.map(u => `
                        <tr>
                            <td><img src="${u.AvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.NomeCompleto)}&background=4361ee&color=fff`}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;margin-right:8px;">${u.NomeCompleto}</td>
                            <td>${u.Email}</td>
                            <td><span class="badge-status ${u.Papel === 'admin' ? 'warning' : 'success'}">${u.Papel === 'admin' ? 'Admin' : 'Aluno'}</span></td>
                            <td>${new Date(u.DataCadastro).toLocaleDateString()}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary me-1" onclick="editarUsuario(${u.ID_Usuario})"><i class="fa-solid fa-edit"></i> Editar</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="excluirUsuario(${u.ID_Usuario})"><i class="fa-solid fa-trash"></i> Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Modal Usuário -->
        <div class="modal fade" id="modalUsuario" tabindex="-1">
            <div class="modal-dialog"><div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalUsuarioTitulo">Novo Usuário</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formUsuario">
                        <input type="hidden" id="usuarioEditId">
                        <div class="mb-3"><label>Nome Completo</label><input type="text" id="usuarioNome" class="form-control" required></div>
                        <div class="mb-3"><label>E-mail</label><input type="email" id="usuarioEmail" class="form-control" required></div>
                        <div class="mb-3" id="senhaGroup"><label>Senha</label><input type="password" id="usuarioSenha" class="form-control"></div>
                        <div class="mb-3">
                            <label>Papel</label>
                            <select id="usuarioPapel" class="form-select">
                                <option value="aluno">Aluno</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary-custom w-100">Salvar</button>
                    </form>
                </div>
            </div></div>
        </div>
    `;

    document.getElementById('formUsuario').addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('usuarioEditId').value;
        const dados = {
            NomeCompleto: document.getElementById('usuarioNome').value,
            Email: document.getElementById('usuarioEmail').value,
            SenhaHash: document.getElementById('usuarioSenha').value || '123456',
            Papel: document.getElementById('usuarioPapel').value,
        };
        try {
            if (editId) {
                svc.atualizar(editId, dados);
                mostrarAlerta('Usuário atualizado com sucesso!', 'success');
            } else {
                svc.salvar(dados);
                mostrarAlerta('Usuário criado com sucesso!', 'success');
            }
            bootstrap.Modal.getInstance(document.getElementById('modalUsuario')).hide();
            renderAdminUsuarios();
        } catch (err) {
            mostrarAlerta(err.message, 'danger');
        }
    });
}

export function abrirModalUsuario() {
    document.getElementById('modalUsuarioTitulo').textContent = 'Novo Usuário';
    document.getElementById('usuarioEditId').value = '';
    document.getElementById('formUsuario').reset();
    document.getElementById('senhaGroup').style.display = '';
    new bootstrap.Modal(document.getElementById('modalUsuario')).show();
}

export function editarUsuario(id) {
    const u = svc.buscarPorId(id);
    if (!u) return;
    document.getElementById('modalUsuarioTitulo').textContent = 'Editar Usuário';
    document.getElementById('usuarioEditId').value = id;
    document.getElementById('usuarioNome').value = u.NomeCompleto;
    document.getElementById('usuarioEmail').value = u.Email;
    document.getElementById('usuarioSenha').value = '';
    document.getElementById('usuarioPapel').value = u.Papel || 'aluno';
    document.getElementById('senhaGroup').querySelector('label').textContent = 'Nova Senha (deixe em branco para manter)';
    new bootstrap.Modal(document.getElementById('modalUsuario')).show();
}

export function excluirUsuario(id) {
    if (!confirm('Confirma a exclusão deste usuário?')) return;
    svc.excluir(id);
    renderAdminUsuarios();
    mostrarAlerta('Usuário excluído.', 'warning');
}

function mostrarAlerta(msg, tipo) {
    const div = document.getElementById('alerta');
    if (!div) return;
    div.className = `alert alert-${tipo}`;
    div.textContent = msg;
    div.classList.remove('d-none');
    setTimeout(() => div.classList.add('d-none'), 3500);
}
