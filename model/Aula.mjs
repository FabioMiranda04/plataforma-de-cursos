export class Aula {
    constructor({ ID_Aula = null, ID_Modulo, Titulo, TipoConteudo = 'YouTube', URL_Conteudo, DuracaoMinutos = 10, Ordem = 1 }) {
        this.ID_Aula = ID_Aula ?? Date.now();
        this.ID_Modulo = ID_Modulo;
        this.Titulo = Titulo;
        this.TipoConteudo = TipoConteudo;
        this.URL_Conteudo = URL_Conteudo;
        this.DuracaoMinutos = DuracaoMinutos;
        this.Ordem = Ordem;
    }

    static validar(dados) {
        const erros = [];
        if (!dados.Titulo?.trim()) erros.push('Título da aula é obrigatório');
        if (!dados.ID_Modulo) erros.push('Módulo é obrigatório');
        if (!dados.URL_Conteudo?.trim()) erros.push('URL é obrigatória');
        return erros;
    }
}
