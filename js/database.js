class DB {
    static get(table) {
        const data = localStorage.getItem(table);
        return data ? JSON.parse(data) : [];
    }
    static save(table, data) {
        localStorage.setItem(table, JSON.stringify(data));
    }
    static getById(table, pKeyName, id) {
        const all = this.get(table);
        return all.find(item => item[pKeyName] == id);
    }
    
    // Método para popular o banco inicial caso esteja vazio
    static init() {
        if (this.get('usuarios').length === 0) {
            const defaultUser = new Usuario(1, 'Fábio Miranda', 'fabiomirandago@gmail.com', '123123', new Date().toISOString(), '');
            this.save('usuarios', [defaultUser]);
        }
        if (this.get('matriculas').length === 0) {
            this.save('matriculas', [
                new Matricula(1, 1, 1, new Date().toISOString(), null, 'Ativa')
            ]);
            this.save('assinaturas', [
                new Assinatura(1, 1, 1, new Date().toISOString(), new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString())
            ]);
            this.save('pagamentos', [
                new Pagamento(1, 1, 49.90, new Date().toISOString(), 'Cartão de Crédito', 'TXD_123456', 'Aprovado')
            ]);
        }
        if (this.get('categorias').length === 0) {
            this.save('categorias', [
                new Categoria(1, 'Desenvolvimento', 'Aprenda a programar'),
                new Categoria(2, 'Design', 'Cursos de Design UI/UX')
            ]);
        }
        if (this.get('planos').length === 0) {
            this.save('planos', [
                new Plano(1, 'Básico', 'Acesso a 5 cursos', 49.90, 1),
                new Plano(2, 'Pro', 'Acesso ilimitado', 99.90, 12)
            ]);
        }
        if (this.get('cursos').length === 0) {
            this.save('cursos', [
                new Curso(1, 'Formação Frontend Avançado', 'Aprenda do zero', 1, 1, 'Iniciante', 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=500&q=60'),
                new Curso(2, 'Mastering UX/UI', 'Seja um designer incrível', 1, 2, 'Avançado', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=500&q=60'),
                new Curso(3, 'Ciência da Computação Moderna', 'Fundamentos de algoritmos e estrutura de dados', 1, 1, 'Intermediário', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=500&q=60'),
                new Curso(4, 'Arquitetura de Software & Cloud', 'Padrões de design corporativos', 1, 1, 'Avançado', 'https://images.unsplash.com/photo-1623479322729-28b25c16b011?auto=format&fit=crop&w=500&q=60'),
                new Curso(5, 'Lógica de Programação do Zero', 'Comece no mundo de TI', 1, 1, 'Iniciante', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=500&q=60')
            ]);
            this.save('modulos', [
                new Modulo(1, 1, 'Módulo 1: HTML Prático', 1),
                new Modulo(2, 1, 'Módulo 2: CSS Masterclass', 2),
                new Modulo(3, 2, 'Módulo Único: UX Principles', 1)
            ]);
            this.save('aulas', [
                new Aula(1, 1, 'Introdução ao HTML', 'YouTube', 'https://www.youtube.com/embed/tgbNymZ7vqY', 10, 1),
                new Aula(2, 1, 'Estrutura Básica', 'YouTube', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 15, 2),
                new Aula(3, 2, 'Cores e Tipografia (MP4)', 'MP4', 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 20, 1),
                new Aula(4, 3, 'Visão Geral do Curso', 'YouTube', 'https://www.youtube.com/embed/tgbNymZ7vqY', 5, 1)
            ]);
        }
    }
}

class Usuario {
    constructor(ID_Usuario, NomeCompleto, Email, SenhaHash, DataCadastro, AvatarUrl) {
        this.ID_Usuario = ID_Usuario || Date.now();
        this.NomeCompleto = NomeCompleto;
        this.Email = Email;
        this.SenhaHash = SenhaHash;
        this.DataCadastro = DataCadastro || new Date().toISOString();
        this.AvatarUrl = AvatarUrl || '';
    }
}

class Categoria {
    constructor(ID_Categoria, Nome, Descricao) {
        this.ID_Categoria = ID_Categoria || Date.now();
        this.Nome = Nome;
        this.Descricao = Descricao;
    }
}

class Curso {
    constructor(ID_Curso, Titulo, Descricao, ID_Instrutor, ID_Categoria, Nivel, ImagemCapa, DataPublicacao, TotalAulas, TotalHoras) {
        this.ID_Curso = ID_Curso || Date.now();
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
}

class Modulo {
    constructor(ID_Modulo, ID_Curso, Titulo, Ordem) {
        this.ID_Modulo = ID_Modulo || Date.now();
        this.ID_Curso = ID_Curso;
        this.Titulo = Titulo;
        this.Ordem = Ordem;
    }
}

class Aula {
    constructor(ID_Aula, ID_Modulo, Titulo, TipoConteudo, URL_Conteudo, DuracaoMinutos, Ordem) {
        this.ID_Aula = ID_Aula || Date.now();
        this.ID_Modulo = ID_Modulo;
        this.Titulo = Titulo;
        this.TipoConteudo = TipoConteudo;
        this.URL_Conteudo = URL_Conteudo;
        this.DuracaoMinutos = DuracaoMinutos;
        this.Ordem = Ordem;
    }
}

class Matricula {
    constructor(ID_Matricula, ID_Usuario, ID_Curso, DataMatricula, DataConclusao, Status) {
        this.ID_Matricula = ID_Matricula || Date.now();
        this.ID_Usuario = ID_Usuario;
        this.ID_Curso = ID_Curso;
        this.DataMatricula = DataMatricula || new Date().toISOString();
        this.DataConclusao = DataConclusao || null;
        this.Status = Status || 'Ativa';
    }
}

class ProgressoAula {
    constructor(ID_Usuario, ID_Aula, DataConclusao, Status) {
        this.ID_Usuario = ID_Usuario;
        this.ID_Aula = ID_Aula;
        this.DataConclusao = DataConclusao;
        this.Status = Status || 'Pendente'; 
    }
}

class Avaliacao {
    constructor(ID_Avaliacao, ID_Usuario, ID_Curso, Nota, Comentario, DataAvaliacao) {
        this.ID_Avaliacao = ID_Avaliacao || Date.now();
        this.ID_Usuario = ID_Usuario;
        this.ID_Curso = ID_Curso;
        this.Nota = Nota;
        this.Comentario = Comentario;
        this.DataAvaliacao = DataAvaliacao || new Date().toISOString();
    }
}

class Trilha {
    constructor(ID_Trilha, Titulo, Descricao, ID_Categoria) {
        this.ID_Trilha = ID_Trilha || Date.now();
        this.Titulo = Titulo;
        this.Descricao = Descricao;
        this.ID_Categoria = ID_Categoria;
    }
}

class TrilhaCurso {
    constructor(ID_Trilha, ID_Curso, Ordem) {
        this.ID_Trilha = ID_Trilha;
        this.ID_Curso = ID_Curso;
        this.Ordem = Ordem;
    }
}

class Certificado {
    constructor(ID_Certificado, ID_Usuario, ID_Curso, ID_Trilha, CodigoVerificacao, DataEmissao) {
        this.ID_Certificado = ID_Certificado || Date.now();
        this.ID_Usuario = ID_Usuario;
        this.ID_Curso = ID_Curso;
        this.ID_Trilha = ID_Trilha || null;
        this.CodigoVerificacao = CodigoVerificacao;
        this.DataEmissao = DataEmissao || new Date().toISOString();
    }
}

class Plano {
    constructor(ID_Plano, Nome, Descricao, Preco, DuracaoMeses) {
        this.ID_Plano = ID_Plano || Date.now();
        this.Nome = Nome;
        this.Descricao = Descricao;
        this.Preco = Preco;
        this.DuracaoMeses = DuracaoMeses;
    }
}

class Assinatura {
    constructor(ID_Assinatura, ID_Usuario, ID_Plano, DataInicio, DataFim) {
        this.ID_Assinatura = ID_Assinatura || Date.now();
        this.ID_Usuario = ID_Usuario;
        this.ID_Plano = ID_Plano;
        this.DataInicio = DataInicio;
        this.DataFim = DataFim;
    }
}

class Pagamento {
    constructor(ID_Pagamento, ID_Assinatura, ValorPago, DataPagamento, MetodoPagamento, Id_Transacao_Gateway, Status) {
        this.ID_Pagamento = ID_Pagamento || Date.now();
        this.ID_Assinatura = ID_Assinatura;
        this.ValorPago = ValorPago;
        this.DataPagamento = DataPagamento;
        this.MetodoPagamento = MetodoPagamento;
        this.Id_Transacao_Gateway = Id_Transacao_Gateway;
        this.Status = Status || 'Aprovado';
    }
}
