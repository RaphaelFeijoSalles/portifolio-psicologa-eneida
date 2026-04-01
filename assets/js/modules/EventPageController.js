/**
 * Controla os comportamentos específicos das páginas de eventos,
 * como a escuta de carregamento do iframe do Google Forms e rolagens.
 */
export class EventPageController {
    constructor() {
        this.iframeLoadCount = 0;
        this.iframe = document.getElementById('google-form-iframe');
        this.successFeedback = document.getElementById('success-feedback');
        
        // Binds
        this.handleFormLoad = this.handleFormLoad.bind(this);
        this.scrollToPayment = this.scrollToPayment.bind(this);
    }

    init() {
        // 1. Escuta o carregamento do Iframe dinamicamente (sem sujar o HTML)
        if (this.iframe) {
            this.iframe.addEventListener('load', this.handleFormLoad);
        }

        // 2. Escuta o botão de rolar para o pagamento usando Data-Attributes
        const btnPayment = document.querySelector('[data-action="scroll-to-payment"]');
        if (btnPayment) {
            btnPayment.addEventListener('click', this.scrollToPayment);
        }
    }

    handleFormLoad() {
        this.iframeLoadCount++;
        // O primeiro load é o form vazio. O segundo é após o submit.
        if (this.iframeLoadCount > 1) {
            if (this.iframe) this.iframe.style.display = 'none';
            
            if (this.successFeedback) {
                this.successFeedback.style.display = 'flex';
                this.successFeedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    scrollToPayment() {
        const paymentSection = document.querySelector('.investment-options');
        if (paymentSection) {
            paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}