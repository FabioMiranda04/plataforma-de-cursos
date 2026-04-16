import { Modulo } from '../model/Modulo.mjs';

const KEY = 'modulos';

export class ModuloService {
    listar() {
        const dados = localStorage.getItem(KEY);
        return dados ? JSON.parse(dados) : [];
    }

    listarPorCurso(idCurso) {
        return this.listar().filter(m => m.ID_Curso == idCurso);
    }

    buscarPorId(id) {
        return this.listar().find(m => m.ID_Modulo == id) ?? null;
    }

    salvar(dados) {
        const erros = Modulo.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const lista = this.listar();
        const modulo = new Modulo(dados);
        lista.push(modulo);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return modulo;
    }

    atualizar(id, dados) {
        const erros = Modulo.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const lista = this.listar().map(m =>
            m.ID_Modulo == id ? { ...m, ...dados, ID_Modulo: m.ID_Modulo } : m
        );
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(m => m.ID_Modulo != id);
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
