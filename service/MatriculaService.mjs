import { Matricula } from '../model/Matricula.mjs';

const KEY = 'matriculas';

export class MatriculaService {
    listar() {
        const dados = localStorage.getItem(KEY);
        return dados ? JSON.parse(dados) : [];
    }

    listarPorUsuario(idUsuario) {
        return this.listar().filter(m => m.ID_Usuario == idUsuario);
    }

    buscarPorId(id) {
        return this.listar().find(m => m.ID_Matricula == id) ?? null;
    }

    usuarioPossuiCurso(idUsuario, idCurso) {
        return this.listar().some(m => m.ID_Usuario == idUsuario && m.ID_Curso == idCurso && m.Status === 'Ativa');
    }

    salvar(dados) {
        const erros = Matricula.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const lista = this.listar();
        const matricula = new Matricula(dados);
        lista.push(matricula);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return matricula;
    }

    atualizar(id, dados) {
        const lista = this.listar().map(m =>
            m.ID_Matricula == id ? { ...m, ...dados, ID_Matricula: m.ID_Matricula } : m
        );
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(m => m.ID_Matricula != id);
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
