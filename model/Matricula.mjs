export class Matricula {
    constructor({ ID_Matricula = null, ID_Usuario, ID_Curso, DataMatricula, DataConclusao = null, Status = 'Ativa' }) {
        this.ID_Matricula = ID_Matricula ?? Date.now();
        this.ID_Usuario = ID_Usuario;
        this.ID_Curso = ID_Curso;
        this.DataMatricula = DataMatricula || new Date().toISOString();
        this.DataConclusao = DataConclusao || null;
        this.Status = Status || 'Ativa';
    }

    static validar(dados) {
        const erros = [];
        if (!dados.ID_Usuario) erros.push('Usuário é obrigatório');
        if (!dados.ID_Curso) erros.push('Curso é obrigatório');
        return erros;
    }
}
