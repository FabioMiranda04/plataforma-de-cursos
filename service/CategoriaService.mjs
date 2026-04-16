import { Categoria } from '../model/Categoria.mjs';

const KEY = 'categorias';

export class CategoriaService {
    listar() {
        const dados = localStorage.getItem(KEY);
        return dados ? JSON.parse(dados) : [];
    }

    buscarPorId(id) {
        return this.listar().find(c => c.ID_Categoria == id) ?? null;
    }

    salvar(dados) {
        const erros = Categoria.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const lista = this.listar();
        const categoria = new Categoria(dados);
        lista.push(categoria);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return categoria;
    }

    atualizar(id, dados) {
        const erros = Categoria.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const lista = this.listar().map(c =>
            c.ID_Categoria == id ? { ...c, ...dados, ID_Categoria: c.ID_Categoria } : c
        );
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(c => c.ID_Categoria != id);
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
