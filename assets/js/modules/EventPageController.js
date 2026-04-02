/**
 * Controla os comportamentos da página de eventos (Formulário Nativo, Máscaras e Validações Avançadas).
 */
export class EventPageController {
    constructor() {
        this.form = document.getElementById('native-checkout-form');
        this.loadingState = document.getElementById('checkout-loading');
        
        // Binds
        this.handleCheckoutSubmit = this.handleCheckoutSubmit.bind(this);
        this.applyPhoneMask = this.applyPhoneMask.bind(this);
        this.validateEmailLive = this.validateEmailLive.bind(this);
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleCheckoutSubmit);
            
            // Máscaras de telefone
            const whatsappInput = document.getElementById('whatsapp');
            const emergenciaInput = document.getElementById('emergencia');
            if (whatsappInput) whatsappInput.addEventListener('input', this.applyPhoneMask);
            if (emergenciaInput) emergenciaInput.addEventListener('input', this.applyPhoneMask);

            // Validação visual de email em tempo real
            const emailInput = document.getElementById('email');
            if (emailInput) emailInput.addEventListener('input', this.validateEmailLive);
        }
    }

    // Aplica máscara (XX) XXXXX-XXXX em tempo real
    applyPhoneMask(e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    }

    // Checa Email com Regex rigoroso e muda a cor da borda
    validateEmailLive(e) {
        const email = e.target.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email.length === 0) {
            e.target.style.borderColor = '#ccc'; // Padrão se vazio
            e.target.style.boxShadow = 'none';
        } else if (!emailRegex.test(email)) {
            e.target.style.borderColor = '#e74c3c'; // Vermelho (Inválido)
            e.target.style.boxShadow = '0 0 0 2px rgba(231, 76, 60, 0.2)';
        } else {
            e.target.style.borderColor = '#2ecc71'; // Verde (Válido)
            e.target.style.boxShadow = '0 0 0 2px rgba(46, 204, 113, 0.2)';
        }
    }

    // Auxiliar puramente lógico para o Submit
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    async handleCheckoutSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const customerData = Object.fromEntries(formData.entries());

        // 1. Validação de Email
        if (!this.isValidEmail(customerData.email)) {
            alert("Por favor, preencha um e-mail válido (ex: nome@email.com).");
            document.getElementById('email').focus();
            return;
        }

        // 2. Validação de Contatos Distintos
        const whatsLimpo = customerData.whatsapp.replace(/\D/g, '');
        const emergLimpo = customerData.emergencia.replace(/\D/g, '');
        
        if (whatsLimpo.length < 10) {
            alert("O seu WhatsApp precisa ter o DDD e o número correto.");
            document.getElementById('whatsapp').focus();
            return;
        }
        if (whatsLimpo === emergLimpo) {
            alert("O contato de emergência precisa ser um número diferente do seu WhatsApp pessoal.");
            document.getElementById('emergencia').focus();
            return;
        }

        // 3. Validação de Data de Nascimento (Nem futuro, nem > 120 anos)
        const nascimento = new Date(customerData.nascimento);
        const dataAtual = new Date();
        const idadeEmAnos = dataAtual.getFullYear() - nascimento.getFullYear();

        if (nascimento > dataAtual) {
            alert("A data de nascimento não pode estar no futuro.");
            document.getElementById('nascimento').focus();
            return;
        }
        if (idadeEmAnos > 120) {
            alert("Por favor, preencha uma data de nascimento válida (ano incorreto).");
            document.getElementById('nascimento').focus();
            return;
        }

        // Passou em todas as validações! Inicia Loading...
        this.form.style.display = 'none';
        this.loadingState.style.display = 'block';

        try {
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) throw new Error('Falha ao gerar pagamento');

            const data = await response.json();

            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }
        } catch (error) {
            console.error(error);
            alert("Ocorreu um erro de comunicação com a InfinitePay. Por favor, tente novamente.");
            this.loadingState.style.display = 'none';
            this.form.style.display = 'block';
        }
    }
}