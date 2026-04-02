/**
 * Controla os comportamentos da página de eventos (Formulário Nativo e Integração).
 */
export class EventPageController {
    constructor() {
        this.form = document.getElementById('native-checkout-form');
        this.loadingState = document.getElementById('checkout-loading');
        
        // Binds
        this.handleCheckoutSubmit = this.handleCheckoutSubmit.bind(this);
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', this.handleCheckoutSubmit);
        }
    }

    async handleCheckoutSubmit(e) {
        e.preventDefault(); // Impede a página de recarregar

        // 1. Esconde o formulário e mostra o Loading
        this.form.style.display = 'none';
        this.loadingState.style.display = 'block';

        // 2. Captura todos os dados digitados
        const formData = new FormData(this.form);
        const customerData = Object.fromEntries(formData.entries());

        try {
            // 3. Envia para a NOSSA futura API na Vercel (ou n8n)
            // OBS: Por enquanto este endpoint vai dar erro (404) porque ainda não criamos a API,
            // mas o front-end já está 100% preparado!
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