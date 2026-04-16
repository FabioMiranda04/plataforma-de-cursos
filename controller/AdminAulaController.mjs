import { state } from './AppController.mjs';
import { AulaService } from '../service/AulaService.mjs';
import { ModuloService } from '../service/ModuloService.mjs';

const svc = new AulaService();
const moduloSvc = new ModuloService();

export function renderAdminAulas() {
    const modulos = moduloSvc.listar();
    const aulas = svc.listar();

    state.contentDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title mb-0"><i class="fa-solid fa-video me-2 text-primary"></i>Gestão de Aulas</h2>
            <button class="btn btn-primary-custom" onclick="abrirModalAula()">
                <i class="fa-solid fa-plus"></i> Nova Aula
            </button>
        </div>
        <div class="mb-3">
            <label class="form-label fw-semibold">Filtrar por Módulo:</label>
            <select id="filtroModuloAula" class="form-select w-auto d-inline-block ms-2" onchange="filtrarAulas()">
                <option value="">Todos os módulos</option>
                ${modulos.map(m => `<option value="${m.ID_Modulo}">${m.Titulo}</option>`).join('')}
            </select>
        </div>
        <div class="custom-table-container">
            <table class="table custom-table">
                <thead><tr><th>Módulo</th><th>Título</th><th>Tipo</th><th>Duração</th><th>Ações</th></tr></thead>
                <tbody id="tbodyAulas">
                    ${_renderRowsAulas(aulas, modulos)}
                </tbody>
            </table>
        </div>
        <!-- Modal Aula -->
        <div class="modal fade" id="modalAula" tabindex="-1">
            <div class="modal-dialog modal-lg"><div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalAulaTitulo">Nova Aula</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formAulaAdmin">
                        <input type="hidden" id="aulaEditId">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label>Módulo</label>
                                <select id="aulaModulo" class="form-select" required>
                                    ${modulos.map(m => `<option value="${m.ID_Modulo}">${m.Titulo}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-md-6 mb-3"><label>Título</label><input type="text" id="aulaTituloAdmin" class="form-control" required></div>
                        </div>
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <label>Tipo</label>
                                <select id="aulaTipoAdmin" class="form-select">
                                    <option value="YouTube">YouTube</option>
                                    <option value="MP4">MP4</option>
                                </select>
                            </div>
                            <div class="col-md-8 mb-3"><label>URL</label><input type="text" id="aulaUrlAdmin" class="form-control" required></div>
                        </div>
                        <div class="row">
                            <div class="col-md-4 mb-3"><label>Duração (min)</label><input type="number" id="aulaDuracao" class="form-control" value="10" min="1"></div>
                            <div class="col-md-4 mb-3"><label>Ordem</label><input type="number" id="aulaOrdem" class="form-control" value="1" min="1"></div>
                        </div>
                        <button type="submit" class="btn btn-primary-custom w-100">Salvar</button>
                    </form>
                </div>
            </div></div>
        </div>
    `;

    document.getElementById('formAulaAdmin').addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('aulaEditId').value;
        const dados = {
            ID_Modulo: parseInt(document.getElementById('aulaModulo').value),
            Titulo: document.getElementById('aulaTituloAdmin').value,
            TipoConteudo: document.getElementById('aulaTipoAdmin').value,
            URL_Conteudo: document.getElementById('aulaUrlAdmin').value,
            DuracaoMinutos: parseInt(document.getElementById('aulaDuracao').value),
            Ordem: parseInt(document.getElementById('aulaOrdem').value),
        };
        try {
            if (editId) { svc.atualizar(editId, dados); }
            else { svc.salvar(dados); }
            bootstrap.Modal.getInstance(document.getElementById('modalAula')).hide();
            renderAdminAulas();
        } catch (err) { alert(err.message); }
    });
}

function _renderRowsAulas(aulas, modulos) {
    if (aulas.length === 0) return '<tr><td colspan="5" class="text-center text-muted py-4">Nenhuma aula cadastrada.</td></tr>';
    return aulas.map(a => {
        const mod = modulos.find(m => m.ID_Modulo == a.ID_Modulo);
        return `
            <tr data-modulo="${a.ID_Modulo}">
                <td>${mod ? mod.Titulo : '-'}</td>
                <td><strong>${a.Titulo}</strong></td>
                <td><span class="badge-status ${a.TipoConteudo === 'YouTube' ? 'danger' : 'success'}">${a.TipoConteudo}</span></td>
                <td>${a.DuracaoMinutos} min</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editarAula(${a.ID_Aula})"><i class="fa-solid fa-edit"></i> Editar</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="excluirAula(${a.ID_Aula})"><i class="fa-solid fa-trash"></i> Excluir</button>
                </td>
            </tr>`;
    }).join('');
}

export function filtrarAulas() {
    const val = document.getElementById('filtroModuloAula').value;
    document.querySelectorAll('#tbodyAulas tr[data-modulo]').forEach(row => {
        row.style.display = (!val || row.dataset.modulo == val) ? '' : 'none';
    });
}

export function abrirModalAula() {
    document.getElementById('modalAulaTitulo').textContent = 'Nova Aula';
    document.getElementById('aulaEditId').value = '';
    document.getElementById('formAulaAdmin').reset();
    new bootstrap.Modal(document.getElementById('modalAula')).show();
}

export function editarAula(id) {
    const a = svc.buscarPorId(id);
    if (!a) return;
    document.getElementById('modalAulaTitulo').textContent = 'Editar Aula';
    document.getElementById('aulaEditId').value = id;
    document.getElementById('aulaModulo').value = a.ID_Modulo;
    document.getElementById('aulaTituloAdmin').value = a.Titulo;
    document.getElementById('aulaTipoAdmin').value = a.TipoConteudo;
    document.getElementById('aulaUrlAdmin').value = a.URL_Conteudo;
    document.getElementById('aulaDuracao').value = a.DuracaoMinutos;
    document.getElementById('aulaOrdem').value = a.Ordem;
    new bootstrap.Modal(document.getElementById('modalAula')).show();
}

export function excluirAula(id) {
    if (!confirm('Confirma a exclusão desta aula?')) return;
    svc.excluir(id);
    renderAdminAulas();
}
