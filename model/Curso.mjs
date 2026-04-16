export class Curso {
    constructor({ ID_Curso = null, Titulo, Descricao = '', ID_Instrutor = 1, ID_Categoria = 1, Nivel = 'Iniciante', ImagemCapa, DataPublicacao, TotalAulas = 0, TotalHoras = 0 }) {
        this.ID_Curso = ID_Curso ?? Date.now();
        this.Titulo = Titulo;
        this.Descricao = Descricao;
        this.ID_Instrutor = ID_Instrutor;
        this.ID_Categoria = ID_Categoria;
        this.Nivel = Nivel;
        this.ImagemCapa = ImagemCapa || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=60';
        this.DataPublicacao = DataPublicacao || new Date().toISOString();
        this.TotalAulas = TotalAulas || 0;
        this.TotalHoras = TotalHoras || 0;
    }

    static validar(dados) {
        const erros = [];
        if (!dados.Titulo?.trim()) erros.push('Título do curso é obrigatório');
        if (!dados.Nivel?.trim()) erros.push('Nível é obrigatório');
        return erros;
    }
}
