export class Modulo {
    constructor({ ID_Modulo = null, ID_Curso, Titulo, Ordem = 1 }) {
        this.ID_Modulo = ID_Modulo ?? Date.now();
        this.ID_Curso = ID_Curso;
        this.Titulo = Titulo;
        this.Ordem = Ordem;
    }

    static validar(dados) {
        const erros = [];
        if (!dados.Titulo?.trim()) erros.push('Título do módulo é obrigatório');
        if (!dados.ID_Curso) erros.push('Curso é obrigatório');
        return erros;
    }
}
