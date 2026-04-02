const app = {
    contentDiv: document.getElementById('app-content'),
    currentUser: null,
    
    init() {
        if(!localStorage.getItem('migracao_cursos_v4')) {
            localStorage.clear(); // Limpa tudo para garantir o mock novo das entidades
            localStorage.setItem('migracao_cursos_v4', 'true');
        }
        
        DB.init(); // Inicializa dados puros

        const loggedId = sessionStorage.getItem('loggedUser');
        if(loggedId) {
            this.currentUser = DB.getById('usuarios', 'ID_Usuario', Number(loggedId));
            if(this.currentUser) {
                this.setupSession();
                return;
            }
        }
        
        this.navigate('login');
    },

    setupSession() {
        document.getElementById('mainTabs').style.display = 'flex';
        document.getElementById('userProfileBlock').style.display = 'flex';
        document.getElementById('loggedUserName').textContent = this.currentUser.NomeCompleto;
        
        const avatarUrl = this.currentUser.AvatarUrl || `https://ui-avatars.com/api/?name=${this.currentUser.NomeCompleto.replace(/ /g, '+')}&background=4361ee&color=fff`;
        document.getElementById('loggedUserAvatar').src = avatarUrl;
        
        this.navigate('dashboard');
    },

    logout() {
        sessionStorage.removeItem('loggedUser');
        this.currentUser = null;
        document.getElementById('mainTabs').style.display = 'none';
        document.getElementById('userProfileBlock').style.display = 'none';
        this.navigate('login');
    },

    navigate(viewName) {
        document.querySelectorAll('.nav-tabs-custom .nav-link').forEach(link => {
            link.classList.remove('active');
            if(link.dataset.target === viewName) link.classList.add('active');
        });

        window.scrollTo(0, 0);

        switch(viewName) {
            case 'login':
                this.renderLogin();
                break;
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'cursos':
                this.renderCursos();
                break;
            case 'meuscursos':
                this.renderMeusCursos();
                break;
            case 'usuarios':
                this.renderUsuarios();
                break;
            case 'perfil':
                document.querySelectorAll('.nav-tabs-custom .nav-link').forEach(l => l.classList.remove('active'));
                this.renderPerfil();
                break;
        }
    },

    renderLogin() {
        this.contentDiv.innerHTML = `
            <div class="login-container">
                <div class="brand-logo d-flex justify-content-center mb-4 text-primary fs-3 fw-bold">
                    <i class="fa-solid fa-graduation-cap me-2"></i> MegaCursos
                </div>
                <h4 class="mb-4">Identifique-se</h4>
                <form id="formLogin">
                    <div class="mb-3 text-start">
                        <label>E-mail</label>
                        <input type="email" id="loginEmail" class="form-control" value="fabiomirandago@gmail.com" required>
                    </div>
                    <div class="mb-4 text-start">
                        <label>Senha</label>
                        <input type="password" id="loginSenha" class="form-control" value="123123" required>
                    </div>
                    <button class="btn btn-primary-custom w-100 mb-3 fs-5" type="submit">Entrar na Plataforma</button>
                    <p class="text-muted small">Credenciais de simulação já preenchidas. Apenas clique em Entrar.</p>
                </form>
            </div>
        `;

        document.getElementById('formLogin').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const users = DB.get('usuarios');
            const found = users.find(u => u.Email === email);
            if(found) {
                sessionStorage.setItem('loggedUser', found.ID_Usuario);
                this.currentUser = found;
                this.setupSession();
            } else {
                alert('Usuário não encontrado!');
            }
        });
    },

    renderDashboard() {
        const totalUsuarios = DB.get('usuarios').length;
        const totalCursos = DB.get('cursos').length;
        
        // Faturamento considera apenas os Aprovados! (Cursos ativos)
        const pagamentosAprovados = DB.get('pagamentos').filter(p => p.Status === 'Aprovado');
        const totalFaturamento = pagamentosAprovados.reduce((acc, curr) => acc + parseFloat(curr.ValorPago), 0);
        
        const pagamentosList = DB.get('pagamentos').reverse().slice(0,10); // últimos 10

        this.contentDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="section-title mb-0">Visão Geral da Plataforma</h2>
            </div>
            <div class="kpi-row">
                <div class="kpi-card">
                    <div class="kpi-icon blue"><i class="fa-solid fa-users"></i></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Total de Usuários</span>
                        <span class="kpi-value">${totalUsuarios}</span>
                    </div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-icon green"><i class="fa-solid fa-graduation-cap"></i></div>
                    <div class="kpi-details">
                        <span class="kpi-label">Cursos Ativos</span>
                        <span class="kpi-value">${totalCursos}</span>
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
                    <input type="text" class="form-control border-start-0" placeholder="Buscar histórico de pagamentos...">
                </div>
            </div>
            <div class="custom-table-container">
                <table class="table custom-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Gateway ID</th>
                            <th>Método</th>
                            <th>Status / Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pagamentosList.length === 0 ? '<tr><td colspan="4" class="text-center text-muted py-4">Nenhum pagamento registrado ainda.</td></tr>' : ''}
                        ${pagamentosList.map(pg => `
                            <tr>
                                <td>${new Date(pg.DataPagamento).toLocaleString()}</td>
                                <td>${pg.Id_Transacao_Gateway}</td>
                                <td>${pg.MetodoPagamento}</td>
                                <td>
                                    <span class="badge-status ${pg.Status === 'Aprovado' ? 'success' : 'danger'}">
                                        ${pg.Status}: R$ ${parseFloat(pg.ValorPago).toFixed(2).replace('.',',')}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    renderCursos() {
        const cursosList = DB.get('cursos');

        this.contentDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="section-title mb-0">Galeria Geral de Cursos</h2>
                <button class="btn btn-primary-custom" data-bs-toggle="modal" data-bs-target="#cursoModal">
                    <i class="fa-solid fa-plus"></i> Novo Curso
                </button>
            </div>
            <div class="course-grid">
                ${cursosList.length === 0 ? '<p class="text-muted">Nenhum curso cadastrado!</p>' : ''}
                ${cursosList.map(c => `
                    <div class="course-card" onclick="app.checkAcessoCurso(${c.ID_Curso})">
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
            <!-- Modal CADASTRO CURSO -->
            <div class="modal fade" id="cursoModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Cadastrar Novo Curso</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formCurso">
                                <div class="mb-3">
                                    <label>Título do Curso</label>
                                    <input type="text" id="cursoTitulo" class="form-control" required>
                                </div>
                                <div class="mb-3">
                                    <label>Nível</label>
                                    <select id="cursoNivel" class="form-select" required>
                                        <option value="Iniciante">Iniciante</option>
                                        <option value="Intermediário">Intermediário</option>
                                        <option value="Avançado">Avançado</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary-custom w-100">Salvar Curso</button>
                            </form>
                        </div>
                    </div>
                </div>
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
                            <p class="text-muted mb-4">Você ainda não possui acesso a este curso. Confirme a compra simulada (R$ 49.90) para prosseguir!</p>
                            <input type="hidden" id="checkoutCursoId">
                            <button class="btn btn-success btn-lg w-100" onclick="app.finalizarCompra()">Confirmar Pagamento Simulado</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const formCurso = document.getElementById('formCurso');
        if(formCurso) {
            formCurso.addEventListener('submit', (e) => {
                e.preventDefault();
                const titulo = document.getElementById('cursoTitulo').value;
                const nivel = document.getElementById('cursoNivel').value;
                const cover = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=500&q=60';
                
                const novoCurso = new Curso(null, titulo, "Descrição...", 1, 1, nivel, cover);
                const cursos = DB.get('cursos');
                cursos.push(novoCurso);
                DB.save('cursos', cursos);
                
                const bsModal = bootstrap.Modal.getInstance(document.getElementById('cursoModal'));
                bsModal.hide();
                this.renderCursos(); 
            });
        }
    },

    renderMeusCursos() {
        const todasMatriculas = DB.get('matriculas');
        // Filtra matrículas ATIVAS do usuário logado
        const minhasAtivas = todasMatriculas.filter(m => m.ID_Usuario === this.currentUser.ID_Usuario && m.Status === 'Ativa');
        
        const todosCursos = DB.get('cursos');
        const cursosList = todosCursos.filter(c => minhasAtivas.some(m => m.ID_Curso === c.ID_Curso));

        this.contentDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="section-title mb-0">Meus Cursos Adquiridos</h2>
            </div>
            <div class="course-grid">
                ${cursosList.length === 0 ? '<p class="text-muted">Você ainda não tem nenhum curso ativo. Compre na aba Galeria!</p>' : ''}
                ${cursosList.map(c => `
                    <div class="course-card" onclick="app.renderCursoPlayer(${c.ID_Curso})">
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
    },

    checkAcessoCurso(cursoId) {
        const matriculas = DB.get('matriculas');
        const possui = matriculas.find(m => m.ID_Usuario === this.currentUser.ID_Usuario && m.ID_Curso === cursoId && m.Status === 'Ativa');
        if(possui) {
            this.renderCursoPlayer(cursoId);
        } else {
            // Drop modal de Checkout
            document.getElementById('checkoutCursoId').value = cursoId;
            const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
            modal.show();
        }
    },

    finalizarCompra() {
        const cursoId = parseInt(document.getElementById('checkoutCursoId').value);
        
        const matriculas = DB.get('matriculas');
        matriculas.push(new Matricula(Date.now(), this.currentUser.ID_Usuario, cursoId, new Date().toISOString(), null, 'Ativa'));
        DB.save('matriculas', matriculas);

        const pagamentos = DB.get('pagamentos');
        // Vinculando aleatoriamente num pagamento com ref de assinatura solta para simulação
        pagamentos.push(new Pagamento(Date.now(), Date.now(), 49.90, new Date().toISOString(), 'Cartão Virtual', 'TXD_'+Math.floor(Math.random()*900000), 'Aprovado'));
        DB.save('pagamentos', pagamentos);

        const modalDom = document.getElementById('checkoutModal');
        const modalObj = bootstrap.Modal.getInstance(modalDom);
        modalObj.hide();
        
        // Remove gray backdrop manual bug prevention in bootstrap
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
        document.body.style.paddingRight = '0px';

        alert("Pagamento Simulado Aprovado! Aproveite as aulas.");
        this.renderCursoPlayer(cursoId); // redireciona instantaneo para a view
    },

    renderCursoPlayer(cursoId) {
        const curso = DB.getById('cursos', 'ID_Curso', cursoId);
        const modulos = DB.get('modulos').filter(m => m.ID_Curso === cursoId);
        const todosAulas = DB.get('aulas');
        
        let playlistsHTML = "";
        modulos.forEach((mod, index) => {
            const aulasModulo = todosAulas.filter(a => a.ID_Modulo === mod.ID_Modulo);
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
                                <div class="video-list-item" onclick="app.playVideo('${aula.URL_Conteudo}', '${aula.TipoConteudo}')">
                                    <i class="fa-solid fa-play-circle"></i> ${aula.Titulo}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        this.contentDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <button class="btn btn-outline-secondary btn-sm" onclick="app.navigate('meuscursos')"><i class="fa-solid fa-arrow-left"></i> Voltar</button>
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
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Novo Módulo</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formModulo">
                                <div class="mb-3">
                                    <label>Nome do Módulo</label>
                                    <input type="text" id="modTitulo" class="form-control" required>
                                </div>
                                <button type="submit" class="btn btn-primary-custom w-100">Adicionar Módulo</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Modal NOVA AULA -->
            <div class="modal fade" id="newClassModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Adicionar Vídeo (Aula)</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="formAula">
                                <div class="mb-3">
                                    <label>Módulo Destino</label>
                                    <select id="aulaModId" class="form-select" required>
                                        ${modulos.map(m => '<option value="' + m.ID_Modulo + '">' + m.Titulo + '</option>').join('')}
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label>Título da Aula</label>
                                    <input type="text" id="aulaTitulo" class="form-control" required>
                                </div>
                                <div class="mb-3">
                                    <label>Tipo</label>
                                    <select id="aulaTipo" class="form-select" required>
                                        <option value="YouTube">YouTube Embed Link</option>
                                        <option value="MP4">Link Direto (MP4)</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label>URL</label>
                                    <input type="text" id="aulaUrl" class="form-control" placeholder="URL Válida..." required>
                                </div>
                                <button type="submit" class="btn btn-primary-custom w-100">Adicionar Aula</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const formModulo = document.getElementById('formModulo');
        if(formModulo) {
            formModulo.addEventListener('submit', (e) => {
                e.preventDefault();
                const moduloNome = document.getElementById('modTitulo').value;
                const mods = DB.get('modulos');
                mods.push(new Modulo(null, cursoId, moduloNome, mods.length+1));
                DB.save('modulos', mods);
                bootstrap.Modal.getInstance(document.getElementById('newModuleModal')).hide();
                setTimeout(() => this.renderCursoPlayer(cursoId), 300);
            });
        }

        const formAula = document.getElementById('formAula');
        if(formAula) {
            formAula.addEventListener('submit', (e) => {
                e.preventDefault();
                const idMod = parseInt(document.getElementById('aulaModId').value);
                const titulo = document.getElementById('aulaTitulo').value;
                const tipo = document.getElementById('aulaTipo').value;
                const url = document.getElementById('aulaUrl').value;
                const aulasList = DB.get('aulas');
                aulasList.push(new Aula(null, idMod, titulo, tipo, url, 10, aulasList.length+1));
                DB.save('aulas', aulasList);
                bootstrap.Modal.getInstance(document.getElementById('newClassModal')).hide();
                setTimeout(() => this.renderCursoPlayer(cursoId), 300);
            });
        }
        
        if(todosAulas.length > 0 && modulos.length > 0) {
            const firstAulas = todosAulas.filter(a => a.ID_Modulo === modulos[0].ID_Modulo);
            if(firstAulas.length > 0) {
                this.playVideo(firstAulas[0].URL_Conteudo, firstAulas[0].TipoConteudo);
            }
        }
    },

    playVideo(url, tipo) {
        const container = document.getElementById('videoContainer');
        if(tipo === 'YouTube') {
            let embedUrl = url;
            if (url.includes('watch?v=')) {
                embedUrl = url.replace('watch?v=', 'embed/');
                const ampersandPos = embedUrl.indexOf('&');
                if (ampersandPos !== -1) {
                    embedUrl = embedUrl.substring(0, ampersandPos);
                }
            } else if (url.includes('youtu.be/')) {
                embedUrl = url.replace('youtu.be/', 'youtube.com/embed/');
                const questionPos = embedUrl.indexOf('?');
                if (questionPos !== -1) {
                    embedUrl = embedUrl.substring(0, questionPos);
                }
            }
            container.innerHTML = '<iframe src="' + embedUrl + '" allowfullscreen></iframe>';
        } else {
            container.innerHTML = '<video src="' + url + '" controls autoplay></video>';
        }
    },

    renderPerfil() {
        // Renderiza tela dividida: Direita = forms; Esquerda = Matrículas e Cancelamento
        const avatarSrc = this.currentUser.AvatarUrl || `https://ui-avatars.com/api/?name=${this.currentUser.NomeCompleto.replace(/ /g, '+')}&background=4361ee&color=fff`;
        
        const todasMatriculas = DB.get('matriculas');
        const ativas = todasMatriculas.filter(m => m.ID_Usuario === this.currentUser.ID_Usuario && m.Status === 'Ativa');
        const cursos = DB.get('cursos');

        this.contentDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="section-title mb-0">Minha Conta e Configurações</h2>
                <button class="btn btn-outline-danger" onclick="app.logout()"><i class="fa-solid fa-right-from-bracket"></i> Sair da Conta</button>
            </div>
            
            <div class="profile-container">
                <div class="profile-sidebar">
                    <div class="profile-pic-wrapper">
                        <img src="${avatarSrc}" id="perfilAvatarPreview" alt="Foto">
                        <label for="uploadFoto" class="profile-pic-overlay"><i class="fa-solid fa-camera"></i></label>
                        <input type="file" id="uploadFoto" style="display:none;" accept="image/*">
                    </div>
                    <h5 class="fw-bold">${this.currentUser.NomeCompleto}</h5>
                    <p class="text-muted">${this.currentUser.Email}</p>
                </div>
                
                <div class="profile-content">
                    <h5 class="mb-4">Dados Pessoais</h5>
                    <form id="formPerfil">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label>Nome Completo</label>
                                <input type="text" id="perfilNome" class="form-control" value="${this.currentUser.NomeCompleto}" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label>E-mail</label>
                                <input type="email" id="perfilEmail" class="form-control" value="${this.currentUser.Email}" required>
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
                            const c = cursos.find(curso => curso.ID_Curso === m.ID_Curso);
                            return `
                                <div class="list-group-item d-flex justify-content-between align-items-center p-3 mb-2 rounded bg-light border">
                                    <div>
                                        <h6 class="mb-0 fw-bold">${c ? c.Titulo : 'Curso Removido'}</h6>
                                        <small class="text-muted">Matrícula: ${new Date(m.DataMatricula).toLocaleDateString()}</small>
                                    </div>
                                    <button class="btn btn-sm btn-outline-danger shadow-sm" onclick="app.cancelarAssinatura(${m.ID_Matricula})">
                                        <i class="fa-solid fa-ban"></i> Cancelar Assinatura
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;

        // Lógica Upload Foto Base64
        document.getElementById('uploadFoto').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const base64 = e.target.result;
                    document.getElementById('perfilAvatarPreview').src = base64;
                    document.getElementById('loggedUserAvatar').src = base64;
                    this.currentUser.AvatarUrl = base64;
                    
                    const users = DB.get('usuarios');
                    const idx = users.findIndex(u => u.ID_Usuario === this.currentUser.ID_Usuario);
                    if(idx > -1) { users[idx].AvatarUrl = base64; DB.save('usuarios', users); }
                }
                reader.readAsDataURL(file);
            }
        });

        // Lógica Salvar Dados
        document.getElementById('formPerfil').addEventListener('submit', (e) => {
            e.preventDefault();
            this.currentUser.NomeCompleto = document.getElementById('perfilNome').value;
            this.currentUser.Email = document.getElementById('perfilEmail').value;
            const newPwd = document.getElementById('perfilSenha').value;
            if(newPwd.trim() !== '') this.currentUser.SenhaHash = newPwd;
            
            const users = DB.get('usuarios');
            const idx = users.findIndex(u => u.ID_Usuario === this.currentUser.ID_Usuario);
            if(idx > -1) { users[idx] = this.currentUser; DB.save('usuarios', users); }
            
            document.getElementById('loggedUserName').textContent = this.currentUser.NomeCompleto;
            alert("Dados atualizados com sucesso!");
        });
    },

    cancelarAssinatura(idMatricula) {
        if(!confirm("Tem certeza que quer cancelar o acesso a este conteúdo? O valor será estornado e subtraído do dashboard das métricas globais.")) return;
        
        // Cancelar Matrícula
        const matriculas = DB.get('matriculas');
        const idxMat = matriculas.findIndex(m => m.ID_Matricula === idMatricula);
        if(idxMat > -1) {
            matriculas[idxMat].Status = 'Cancelada';
            matriculas[idxMat].DataConclusao = new Date().toISOString(); // simula encerramento
            DB.save('matriculas', matriculas);
        }

        // Achar 1 Pagamento relacionado ao usuario e inativar (SIMULAÇÃO de estorno)
        const pagamentos = DB.get('pagamentos');
        // Pega o ultimo pagamento aprovado aleatório já que o mock é genérico:
        const idxPag = pagamentos.findIndex(p => p.Status === 'Aprovado');
        if(idxPag > -1) {
            pagamentos[idxPag].Status = 'Estornado';
            DB.save('pagamentos', pagamentos);
        }
        
        alert("Matrícula revogada e valor devolvido!");
        this.renderPerfil(); // recarregar
    },

    renderUsuarios() {
        const usersList = DB.get('usuarios');
        this.contentDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="section-title mb-0">Gestão de Usuários</h2>
            </div>
            <div class="custom-table-container">
                <table class="table custom-table">
                    <thead><tr><th>Nome</th><th>E-mail</th><th>Data Cadastro</th><th>Status</th></tr></thead>
                    <tbody>
                        ${usersList.map(u => `<tr><td>${u.NomeCompleto}</td><td>${u.Email}</td><td>${new Date(u.DataCadastro).toLocaleDateString()}</td><td><span class="badge-status success">Ativo</span></td></tr>`).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
};

// Start
document.addEventListener('DOMContentLoaded', () => { app.init(); });
