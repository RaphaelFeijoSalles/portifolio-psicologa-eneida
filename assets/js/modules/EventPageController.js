/**
 * Controla os comportamentos da página de eventos (Formulário, Máscaras e Validações).
 */
export class EventPageController {
    constructor() {
        this.form = document.getElementById('native-checkout-form');
        this.loadingState = document.getElementById('checkout-loading');
        
        // Binds
        this.handleCheckoutSubmit = this.handleCheckoutSubmit.bind(this);
        this.applyPhoneMask = this.applyPhoneMask.bind(this);
        this.validateEmailLive = this.validateEmailLive.bind(this);
        this.validatePhonesLive = this.validatePhonesLive.bind(this);
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleCheckoutSubmit);
            
            // Listeners para validação em tempo real
            const emailInput = document.getElementById('email');
            const whatsInput = document.getElementById('whatsapp');
            const emergInput = document.getElementById('emergencia');

            if (emailInput) emailInput.addEventListener('input', this.validateEmailLive);
            if (whatsInput) whatsInput.addEventListener('input', (e) => { this.applyPhoneMask(e); this.validatePhonesLive(); });
            if (emergInput) emergInput.addEventListener('input', (e) => { this.applyPhoneMask(e); this.validatePhonesLive(); });
        }
    }

    applyPhoneMask(e) {
        let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    }

    validateEmailLive(e) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.applyVisualFeedback(e.target, emailRegex.test(e.target.value));
    }

    validatePhonesLive() {
        const whatsInput = document.getElementById('whatsapp');
        const emergInput = document.getElementById('emergencia');
        
        const whatsValue = whatsInput.value;
        const emergValue = emergInput.value;
        
        // Regra: Deve ter o formato completo (15 caracteres: (XX) XXXXX-XXXX)
        const isWhatsComplete = whatsValue.length === 15;
        const isEmergComplete = emergValue.length === 15;
        
        // Feedback Visual Individual (Formato)
        this.applyVisualFeedback(whatsInput, isWhatsComplete);
        this.applyVisualFeedback(emergInput, isEmergComplete);

        // Regra Extra: Emergência não pode ser igual ao WhatsApp
        if (isWhatsComplete && isEmergComplete && whatsValue === emergValue) {
            this.applyVisualFeedback(emergInput, false); // Força erro no emergência
        }
    }

    applyVisualFeedback(element, isValid) {
        if (element.value.length === 0) {
            element.style.borderColor = '#ccc';
            element.style.boxShadow = 'none';
            return;
        }
        element.style.borderColor = isValid ? '#2ecc71' : '#e74c3c';
        element.style.boxShadow = isValid ? '0 0 0 2px rgba(46, 204, 113, 0.2)' : '0 0 0 2px rgba(231, 76, 60, 0.2)';
    }

    async handleCheckoutSubmit(e) {
        e.preventDefault();

        // 1. Previne o "salto" para o rodapé
        // Escondemos o formulário e imediatamente rolamos para o topo do container de loading
        this.form.style.display = 'none';
        this.loadingState.style.display = 'block';
        this.loadingState.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const formData = new FormData(this.form);
        const customerData = Object.fromEntries(formData.entries());

        // Verificações finais de segurança
        const whatsLimpo = customerData.whatsapp.replace(/\D/g, '');
        const emergLimpo = customerData.emergencia.replace(/\D/g, '');

        if (whatsLimpo === emergLimpo) {
            alert("O contato de emergência deve ser diferente do seu número principal.");
            this.showFormAgain();
            return;
        }

        try {
            const response = await fetch('/api/create-checkout.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });

            const data = await response.json();
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                throw new Error("URL não recebida");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao processar. Tente novamente.");
            this.showFormAgain();
        }
    }

    showFormAgain() {
        this.loadingState.style.display = 'none';
        this.form.style.display = 'block';
    }
}