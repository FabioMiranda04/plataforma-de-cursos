export class Usuario {
    constructor({ ID_Usuario = null, NomeCompleto, Email, SenhaHash, DataCadastro, AvatarUrl = '', Papel = 'aluno' }) {
        this.ID_Usuario = ID_Usuario ?? Date.now();
        this.NomeCompleto = NomeCompleto;
        this.Email = Email;
        this.SenhaHash = SenhaHash;
        this.DataCadastro = DataCadastro || new Date().toISOString();
        this.AvatarUrl = AvatarUrl || '';
        this.Papel = Papel || 'aluno'; // 'admin' | 'aluno'
    }

    static validar(dados) {
        const erros = [];
        if (!dados.NomeCompleto?.trim()) erros.push('Nome é obrigatório');
        if (!dados.Email?.trim()) erros.push('E-mail é obrigatório');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.Email)) erros.push('E-mail inválido');
        if (!dados.SenhaHash?.trim()) erros.push('Senha é obrigatória');
        return erros;
    }

    static validarEdicao(dados) {
        const erros = [];
        if (!dados.NomeCompleto?.trim()) erros.push('Nome é obrigatório');
        if (!dados.Email?.trim()) erros.push('E-mail é obrigatório');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.Email)) erros.push('E-mail inválido');
        return erros;
    }
}
