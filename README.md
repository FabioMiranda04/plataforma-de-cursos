# Plataforma de Cursos Online

Uma plataforma educacional completa desenvolvida sob o conceito de Single Page Application (SPA). O projeto foi desenhado para oferecer uma experiência de usuário (UX) fluida e de alta performance, utilizando conceitos funcionais do desenvolvimento frontend sem a dependência inicial de bibliotecas ou frameworks externos.

## Funcionalidades Principais

O sistema contempla as seguintes soluções e fluxos arquitetônicos:

- **Arquitetura SPA:** Navegação ininterrupta e transições entre rotas na mesma página web sem a necessidade de recarregamento completo do DOM.
- **Catálogo Dinâmico de Aprendizagem:** Listagem de cursos gerenciáveis integrados a um banco de dados relacional simulado (estruturado por categorias, trilhas de conhecimento e nível técnico).
- **Gestão de Sessão e Autenticação (Mock):** Sistema integrado de login e criação de usuários com validação estrutural diretamente no ambiente cliente.
- **Painel do Aluno ("Meus Cursos"):** Dashboard customizado com métricas de estado de matrículas, monitoramento de progresso e visualização percentual das trilhas do aluno.
- **Visualizador e Reprodutor de Conteúdo:** Ambiente de aula integrado habilitado para renderizar emissores como *iframes* padronizados (ex: YouTube) ou extensões de mídia nativas (MP4).
- **Checkout Seguro Simulado:** Fluxo de carrinho e transação de pagamento na interface independente `pagamento.html`, contemplando simulação de dados de cobrança e gateways de cartão de crédito.
- **Persistência de Dados via Armazenamento Local:** Orquestra a injeção e o resgate de consultas ao banco por meio da API nativa do `localStorage` (via `js/database.js`), mantendo o estado vitalício da matrícula e configurações de curso mesmo após o fim da sessão em memória.
- **Sistema de Design e Componentes Visuais (UI):** Interfaces construídas do zero provendo alto grau de design system, aplicando conceitos como *Glassmorphism*, sistema rigoroso de variáveis CSS, responsividade nativa completa (Mobile First) e tipografia padronizada.

## Como Executar o Projeto Localmente

A solução foi consolidada com arquitetura Serverless puramente estática em seu lado cliente. Portanto, o ambiente funciona inteiramente via renderização pelo navegador (Client-Side Rendering) sem exigir a instalação paralela de ambientes de execução (Node.js, Runtime Engines) ou gerenciadores de pacotes.

### Procedimentos para Teste

1. **Obtenção do Código-Fonte**
   Realize a clonagem do repositório em sua máquina local utilizando o Git pelo terminal:
   ```bash
   git clone https://github.com/FabioMiranda04/plataforma-de-cursos.git
   ```
   *Em alternativas estáticas, efetue o download do binário via arquivo compactado clicando no painel desta mesma página de repositório.*

2. **Preparação de Ambiente**
   Direcione o sistema para a raiz do diretório recém-clonado. Não é requerida a instalação de dependências ou *build process*.

3. **Iniciação de Instância**
   Inicie o arquivo base principal, **`index.html`**, executando-o a partir de qualquer navegador web atualizado (Recomendado: *Google Chrome, Mozilla Firefox, Microsoft Edge ou equivalentes*). A aplicação será montada localmente no próprio ambiente do browser.

### Inicialização Estrutural de Dados Internos
Na primeira execução lógica da indexação, o modulo de banco de dados (`js/database.js`) detectará a nulidade nas chaves do `localStorage` e preencherá automaticamente os modelos de dados padrões. Isto injetará contas para testes preestabelecidas, planos virtuais, listagem complexa de módulos de cursos e métricas genéricas na rede, permitindo uso funcional imediato das plataformas de pagamento ou navegação em aulas para fins de simulação corporativa e homologação do software.

## Arquitetura de Diretórios e Escopo Modular

- `/` *(raiz)*: Contempla os arquivos de ponta ou entrada da aplicação, contendo a matriz central unificada (`index.html`) e o canal segmentado de pagamento (`pagamento.html`).
- `/js`: Armazena toda a lógica de manipulação estrutural da DOM, validações de sessões e o componente provisório de Modelos do BD (`database.js`).
- `/css`: Estruturas globais de classes em formato cascata, paletas de design do sistema e comportamentos responsivos (`styles.css`).

## Tecnologias Base

- **HTML5:** Implementação estrutural semântica das camadas visuais e isolamento arquitetônico dos nós de DOM.
- **CSS3 (Vanilla Base):** Sistema robusto com integração avançada de UI/UX abrangendo flexbox, CSS Grids e media queries de alta precisão.
- **JavaScript (ECMAScript / ES6+):** Programação assíncrona, instanciação de classes orientada a objeto e gerenciamento avançado de estado no painel do usuário final.
