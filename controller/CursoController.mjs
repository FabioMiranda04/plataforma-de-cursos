import { state, navigate } from './AppController.mjs';
import { CursoService } from '../service/CursoService.mjs';
import { MatriculaService } from '../service/MatriculaService.mjs';
import { ModuloService } from '../service/ModuloService.mjs';
import { AulaService } from '../service/AulaService.mjs';

const cursoSvc = new CursoService();
const matriculaSvc = new MatriculaService();
const moduloSvc = new ModuloService();
const aulaSvc = new AulaService();

export function renderGaleria() {
    const cursosList = cursoSvc.listar();

    state.contentDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title mb-0">Galeria Geral de Cursos</h2>
        </div>
        <div class="course-grid">
            ${cursosList.length === 0 ? '<p class="text-muted">Nenhum curso cadastrado!</p>' : ''}
            ${cursosList.map(c => `
                <div class="course-card" onclick="checkAcessoCurso(${c.ID_Curso})">
                    <div class="course-card-img-wrapper">
                        <img src="${c.ImagemCapa}" alt="${c.Titulo}">
                    </div>
                    <div class="course-card-footer">
                        <div class="course-card-info">
                            <h3 class="course-card-title" title="${c.Titulo}">${c.Titulo}</h3>
                            <span class="course-card-tag">${c.Nivel}</span>
                        </div>
                        <button class="course-card-btn">Acessar</button>
                    </div>
                </div>
            `).join('')}
        </div>
        <!-- POPUP de COMPRA Dinâmico -->
        <div class="modal fade" id="checkoutModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-light">
                        <h5 class="modal-title text-primary"><i class="fa-solid fa-lock"></i> Desbloquear Curso</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4 text-center">
                        <p class="text-muted mb-4">Você ainda não possui acesso a este curso. Confirme a compra simulada (R$ 49,90) para prosseguir!</p>
                        <input type="hidden" id="checkoutCursoId">
                        <button class="btn btn-success btn-lg w-100" onclick="finalizarCompra()">Confirmar Pagamento Simulado</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function renderMeusCursos() {
    const minhasAtivas = matriculaSvc.listarPorUsuario(state.currentUser.ID_Usuario)
        .filter(m => m.Status === 'Ativa');
    const todos = cursoSvc.listar();
    const cursosList = todos.filter(c => minhasAtivas.some(m => m.ID_Curso == c.ID_Curso));

    state.contentDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title mb-0">Meus Cursos Adquiridos</h2>
        </div>
        <div class="course-grid">
            ${cursosList.length === 0 ? '<p class="text-muted">Você ainda não tem nenhum curso ativo. Compre na aba Galeria!</p>' : ''}
            ${cursosList.map(c => `
                <div class="course-card" onclick="renderCursoPlayer(${c.ID_Curso})">
                    <div class="course-card-img-wrapper">
                        <img src="${c.ImagemCapa}" alt="${c.Titulo}">
                    </div>
                    <div class="course-card-footer">
                        <div class="course-card-info">
                            <h3 class="course-card-title" title="${c.Titulo}">${c.Titulo}</h3>
                            <span class="course-card-tag">${c.Nivel}</span>
                        </div>
                        <button class="course-card-btn">Acessar</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

export function checkAcessoCurso(cursoId) {
    const possui = matriculaSvc.usuarioPossuiCurso(state.currentUser.ID_Usuario, cursoId);
    if (possui) {
        renderCursoPlayer(cursoId);
    } else {
        document.getElementById('checkoutCursoId').value = cursoId;
        const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        modal.show();
    }
}

export function finalizarCompra() {
    const cursoId = parseInt(document.getElementById('checkoutCursoId').value);

    const matriculas = JSON.parse(localStorage.getItem('matriculas') || '[]');
    matriculas.push({ ID_Matricula: Date.now(), ID_Usuario: state.currentUser.ID_Usuario, ID_Curso: cursoId, DataMatricula: new Date().toISOString(), DataConclusao: null, Status: 'Ativa' });
    localStorage.setItem('matriculas', JSON.stringify(matriculas));

    const pagamentos = JSON.parse(localStorage.getItem('pagamentos') || '[]');
    pagamentos.push({ ID_Pagamento: Date.now(), ID_Assinatura: Date.now(), ValorPago: 49.90, DataPagamento: new Date().toISOString(), MetodoPagamento: 'Cartão Virtual', Id_Transacao_Gateway: 'TXD_' + Math.floor(Math.random() * 900000), Status: 'Aprovado' });
    localStorage.setItem('pagamentos', JSON.stringify(pagamentos));

    const modalDom = document.getElementById('checkoutModal');
    const modalObj = bootstrap.Modal.getInstance(modalDom);
    if (modalObj) modalObj.hide();
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';
    document.body.style.paddingRight = '0px';

    alert('Pagamento Simulado Aprovado! Aproveite as aulas.');
    renderCursoPlayer(cursoId);
}

export function renderCursoPlayer(cursoId) {
    const curso = cursoSvc.buscarPorId(cursoId);
    const modulos = moduloSvc.listarPorCurso(cursoId);
    const todosAulas = aulaSvc.listar();

    let playlistsHTML = '';
    modulos.forEach((mod, index) => {
        const aulasModulo = todosAulas.filter(a => a.ID_Modulo == mod.ID_Modulo);
        playlistsHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${mod.ID_Modulo}">
                    <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${mod.ID_Modulo}">
                        ${mod.Titulo}
                    </button>
                </h2>
                <div id="collapse${mod.ID_Modulo}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#modulesAccordion">
                    <div class="accordion-body p-0">
                        ${aulasModulo.map(aula => `
                            <div class="video-list-item" onclick="playVideo('${aula.URL_Conteudo}', '${aula.TipoConteudo}')">
                                <i class="fa-solid fa-play-circle"></i> ${aula.Titulo}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });

    state.contentDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <button class="btn btn-outline-secondary btn-sm" onclick="navigate('meuscursos')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
            <h4 class="mb-0 text-primary fw-bold">${curso.Titulo}</h4>
            <div>
               <button class="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#newModuleModal"><i class="fa-solid fa-folder-plus"></i> Novo Módulo</button>
               <button class="btn btn-sm btn-primary-custom" data-bs-toggle="modal" data-bs-target="#newClassModal"><i class="fa-solid fa-video"></i> Adicionar Aula</button>
            </div>
        </div>
        <div class="player-layout">
            <div class="player-video-container" id="videoContainer">
                <div class="text-white text-center p-5">
                    <i class="fa-solid fa-play-circle" style="font-size: 4rem; opacity: 0.5;"></i>
                    <p class="mt-3">Selecione uma aula no menu lateral para iniciar.</p>
                </div>
            </div>
            <div class="player-sidebar">
                <div class="player-sidebar-header">Conteúdo do Curso</div>
                <div class="player-sidebar-content">
                    <div class="accordion module-accordion" id="modulesAccordion">
                        ${playlistsHTML || '<p class="text-muted p-2">Nenhum módulo disponível</p>'}
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal NOVO MÓDULO -->
        <div class="modal fade" id="newModuleModal" tabindex="-1">
            <div class="modal-dialog"><div class="modal-content">
                <div class="modal-header"><h5 class="modal-title">Novo Módulo</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
                <div class="modal-body">
                    <form id="formModulo">
                        <div class="mb-3"><label>Nome do Módulo</label><input type="text" id="modTitulo" class="form-control" required></div>
                        <button type="submit" class="btn btn-primary-custom w-100">Adicionar Módulo</button>
                    </form>
                </div>
            </div></div>
        </div>
        <!-- Modal NOVA AULA -->
        <div class="modal fade" id="newClassModal" tabindex="-1">
            <div class="modal-dialog"><div class="modal-content">
                <div class="modal-header"><h5 class="modal-title">Adicionar Vídeo (Aula)</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
                <div class="modal-body">
                    <form id="formAula">
                        <div class="mb-3"><label>Módulo Destino</label>
                            <select id="aulaModId" class="form-select" required>
                                ${modulos.map(m => `<option value="${m.ID_Modulo}">${m.Titulo}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mb-3"><label>Título da Aula</label><input type="text" id="aulaTitulo" class="form-control" required></div>
                        <div class="mb-3"><label>Tipo</label>
                            <select id="aulaTipo" class="form-select" required>
                                <option value="YouTube">YouTube Embed Link</option>
                                <option value="MP4">Link Direto (MP4)</option>
                            </select>
                        </div>
                        <div class="mb-3"><label>URL</label><input type="text" id="aulaUrl" class="form-control" placeholder="URL Válida..." required></div>
                        <button type="submit" class="btn btn-primary-custom w-100">Adicionar Aula</button>
                    </form>
                </div>
            </div></div>
        </div>
    `;

    document.getElementById('formModulo')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const mods = JSON.parse(localStorage.getItem('modulos') || '[]');
        mods.push({ ID_Modulo: Date.now(), ID_Curso: cursoId, Titulo: document.getElementById('modTitulo').value, Ordem: mods.length + 1 });
        localStorage.setItem('modulos', JSON.stringify(mods));
        bootstrap.Modal.getInstance(document.getElementById('newModuleModal')).hide();
        setTimeout(() => renderCursoPlayer(cursoId), 300);
    });

    document.getElementById('formAula')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const aulas = JSON.parse(localStorage.getItem('aulas') || '[]');
        aulas.push({ ID_Aula: Date.now(), ID_Modulo: parseInt(document.getElementById('aulaModId').value), Titulo: document.getElementById('aulaTitulo').value, TipoConteudo: document.getElementById('aulaTipo').value, URL_Conteudo: document.getElementById('aulaUrl').value, DuracaoMinutos: 10, Ordem: aulas.length + 1 });
        localStorage.setItem('aulas', JSON.stringify(aulas));
        bootstrap.Modal.getInstance(document.getElementById('newClassModal')).hide();
        setTimeout(() => renderCursoPlayer(cursoId), 300);
    });

    if (todosAulas.length > 0 && modulos.length > 0) {
        const firstAulas = todosAulas.filter(a => a.ID_Modulo == modulos[0].ID_Modulo);
        if (firstAulas.length > 0) playVideo(firstAulas[0].URL_Conteudo, firstAulas[0].TipoConteudo);
    }
}

export function playVideo(url, tipo) {
    const container = document.getElementById('videoContainer');
    if (!container) return;
    if (tipo === 'YouTube') {
        let embedUrl = url;
        if (url.includes('watch?v=')) embedUrl = url.replace('watch?v=', 'embed/').split('&')[0];
        else if (url.includes('youtu.be/')) embedUrl = url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
        container.innerHTML = `<iframe src="${embedUrl}" allowfullscreen></iframe>`;
    } else {
        container.innerHTML = `<video src="${url}" controls autoplay></video>`;
    }
}
