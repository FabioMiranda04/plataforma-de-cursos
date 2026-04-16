import { Curso } from '../model/Curso.mjs';

const KEY = 'cursos';

export class CursoService {
    listar() {
        const dados = localStorage.getItem(KEY);
        return dados ? JSON.parse(dados) : [];
    }

    buscarPorId(id) {
        return this.listar().find(c => c.ID_Curso == id) ?? null;
    }

    salvar(dados) {
        const erros = Curso.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const lista = this.listar();
        const curso = new Curso(dados);
        lista.push(curso);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return curso;
    }

    atualizar(id, dados) {
        const erros = Curso.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const lista = this.listar().map(c =>
            c.ID_Curso == id ? { ...c, ...dados, ID_Curso: c.ID_Curso } : c
        );
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(c => c.ID_Curso != id);
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
