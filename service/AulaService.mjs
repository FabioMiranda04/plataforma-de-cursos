import { Aula } from '../model/Aula.mjs';

const KEY = 'aulas';

export class AulaService {
    listar() {
        const dados = localStorage.getItem(KEY);
        return dados ? JSON.parse(dados) : [];
    }

    listarPorModulo(idModulo) {
        return this.listar().filter(a => a.ID_Modulo == idModulo);
    }

    buscarPorId(id) {
        return this.listar().find(a => a.ID_Aula == id) ?? null;
    }

    salvar(dados) {
        const erros = Aula.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const lista = this.listar();
        const aula = new Aula(dados);
        lista.push(aula);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return aula;
    }

    atualizar(id, dados) {
        const erros = Aula.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const lista = this.listar().map(a =>
            a.ID_Aula == id ? { ...a, ...dados, ID_Aula: a.ID_Aula } : a
        );
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(a => a.ID_Aula != id);
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
