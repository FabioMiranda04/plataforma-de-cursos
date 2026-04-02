# Plataforma de Cursos Online

Uma plataforma de cursos online moderna, bela e dinâmica construída com HTML, CSS e JavaScript puros. O projeto é focado em experiência do usuário e alta agilidade visual por ser uma Single Page Application (SPA), garantindo transições suaves sem que a página precise recarregar.

## 🚀 Como executar o aplicativo na sua máquina local

Para ver o projeto funcionando é algo extremamente simples. Por ser um sistema baseado em componentes estáticos nativos da web, **não é necessário instalar nenhuma linguagem de backend, servidores complexos, nem bibliotecas como Node.js**.

### Passo a passo:

1. **Baixe ou clone o projeto:**
   - Faça um clone através do Git:
     ```bash
     git clone <URL_DO_SEU_REPOSITORIO>
     ```
   - Ou faça o download do repositório em formato **.zip** diretamente pelo GitHub e extraia os arquivos no seu computador.

2. **Entre na pasta:**
   Vá até a pasta gerada, seja no gerenciador de janelas do seu computador ou via terminal. Encontre o arquivo que serve como base central da plataforma.

3. **Lançamento / Inicialização:**
   - Para iniciar o app, basta simplesmente **dar um duplo clique no arquivo `index.html`** no seu gerenciador de arquivos (File Explorer).
   - Uma aba irá se abrir automaticamente no seu navegador web padrão carregando toda a plataforma. Recomendamos o uso de navegadores modernos como o **Google Chrome, Mozilla Firefox, Microsoft Edge ou Safari**.

### O que esperar da primeira execução?
A plataforma possui um sistema inteligente de simulação de banco de dados (`js/database.js`) usando o *Local Storage* do Google Chrome/Navegador. Ao iniciar o `index.html` pela primeira vez, o sistema vai preencher automaticamente alguns dados de teste, como:
- Exemplos de cursos completos com módulos e aulas.
- Um usuário de testes.
- Simuladores de vídeos (com direito até a um divertido "Rick Roll"!).

Você pode interagir livremente: acessar cursos, verificar aulas e testar o funcionamento simulado de inscrições e assinaturas!

## 🛠️ Stack Tecnológica e Ferramentas

- **Linguagem Estrutural**: **HTML5** Semântico.
- **Estética e Design**: **CSS3 Vanilla** moderno, contemplando Glassmorphism, Design System com CSS Variables e layout totalmente Responsivo.
- **Lógica e Sistema**: **Vanilla JavaScript (ES6+)** gerenciando rotas, manipulação agressiva e dinâmica da DOM e persistência local provisória.

## 🗂️ Estrutura de Diretórios Básica

- `index.html`: A base de toda a SPA (Single Page Application).
- `pagamento.html`: Responsável pelo portal seguro de finalização de compras e checkout de cursos.
- `/js`: Todos os controladores, eventos globais e classe de simulação de BD (`database.js`).
- `/css`: Folha de estilo de extrema qualidade visual `styles.css`.
