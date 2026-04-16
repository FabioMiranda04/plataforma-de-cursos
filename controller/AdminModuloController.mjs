import { state } from './AppController.mjs';
import { ModuloService } from '../service/ModuloService.mjs';
import { CursoService } from '../service/CursoService.mjs';

const svc = new ModuloService();
const cursoSvc = new CursoService();

export function renderAdminModulos() {
    const cursos = cursoSvc.listar();
    const modulos = svc.listar();

    state.contentDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title mb-0"><i class="fa-solid fa-layer-group me-2 text-primary"></i>Gestão de Módulos</h2>
            <button class="btn btn-primary-custom" onclick="abrirModalModulo()">
                <i class="fa-solid fa-plus"></i> Novo Módulo
            </button>
        </div>
        <div class="mb-3">
            <label class="form-label fw-semibold">Filtrar por Curso:</label>
            <select id="filtroCursoModulo" class="form-select w-auto d-inline-block ms-2" onchange="filtrarModulos()">
                <option value="">Todos os cursos</option>
                ${cursos.map(c => `<option value="${c.ID_Curso}">${c.Titulo}</option>`).join('')}
            </select>
        </div>
        <div class="custom-table-container">
            <table class="table custom-table">
                <thead><tr><th>Curso</th><th>Título do Módulo</th><th>Ordem</th><th>Ações</th></tr></thead>
                <tbody id="tbodyModulos">
                    ${_renderRowsModulos(modulos, cursos)}
                </tbody>
            </table>
        </div>
        <!-- Modal Módulo -->
        <div class="modal fade" id="modalModulo" tabindex="-1">
            <div class="modal-dialog"><div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalModuloTitulo">Novo Módulo</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formModuloAdmin">
                        <input type="hidden" id="moduloEditId">
                        <div class="mb-3">
                            <label>Curso</label>
                            <select id="moduloCurso" class="form-select" required>
                                ${cursos.map(c => `<option value="${c.ID_Curso}">${c.Titulo}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mb-3"><label>Título do Módulo</label><input type="text" id="moduloTitulo" class="form-control" required></div>
                        <div class="mb-3"><label>Ordem</label><input type="number" id="moduloOrdem" class="form-control" value="1" min="1"></div>
                        <button type="submit" class="btn btn-primary-custom w-100">Salvar</button>
                    </form>
                </div>
            </div></div>
        </div>
    `;

    document.getElementById('formModuloAdmin').addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('moduloEditId').value;
        const dados = {
            ID_Curso: parseInt(document.getElementById('moduloCurso').value),
            Titulo: document.getElementById('moduloTitulo').value,
            Ordem: parseInt(document.getElementById('moduloOrdem').value),
        };
        try {
            if (editId) { svc.atualizar(editId, dados); }
            else { svc.salvar(dados); }
            bootstrap.Modal.getInstance(document.getElementById('modalModulo')).hide();
            renderAdminModulos();
        } catch (err) { alert(err.message); }
    });
}

function _renderRowsModulos(modulos, cursos) {
    if (modulos.length === 0) return '<tr><td colspan="4" class="text-center text-muted py-4">Nenhum módulo cadastrado.</td></tr>';
    return modulos.map(m => {
        const curso = cursos.find(c => c.ID_Curso == m.ID_Curso);
        return `
            <tr data-curso="${m.ID_Curso}">
                <td>${curso ? curso.Titulo : '-'}</td>
                <td><strong>${m.Titulo}</strong></td>
                <td>${m.Ordem}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarModulo(${m.ID_Modulo})"><i class="fa-solid fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="excluirModulo(${m.ID_Modulo})"><i class="fa-solid fa-trash"></i> Excluir</button>
                </td>
            </tr>`;
    }).join('');
}

export function filtrarModulos() {
    const val = document.getElementById('filtroCursoModulo').value;
    document.querySelectorAll('#tbodyModulos tr[data-curso]').forEach(row => {
        row.style.display = (!val || row.dataset.curso == val) ? '' : 'none';
    });
}

export function abrirModalModulo() {
    document.getElementById('modalModuloTitulo').textContent = 'Novo Módulo';
    document.getElementById('moduloEditId').value = '';
    document.getElementById('formModuloAdmin').reset();
    new bootstrap.Modal(document.getElementById('modalModulo')).show();
}

export function editarModulo(id) {
    const m = svc.buscarPorId(id);
    if (!m) return;
    document.getElementById('modalModuloTitulo').textContent = 'Editar Módulo';
    document.getElementById('moduloEditId').value = id;
    document.getElementById('moduloCurso').value = m.ID_Curso;
    document.getElementById('moduloTitulo').value = m.Titulo;
    document.getElementById('moduloOrdem').value = m.Ordem;
    new bootstrap.Modal(document.getElementById('modalModulo')).show();
}

export function excluirModulo(id) {
    if (!confirm('Confirma a exclusão deste módulo?')) return;
    svc.excluir(id);
    renderAdminModulos();
}
