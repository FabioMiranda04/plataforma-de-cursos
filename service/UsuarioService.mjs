import { Usuario } from '../model/Usuario.mjs';

const KEY = 'usuarios';

export class UsuarioService {
    listar() {
        const dados = localStorage.getItem(KEY);
        return dados ? JSON.parse(dados) : [];
    }

    buscarPorId(id) {
        return this.listar().find(u => u.ID_Usuario == id) ?? null;
    }

    buscarPorEmail(email) {
        return this.listar().find(u => u.Email === email) ?? null;
    }

    salvar(dados) {
        const erros = Usuario.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const emailExiste = this.buscarPorEmail(dados.Email);
        if (emailExiste) throw new Error('E-mail já cadastrado');
        const lista = this.listar();
        const usuario = new Usuario(dados);
        lista.push(usuario);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return usuario;
    }

    atualizar(id, dados) {
        const erros = Usuario.validarEdicao(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        const lista = this.listar().map(u =>
            u.ID_Usuario == id ? { ...u, ...dados, ID_Usuario: u.ID_Usuario } : u
        );
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(u => u.ID_Usuario != id);
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
