export class Categoria {
    constructor({ ID_Categoria = null, Nome, Descricao = '' }) {
        this.ID_Categoria = ID_Categoria ?? Date.now();
        this.Nome = Nome;
        this.Descricao = Descricao;
    }

    static validar(dados) {
        const erros = [];
        if (!dados.Nome?.trim()) erros.push('Nome da categoria é obrigatório');
        return erros;
    }
}
