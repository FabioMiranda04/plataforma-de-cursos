// ─── Imports dos Controllers ─────────────────────────────────────────────────
import {
    initApp, navigate, logout, state
} from '../controller/AppController.mjs';

import { renderLogin } from '../controller/AppController.mjs';
import { renderDashboard } from '../controller/DashboardController.mjs';

import {
    renderGaleria, renderMeusCursos,
    checkAcessoCurso, finalizarCompra,
    renderCursoPlayer, playVideo
} from '../controller/CursoController.mjs';

import {
    renderPerfil, cancelarAssinatura,
    renderAdminUsuarios, abrirModalUsuario, editarUsuario, excluirUsuario
} from '../controller/UsuarioController.mjs';

import {
    renderAdminCursos, abrirModalCurso, editarCurso, excluirCurso
} from '../controller/AdminCursoController.mjs';

import {
    renderAdminCategorias, abrirModalCategoria, editarCategoria, excluirCategoria
} from '../controller/AdminCategoriaController.mjs';

import {
    renderAdminModulos, abrirModalModulo, editarModulo, excluirModulo, filtrarModulos
} from '../controller/AdminModuloController.mjs';

import {
    renderAdminAulas, abrirModalAula, editarAula, excluirAula, filtrarAulas
} from '../controller/AdminAulaController.mjs';

import {
    renderAdminMatriculas, abrirModalMatricula, editarMatricula, excluirMatricula
} from '../controller/AdminMatriculaController.mjs';

// ─── Roteador de views ───────────────────────────────────────────────────────
document.addEventListener('app:navigate', (e) => {
    const view = e.detail.viewName;
    const contentDiv = document.getElementById('app-content');

    switch (view) {
        case 'login':
            renderLogin();
            break;
        case 'dashboard':
            renderDashboard();
            break;
        case 'cursos':
            renderGaleria();
            break;
        case 'meuscursos':
            renderMeusCursos();
            break;
        case 'perfil':
            document.querySelectorAll('.nav-tabs-custom .nav-link').forEach(l => l.classList.remove('active'));
            renderPerfil();
            break;
        // Admin
        case 'admin-usuarios':
            renderAdminUsuarios();
            break;
        case 'admin-cursos':
            renderAdminCursos();
            break;
        case 'admin-categorias':
            renderAdminCategorias();
            break;
        case 'admin-modulos':
            renderAdminModulos();
            break;
        case 'admin-aulas':
            renderAdminAulas();
            break;
        case 'admin-matriculas':
            renderAdminMatriculas();
            break;
    }
});

// ─── Expõe funções globalmente (necessário para onclick no HTML) ───────────────
Object.assign(window, {
    navigate,
    logout,

    // Cursos
    checkAcessoCurso,
    finalizarCompra,
    renderCursoPlayer,
    playVideo,

    // Perfil
    renderPerfil,
    cancelarAssinatura,

    // Admin — Usuários
    renderAdminUsuarios,
    abrirModalUsuario,
    editarUsuario,
    excluirUsuario,

    // Admin — Cursos
    renderAdminCursos,
    abrirModalCurso,
    editarCurso,
    excluirCurso,

    // Admin — Categorias
    renderAdminCategorias,
    abrirModalCategoria,
    editarCategoria,
    excluirCategoria,

    // Admin — Módulos
    renderAdminModulos,
    abrirModalModulo,
    editarModulo,
    excluirModulo,
    filtrarModulos,

    // Admin — Aulas
    renderAdminAulas,
    abrirModalAula,
    editarAula,
    excluirAula,
    filtrarAulas,

    // Admin — Matrículas
    renderAdminMatriculas,
    abrirModalMatricula,
    editarMatricula,
    excluirMatricula,
});

// ─── Inicializa o app ────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});
