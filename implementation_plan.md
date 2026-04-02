# Plano de Revisão e Inclusão de Requisitos Pendentes

Após reavaliar o prompt inicial e sua solicitação mais recente, percebi que você deseja o formulário refinado de pagamentos (que criamos em `pagamento.html`) diretamente integrado como o **pop-up de check-out**, em vez do botão simples de "Apenas confirmar" que está lá no momento. Além disso, da ementa original do seu laboratório (LAB 03), faltaram a **organização de Trilhas de Conhecimento** e a gestão de **progresso dos usuários**.

Aqui está como implantarei o restante:

## Proposed Changes

### 1. Pagamento Rico no Modal (Pop-up de Check-out)
- **O que será feito:** Em `js/app.js` (ou `index.html`), o modal estático pequeno atual será substituído por um modal que conterá o layout do `pagamento.html` embutido. 
- **Fluxo:** Quando clicar em um Curso Não Adquirido, um grande Modal de Checkout aparecerá contendo a seleção do "Plano de Pagamento" (ex: Básico ou Premium) e os campos visuais de simulação de preenchimento do Cartão de Crédito. Ele calculará o valor dinâmico conforme o que você tinha validado no outro arquivo de pagamento.

### 2. Acompanhamento de Progresso (Assistidas / Pendentes)
- **Vídeos Assistidos:** No painel lateral do Player (à direita), onde há a lista das Aulas, introduzirei um ícone duplo (*círculo vazio* e *círculo checado*) ou um Toggle para que o aluno marque a aula como concluída.
- **Barra de Progresso Visual:** Nos cartões exibidos na aba **Meus Cursos**, surgirá uma Barra de Progresso do Bootstrap indicando o percentual gerado pelo acesso gravado na tabela `ProgressoAula`.

### 3. Trilhas de Conhecimento
- Adição da Nova Rota/Aba `Trilhas`.
- **Lógica e UI:** Uma Trilha engloba Cursos (ex: "Trilha Fullstack" engloba HTML e Lógica). Listarei cardápios maiores contendo ícones dos cursos dentro para demonstrar como seria possível gerir hierarquias grandes (`Trilha -> Curso -> Módulo -> Aula`).

## User Review Required

> [!CAUTION]
> Ao integrar a interface bonita do cartão de crédito dentro do novo Modal do Curso, a antiga página solta `pagamento.html` ficará completamente obsoleta. Confirma que este formato flutuante dentro do "Pop Up" (sobre o menu de cursos) como foi discutido é o fluxo 100% desejado agora, ao invés da tela separada?

Aguardando apenas a sua aprovação ou acréscimo final para finalizar estas adições originais do escopo.
