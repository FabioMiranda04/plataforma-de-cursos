import { state } from './AppController.mjs';
import { CategoriaService } from '../service/CategoriaService.mjs';

const svc = new CategoriaService();

export function renderAdminCategorias() {
    const lista = svc.listar();

    state.contentDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title mb-0"><i class="fa-solid fa-tags me-2 text-primary"></i>Gestão de Categorias</h2>
            <button class="btn btn-primary-custom" onclick="abrirModalCategoria()">
                <i class="fa-solid fa-plus"></i> Nova Categoria
            </button>
        </div>
        <div id="alerta-categoria" class="alert d-none" role="alert"></div>
        <div class="custom-table-container">
            <table class="table custom-table">
                <thead><tr><th>#</th><th>Nome</th><th>Descrição</th><th>Ações</th></tr></thead>
                <tbody>
                    ${lista.length === 0 ? '<tr><td colspan="4" class="text-center text-muted py-4">Nenhuma categoria cadastrada.</td></tr>' : ''}
                    ${lista.map(c => `
                        <tr>
                            <td>${c.ID_Categoria}</td>
                            <td><strong>${c.Nome}</strong></td>
                            <td>${c.Descricao || '-'}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-primary me-1" onclick="editarCategoria(${c.ID_Categoria})"><i class="fa-solid fa-edit"></i> Editar</button>
                                <button class="btn btn-sm btn-outline-danger" onclick="excluirCategoria(${c.ID_Categoria})"><i class="fa-solid fa-trash"></i> Excluir</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <!-- Modal Categoria -->
        <div class="modal fade" id="modalCategoria" tabindex="-1">
            <div class="modal-dialog"><div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="modalCategoriaTitulo">Nova Categoria</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formCategoria">
                        <input type="hidden" id="categoriaEditId">
                        <div class="mb-3"><label>Nome</label><input type="text" id="categoriaNome" class="form-control" required></div>
                        <div class="mb-3"><label>Descrição</label><textarea id="categoriaDescricao" class="form-control" rows="2"></textarea></div>
                        <button type="submit" class="btn btn-primary-custom w-100">Salvar</button>
                    </form>
                </div>
            </div></div>
        </div>
    `;

    document.getElementById('formCategoria').addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('categoriaEditId').value;
        const dados = {
            Nome: document.getElementById('categoriaNome').value,
            Descricao: document.getElementById('categoriaDescricao').value,
        };
        try {
            if (editId) { svc.atualizar(editId, dados); }
            else { svc.salvar(dados); }
            bootstrap.Modal.getInstance(document.getElementById('modalCategoria')).hide();
            renderAdminCategorias();
        } catch (err) {
            const div = document.getElementById('alerta-categoria');
            div.className = 'alert alert-danger'; div.textContent = err.message; div.classList.remove('d-none');
        }
    });
}

export function abrirModalCategoria() {
    document.getElementById('modalCategoriaTitulo').textContent = 'Nova Categoria';
    document.getElementById('categoriaEditId').value = '';
    document.getElementById('formCategoria').reset();
    new bootstrap.Modal(document.getElementById('modalCategoria')).show();
}

export function editarCategoria(id) {
    const c = svc.buscarPorId(id);
    if (!c) return;
    document.getElementById('modalCategoriaTitulo').textContent = 'Editar Categoria';
    document.getElementById('categoriaEditId').value = id;
    document.getElementById('categoriaNome').value = c.Nome;
    document.getElementById('categoriaDescricao').value = c.Descricao || '';
    new bootstrap.Modal(document.getElementById('modalCategoria')).show();
}

export function excluirCategoria(id) {
    if (!confirm('Confirma a exclusão desta categoria?')) return;
    svc.excluir(id);
    renderAdminCategorias();
}
