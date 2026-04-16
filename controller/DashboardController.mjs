import { state } from './AppController.mjs';

export function renderDashboard() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const cursos = JSON.parse(localStorage.getItem('cursos') || '[]');
    const pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]');
    const matriculas = JSON.parse(localStorage.getItem('matriculas') || '[]');

    const pagamentosAprovados = pagamentos.filter(p => p.Status === 'Aprovado');
    const totalFaturamento = pagamentosAprovados.reduce((acc, curr) => acc + parseFloat(curr.ValorPago), 0);
    const totalMatriculas = matriculas.filter(m => m.Status === 'Ativa').length;
    const pagamentosList = [...pagamentos].reverse().slice(0, 10);

    state.contentDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title mb-0">Visão Geral da Plataforma</h2>
        </div>
        <div class="kpi-row">
            <div class="kpi-card">
                <div class="kpi-icon blue"><i class="fa-solid fa-users"></i></div>
                <div class="kpi-details">
                    <span class="kpi-label">Total de Usuários</span>
                    <span class="kpi-value">${usuarios.length}</span>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon green"><i class="fa-solid fa-graduation-cap"></i></div>
                <div class="kpi-details">
                    <span class="kpi-label">Cursos Ativos</span>
                    <span class="kpi-value">${cursos.length}</span>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon yellow"><i class="fa-solid fa-id-card"></i></div>
                <div class="kpi-details">
                    <span class="kpi-label">Matrículas Ativas</span>
                    <span class="kpi-value">${totalMatriculas}</span>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-icon purple"><i class="fa-solid fa-dollar-sign"></i></div>
                <div class="kpi-details">
                    <span class="kpi-label">Faturamento Base</span>
                    <span class="kpi-value">R$ ${totalFaturamento.toFixed(2).replace('.', ',')}</span>
                </div>
            </div>
        </div>
        <div class="search-container">
            <div class="input-group">
                <span class="input-group-text bg-white border-end-0"><i class="fa-solid fa-search text-muted"></i></span>
                <input type="text" id="dashSearchInput" class="form-control border-start-0" placeholder="Buscar histórico de pagamentos...">
            </div>
        </div>
        <div class="custom-table-container">
            <table class="table custom-table">
                <thead>
                    <tr><th>Data</th><th>Gateway ID</th><th>Método</th><th>Status / Valor</th></tr>
                </thead>
                <tbody id="dashTbodyPag">
                    ${pagamentosList.length === 0 ? '<tr><td colspan="4" class="text-center text-muted py-4">Nenhum pagamento registrado ainda.</td></tr>' : ''}
                    ${pagamentosList.map(pg => `
                        <tr>
                            <td>${new Date(pg.DataPagamento).toLocaleString()}</td>
                            <td>${pg.Id_Transacao_Gateway}</td>
                            <td>${pg.MetodoPagamento}</td>
                            <td><span class="badge-status ${pg.Status === 'Aprovado' ? 'success' : 'danger'}">${pg.Status}: R$ ${parseFloat(pg.ValorPago).toFixed(2).replace('.', ',')}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('dashSearchInput')?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('#dashTbodyPag tr').forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
    });
}
