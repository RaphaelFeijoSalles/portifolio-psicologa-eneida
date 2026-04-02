/**
 * Controla os comportamentos da página de eventos (Formulário Nativo, Máscaras e Integração).
 */
export class EventPageController {
    constructor() {
        this.form = document.getElementById('native-checkout-form');
        this.loadingState = document.getElementById('checkout-loading');
        
        // Binds
        this.handleCheckoutSubmit = this.handleCheckoutSubmit.bind(this);
        this.applyPhoneMask = this.applyPhoneMask.bind(this);
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleCheckoutSubmit);
            
            // Aplica a máscara em tempo real nos campos de telefone
            const whatsappInput = document.getElementById('whatsapp');
            const emergenciaInput = document.getElementById('emergencia');
            
            if (whatsappInput) whatsappInput.addEventListener('input', this.applyPhoneMask);
            if (emergenciaInput) emergenciaInput.addEventListener('input', this.applyPhoneMask);
        }
    }

    // Função de Máscara de Telefone: Transforma 43999999999 em (43) 99999-9999
    applyPhoneMask(e) {
        // Remove tudo que não for dígito
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        // Aplica a formatação dinamicamente enquanto o usuário digita
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    }

    // Função validadora de E-mail via Regex
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async handleCheckoutSubmit(e) {
        e.preventDefault(); // Impede a página de recarregar

        // 1. Coleta e Valida os Dados no Front-end antes de mandar para a API
        const formData = new FormData(this.form);
        const customerData = Object.fromEntries(formData.entries());

        // Validação extra de Email
        if (!this.isValidEmail(customerData.email)) {
            alert("Por favor, insira um endereço de e-mail válido.");
            document.getElementById('email').focus();
            return;
        }

        // Validação extra de Telefone (Garante que tenha pelo menos o DDD e 8 números)
        const phoneDigits = customerData.whatsapp.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
            alert("Por favor, insira um número de telefone com DDD válido.");
            document.getElementById('whatsapp').focus();
            return;
        }

        // 2. Esconde o formulário e mostra o Loading
        this.form.style.display = 'none';
        this.loadingState.style.display = 'block';

        try {
            // 3. Envia para a API na Vercel
            const response = await fetch('/api/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });

            if (!response.ok) throw new Error('Falha ao gerar pagamento');

            const data = await response.json();

            // 4. Redireciona o usuário para o link da InfinitePay!
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }

        } catch (error) {
            console.error(error);
            alert("Ocorreu um erro ao gerar o pagamento. Por favor, tente novamente ou entre em contato pelo WhatsApp.");
            // Se der erro, volta a mostrar o formulário
            this.loadingState.style.display = 'none';
            this.form.style.display = 'block';
        }
    }
}