import { state } from './AppController.mjs';
import { MatriculaService } from '../service/MatriculaService.mjs';
import { UsuarioService } from '../service/UsuarioService.mjs';
import { CursoService } from '../service/CursoService.mjs';

const svc = new MatriculaService();
const usuarioSvc = new UsuarioService();
const cursoSvc = new CursoService();

export function renderAdminMatriculas() {
    const lista = svc.listar();
    const usuarios = usuarioSvc.listar();
    const cursos = cursoSvc.listar();

    state.contentDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title mb-0"><i class="fa-solid fa-id-card me-2 text-primary"></i>Gestão de Matrículas</h2>
            <button class="btn btn-primary-custom" onclick="abrirModalMatricula()">
                <i class="fa-solid fa-plus"></i> Nova Matrícula
            </button>
        </div>
        <div class="custom-table-container">
            <table class="table custom-table">
                <thead><tr><th>Usuário</th><th>Curso</th><th>Data</th><th>Status</th><th>Ações</th></tr></thead>
                <tbody>
                    ${lista.length === 0 ? '<tr><td colspan="5" class="text-center text-muted py-4">Nenhuma matrícula registrada.</td></tr>' : ''}
                    ${lista.map(m => {
                        const u = usuarios.find(u => u.ID_Usuario == m.ID_Usuario);
                        const c = cursos.find(c => c.ID_Curso == m.ID_Curso);
                        return `
                        <tr>
                            <td>${u ? u.NomeCompleto : 'Usuário ' + m.ID_Usuario}</td>
                            <td>${c ? c.Titulo : 'Curso ' + m.ID_Curso}</td>
                            <td>${new Date(m.DataMatricula).toLocaleDateString()}</td>
                            <td>
                                <span class="badge-status ${m.Status === 'Ativa' ? 'success' : m.Status === 'Cancelada' ? 'danger' : 'warning'}">${m.Status}</span>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary me-1" onclick="editarMatricula(${m.ID_Matricula})"><i class="fa-solid fa-edit"></i> Status</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="excluirMatricula(${m.ID_Matricula})"><i class="fa-solid fa-trash"></i> Excluir</button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- Modal Nova Matrícula -->
        <div class="modal fade" id="modalMatricula" tabindex="-1">
            <div class="modal-dialog"><div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalMatriculaTitulo">Nova Matrícula</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formMatricula">
                        <input type="hidden" id="matriculaEditId">
                        <div class="mb-3" id="grupoUsuarioCurso">
                            <label>Usuário</label>
                            <select id="matriculaUsuario" class="form-select" required>
                                ${usuarios.map(u => `<option value="${u.ID_Usuario}">${u.NomeCompleto}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mb-3" id="grupoCurso">
                            <label>Curso</label>
                            <select id="matriculaCurso" class="form-select" required>
                                ${cursos.map(c => `<option value="${c.ID_Curso}">${c.Titulo}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label>Status</label>
                            <select id="matriculaStatus" class="form-select">
                                <option value="Ativa">Ativa</option>
                                <option value="Cancelada">Cancelada</option>
                                <option value="Concluída">Concluída</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary-custom w-100">Salvar</button>
                    </form>
                </div>
            </div></div>
        </div>
    `;

    document.getElementById('formMatricula').addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('matriculaEditId').value;
        try {
            if (editId) {
                svc.atualizar(editId, { Status: document.getElementById('matriculaStatus').value });
            } else {
                svc.salvar({
                    ID_Usuario: parseInt(document.getElementById('matriculaUsuario').value),
                    ID_Curso: parseInt(document.getElementById('matriculaCurso').value),
                    Status: document.getElementById('matriculaStatus').value,
                });
            }
            bootstrap.Modal.getInstance(document.getElementById('modalMatricula')).hide();
            renderAdminMatriculas();
        } catch (err) { alert(err.message); }
    });
}

export function abrirModalMatricula() {
    document.getElementById('modalMatriculaTitulo').textContent = 'Nova Matrícula';
    document.getElementById('matriculaEditId').value = '';
    document.getElementById('formMatricula').reset();
    document.getElementById('grupoUsuarioCurso').style.display = '';
    document.getElementById('grupoCurso').style.display = '';
    new bootstrap.Modal(document.getElementById('modalMatricula')).show();
}

export function editarMatricula(id) {
    const m = svc.buscarPorId(id);
    if (!m) return;
    document.getElementById('modalMatriculaTitulo').textContent = 'Alterar Status da Matrícula';
    document.getElementById('matriculaEditId').value = id;
    document.getElementById('matriculaStatus').value = m.Status;
    document.getElementById('grupoUsuarioCurso').style.display = 'none';
    document.getElementById('grupoCurso').style.display = 'none';
    new bootstrap.Modal(document.getElementById('modalMatricula')).show();
}

export function excluirMatricula(id) {
    if (!confirm('Confirma a exclusão desta matrícula?')) return;
    svc.excluir(id);
    renderAdminMatriculas();
}
