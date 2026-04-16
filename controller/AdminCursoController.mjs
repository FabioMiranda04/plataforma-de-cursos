import { state } from './AppController.mjs';
import { CursoService } from '../service/CursoService.mjs';
import { CategoriaService } from '../service/CategoriaService.mjs';

const svc = new CursoService();
const catSvc = new CategoriaService();

export function renderAdminCursos() {
    const lista = svc.listar();
    const categorias = catSvc.listar();

    state.contentDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title mb-0"><i class="fa-solid fa-graduation-cap me-2 text-primary"></i>Gestão de Cursos</h2>
            <button class="btn btn-primary-custom" onclick="abrirModalCurso()">
                <i class="fa-solid fa-plus"></i> Novo Curso
            </button>
        </div>
        <div id="alerta-cursos" class="alert d-none" role="alert"></div>
        <div class="custom-table-container">
            <table class="table custom-table">
                <thead>
                    <tr><th>Imagem</th><th>Título</th><th>Nível</th><th>Categoria</th><th>Ações</th></tr>
                </thead>
                <tbody>
                    ${lista.length === 0 ? '<tr><td colspan="5" class="text-center text-muted py-4">Nenhum curso cadastrado.</td></tr>' : ''}
                    ${lista.map(c => {
                        const cat = categorias.find(ca => ca.ID_Categoria == c.ID_Categoria);
                        return `
                        <tr>
                            <td><img src="${c.ImagemCapa}" style="width:60px;height:40px;object-fit:cover;border-radius:6px;"></td>
                            <td><strong>${c.Titulo}</strong><br><small class="text-muted">${c.Descricao || ''}</small></td>
                            <td><span class="badge-status success">${c.Nivel}</span></td>
                            <td>${cat ? cat.Nome : '-'}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary me-1" onclick="editarCurso(${c.ID_Curso})"><i class="fa-solid fa-edit"></i> Editar</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="excluirCurso(${c.ID_Curso})"><i class="fa-solid fa-trash"></i> Excluir</button>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <!-- Modal Curso -->
        <div class="modal fade" id="modalCurso" tabindex="-1">
            <div class="modal-dialog modal-lg"><div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalCursoTitulo">Novo Curso</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formCurso">
                        <input type="hidden" id="cursoEditId">
                        <div class="row">
                            <div class="col-md-8 mb-3"><label>Título</label><input type="text" id="cursoTitulo" class="form-control" required></div>
                            <div class="col-md-4 mb-3">
                                <label>Nível</label>
                                <select id="cursoNivel" class="form-select" required>
                                    <option value="Iniciante">Iniciante</option>
                                    <option value="Intermediário">Intermediário</option>
                                    <option value="Avançado">Avançado</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3"><label>Descrição</label><textarea id="cursoDescricao" class="form-control" rows="2"></textarea></div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label>Categoria</label>
                                <select id="cursoCategoria" class="form-select">
                                    ${categorias.map(cat => `<option value="${cat.ID_Categoria}">${cat.Nome}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-md-6 mb-3"><label>URL da Imagem de Capa</label><input type="text" id="cursoImagem" class="form-control" placeholder="https://..."></div>
                        </div>
                        <button type="submit" class="btn btn-primary-custom w-100">Salvar Curso</button>
                    </form>
                </div>
            </div></div>
        </div>
    `;

    document.getElementById('formCurso').addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('cursoEditId').value;
        const dados = {
            Titulo: document.getElementById('cursoTitulo').value,
            Nivel: document.getElementById('cursoNivel').value,
            Descricao: document.getElementById('cursoDescricao').value,
            ID_Categoria: parseInt(document.getElementById('cursoCategoria').value),
            ImagemCapa: document.getElementById('cursoImagem').value || undefined,
        };
        try {
            if (editId) { svc.atualizar(editId, dados); mostrarAlertaCurso('Curso atualizado!', 'success'); }
            else { svc.salvar(dados); mostrarAlertaCurso('Curso criado!', 'success'); }
            bootstrap.Modal.getInstance(document.getElementById('modalCurso')).hide();
            renderAdminCursos();
        } catch (err) { mostrarAlertaCurso(err.message, 'danger'); }
    });
}

export function abrirModalCurso() {
    document.getElementById('modalCursoTitulo').textContent = 'Novo Curso';
    document.getElementById('cursoEditId').value = '';
    document.getElementById('formCurso').reset();
    new bootstrap.Modal(document.getElementById('modalCurso')).show();
}

export function editarCurso(id) {
    const c = svc.buscarPorId(id);
    if (!c) return;
    document.getElementById('modalCursoTitulo').textContent = 'Editar Curso';
    document.getElementById('cursoEditId').value = id;
    document.getElementById('cursoTitulo').value = c.Titulo;
    document.getElementById('cursoNivel').value = c.Nivel;
    document.getElementById('cursoDescricao').value = c.Descricao || '';
    document.getElementById('cursoCategoria').value = c.ID_Categoria;
    document.getElementById('cursoImagem').value = c.ImagemCapa || '';
    new bootstrap.Modal(document.getElementById('modalCurso')).show();
}

export function excluirCurso(id) {
    if (!confirm('Confirma a exclusão deste curso?')) return;
    svc.excluir(id);
    renderAdminCursos();
}

function mostrarAlertaCurso(msg, tipo) {
    const div = document.getElementById('alerta-cursos');
    if (!div) return;
    div.className = `alert alert-${tipo}`;
    div.textContent = msg;
    div.classList.remove('d-none');
    setTimeout(() => div.classList.add('d-none'), 3500);
}
