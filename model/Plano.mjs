export class Plano {
    constructor({ ID_Plano = null, Nome, Descricao = '', Preco, DuracaoMeses = 1 }) {
        this.ID_Plano = ID_Plano ?? Date.now();
        this.Nome = Nome;
        this.Descricao = Descricao;
        this.Preco = Preco;
        this.DuracaoMeses = DuracaoMeses;
    }

    static validar(dados) {
        const erros = [];
        if (!dados.Nome?.trim()) erros.push('Nome do plano é obrigatório');
        if (dados.Preco === undefined || dados.Preco === '') erros.push('Preço é obrigatório');
        return erros;
    }
}
