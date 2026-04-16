import { UsuarioService } from '../service/UsuarioService.mjs';

const svc = new UsuarioService();

// Estado global do app
export const state = {
    currentUser: null,
    contentDiv: null,
};

export function initApp() {
    state.contentDiv = document.getElementById('app-content');

    // Migração do banco antigo para o novo formato compatível
    if (!localStorage.getItem('migracao_mvc_v1')) {
        localStorage.clear();
        localStorage.setItem('migracao_mvc_v1', 'true');
        _seedDB();
    }

    const loggedId = sessionStorage.getItem('loggedUser');
    if (loggedId) {
        const u = svc.buscarPorId(Number(loggedId));
        if (u) {
            state.currentUser = u;
            setupSession();
            return;
        }
    }
    navigate('login');
}

function _seedDB() {
    // Usuários
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usuarios.length === 0) {
        localStorage.setItem('usuarios', JSON.stringify([
            { ID_Usuario: 1, NomeCompleto: 'Fábio Miranda', Email: 'fabiomirandago@gmail.com', SenhaHash: '123123', DataCadastro: new Date().toISOString(), AvatarUrl: '', Papel: 'admin' }
        ]));
    }
    // Categorias
    if (!localStorage.getItem('categorias')) {
        localStorage.setItem('categorias', JSON.stringify([
            { ID_Categoria: 1, Nome: 'Desenvolvimento', Descricao: 'Aprenda a programar' },
            { ID_Categoria: 2, Nome: 'Design', Descricao: 'Cursos de Design UI/UX' }
        ]));
    }
    // Planos
    if (!localStorage.getItem('planos')) {
        localStorage.setItem('planos', JSON.stringify([
            { ID_Plano: 1, Nome: 'Básico', Descricao: 'Acesso a 5 cursos', Preco: 49.90, DuracaoMeses: 1 },
            { ID_Plano: 2, Nome: 'Pro', Descricao: 'Acesso ilimitado', Preco: 99.90, DuracaoMeses: 12 }
        ]));
    }
    // Cursos
    if (!localStorage.getItem('cursos')) {
        localStorage.setItem('cursos', JSON.stringify([
            { ID_Curso: 1, Titulo: 'Formação Frontend Avançado', Descricao: 'Aprenda do zero', ID_Instrutor: 1, ID_Categoria: 1, Nivel: 'Iniciante', ImagemCapa: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=500&q=60', DataPublicacao: new Date().toISOString(), TotalAulas: 0, TotalHoras: 0 },
            { ID_Curso: 2, Titulo: 'Mastering UX/UI', Descricao: 'Seja um designer incrível', ID_Instrutor: 1, ID_Categoria: 2, Nivel: 'Avançado', ImagemCapa: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=500&q=60', DataPublicacao: new Date().toISOString(), TotalAulas: 0, TotalHoras: 0 },
            { ID_Curso: 3, Titulo: 'Ciência da Computação Moderna', Descricao: 'Fundamentos de algoritmos', ID_Instrutor: 1, ID_Categoria: 1, Nivel: 'Intermediário', ImagemCapa: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60', DataPublicacao: new Date().toISOString(), TotalAulas: 0, TotalHoras: 0 },
            { ID_Curso: 4, Titulo: 'Arquitetura de Software & Cloud', Descricao: 'Padrões de design corporativos', ID_Instrutor: 1, ID_Categoria: 1, Nivel: 'Avançado', ImagemCapa: 'https://images.unsplash.com/photo-1623479322729-28b25c16b011?auto=format&fit=crop&w=500&q=60', DataPublicacao: new Date().toISOString(), TotalAulas: 0, TotalHoras: 0 },
            { ID_Curso: 5, Titulo: 'Lógica de Programação do Zero', Descricao: 'Comece no mundo de TI', ID_Instrutor: 1, ID_Categoria: 1, Nivel: 'Iniciante', ImagemCapa: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=500&q=60', DataPublicacao: new Date().toISOString(), TotalAulas: 0, TotalHoras: 0 }
        ]));
    }
    // Módulos
    if (!localStorage.getItem('modulos')) {
        localStorage.setItem('modulos', JSON.stringify([
            { ID_Modulo: 1, ID_Curso: 1, Titulo: 'Módulo 1: HTML Prático', Ordem: 1 },
            { ID_Modulo: 2, ID_Curso: 1, Titulo: 'Módulo 2: CSS Masterclass', Ordem: 2 },
            { ID_Modulo: 3, ID_Curso: 2, Titulo: 'Módulo Único: UX Principles', Ordem: 1 }
        ]));
    }
    // Aulas
    if (!localStorage.getItem('aulas')) {
        localStorage.setItem('aulas', JSON.stringify([
            { ID_Aula: 1, ID_Modulo: 1, Titulo: 'Introdução ao HTML', TipoConteudo: 'YouTube', URL_Conteudo: 'https://www.youtube.com/embed/tgbNymZ7vqY', DuracaoMinutos: 10, Ordem: 1 },
            { ID_Aula: 2, ID_Modulo: 1, Titulo: 'Estrutura Básica', TipoConteudo: 'YouTube', URL_Conteudo: 'https://www.youtube.com/embed/dQw4w9WgXcQ', DuracaoMinutos: 15, Ordem: 2 },
            { ID_Aula: 3, ID_Modulo: 2, Titulo: 'Cores e Tipografia', TipoConteudo: 'MP4', URL_Conteudo: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', DuracaoMinutos: 20, Ordem: 1 },
            { ID_Aula: 4, ID_Modulo: 3, Titulo: 'Visão Geral do Curso', TipoConteudo: 'YouTube', URL_Conteudo: 'https://www.youtube.com/embed/tgbNymZ7vqY', DuracaoMinutos: 5, Ordem: 1 }
        ]));
    }
    // Matrículas e pagamentos
    if (!localStorage.getItem('matriculas')) {
        localStorage.setItem('matriculas', JSON.stringify([
            { ID_Matricula: 1, ID_Usuario: 1, ID_Curso: 1, DataMatricula: new Date().toISOString(), DataConclusao: null, Status: 'Ativa' }
        ]));
        localStorage.setItem('pagamentos', JSON.stringify([
            { ID_Pagamento: 1, ID_Assinatura: 1, ValorPago: 49.90, DataPagamento: new Date().toISOString(), MetodoPagamento: 'Cartão de Crédito', Id_Transacao_Gateway: 'TXD_123456', Status: 'Aprovado' }
        ]));
    }
}

export function setupSession() {
    document.getElementById('mainTabs').style.display = 'flex';
    document.getElementById('userProfileBlock').style.display = 'flex';
    document.getElementById('loggedUserName').textContent = state.currentUser.NomeCompleto;
    const avatarUrl = state.currentUser.AvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(state.currentUser.NomeCompleto)}&background=4361ee&color=fff`;
    document.getElementById('loggedUserAvatar').src = avatarUrl;
    navigate('dashboard');
}

export function logout() {
    sessionStorage.removeItem('loggedUser');
    state.currentUser = null;
    document.getElementById('mainTabs').style.display = 'none';
    document.getElementById('userProfileBlock').style.display = 'none';
    navigate('login');
}

export function navigate(viewName) {
    document.querySelectorAll('.nav-tabs-custom .nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.target === viewName) link.classList.add('active');
    });
    window.scrollTo(0, 0);
    // Emite evento customizado para os controllers escutarem
    document.dispatchEvent(new CustomEvent('app:navigate', { detail: { viewName } }));
}

export function renderLogin() {
    state.contentDiv.innerHTML = `
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
        const todos = svc.listar();
        const found = todos.find(u => u.Email === email);
        if (found) {
            sessionStorage.setItem('loggedUser', found.ID_Usuario);
            state.currentUser = found;
            setupSession();
        } else {
            alert('Usuário não encontrado!');
        }
    });
}
