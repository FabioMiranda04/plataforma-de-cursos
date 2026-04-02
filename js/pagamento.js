document.addEventListener('DOMContentLoaded', () => {
    DB.init(); // Garante que os dados mocados base existem
    
    const planosContainer = document.getElementById('planosContainer');
    const userSelect = document.getElementById('userSelect');
    const totalValueTag = document.getElementById('totalValue');
    const paymentForm = document.getElementById('paymentForm');
    
    let planoSelecionado = null;

    // Carregar usuários para o mock do form
    const usuarios = DB.get('usuarios');
    usuarios.forEach(user => {
        const option = document.createElement('option');
        option.value = user.ID_Usuario;
        option.textContent = `${user.NomeCompleto} (${user.Email})`;
        userSelect.appendChild(option);
    });

    // Carregar Planos do LocalStorage
    const planos = DB.get('planos');
    planos.forEach(plano => {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        col.innerHTML = `
            <div class="plan-card" data-id="${plano.ID_Plano}" data-preco="${plano.Preco}">
                <h5>${plano.Nome}</h5>
                <p class="text-muted mb-2">${plano.Descricao} - ${plano.DuracaoMeses} Meses</p>
                <h3 class="text-primary mb-0">R$ ${parseFloat(plano.Preco).toFixed(2).replace('.', ',')}</h3>
            </div>
        `;
        planosContainer.appendChild(col);
    });

    // Evento de seleção de Plano
    planosContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.plan-card');
        if (card) {
            document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            planoSelecionado = {
                id: card.dataset.id,
                preco: parseFloat(card.dataset.preco)
            };
            
            totalValueTag.textContent = `Total: R$ ${planoSelecionado.preco.toFixed(2).replace('.', ',')}`;
        }
    });

    // Submit de pagamento
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!planoSelecionado) {
            alert("Selecione um plano antes de fechar o pagamento.");
            return;
        }

        const idUsuario = userSelect.value;
        const metodo = document.getElementById('metodoPagamento').value;
        const preco = planoSelecionado.preco;

        // Gerar Assinatura Mapeada no DB
        const assinaturas = DB.get('assinaturas');
        const novaAssinatura = new Assinatura(
            Date.now(),
            idUsuario,
            planoSelecionado.id,
            new Date().toISOString(),
            new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString() // mock de 1 mês
        );
        assinaturas.push(novaAssinatura);
        DB.save('assinaturas', assinaturas);

        // Gerar Pagamento Mapeado no DB
        const pagamentos = DB.get('pagamentos');
        const novoPagamento = new Pagamento(
            Date.now(),
            novaAssinatura.ID_Assinatura,
            preco,
            new Date().toISOString(),
            metodo,
            `TXD_${Math.floor(Math.random() * 1000000)}`
        );
        pagamentos.push(novoPagamento);
        DB.save('pagamentos', pagamentos);

        // Sucesso
        const modalDom = document.getElementById('successModal');
        const bsModal = new bootstrap.Modal(modalDom);
        bsModal.show();
    });
});
