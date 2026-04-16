import { Plano } from '../model/Plano.mjs';

const KEY = 'planos';

export class PlanoService {
    listar() {
        const dados = localStorage.getItem(KEY);
        return dados ? JSON.parse(dados) : [];
    }

    buscarPorId(id) {
        return this.listar().find(p => p.ID_Plano == id) ?? null;
    }

    salvar(dados) {
        const erros = Plano.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const lista = this.listar();
        const plano = new Plano(dados);
        lista.push(plano);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return plano;
    }

    atualizar(id, dados) {
        const erros = Plano.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const lista = this.listar().map(p =>
            p.ID_Plano == id ? { ...p, ...dados, ID_Plano: p.ID_Plano } : p
        );
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(p => p.ID_Plano != id);
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
