/**
 * Alterna a coleta de endereço conforme a pessoa escolha entrega ou resgate
 * presencial, mantendo validação e payload coerentes com a opção selecionada.
 */
export class DeliveryMethodController {
    /**
     * @param {HTMLFormElement} form
     * @param {{methodName?: string, deliveryValue?: string, addressSectionId: string}} options
     */
    constructor(form, options) {
        this.form = form;
        this.methodName = options.methodName || 'metodo_recebimento';
        this.deliveryValue = options.deliveryValue || 'entrega';
        this.addressSection = this.form.querySelector(`#${options.addressSectionId}`);
        this.methodInputs = Array.from(this.form.querySelectorAll(`input[name="${this.methodName}"]`));
        this.addressInputs = this.addressSection
            ? Array.from(this.addressSection.querySelectorAll('input, textarea, select'))
            : [];
        this.statusElement = this.form.querySelector('[data-delivery-method-status]');

        this.handleMethodChange = this.handleMethodChange.bind(this);
    }

    init() {
        if (!this.addressSection || !this.methodInputs.length) {
            return this;
        }

        this.addressInputs.forEach((input) => {
            input.dataset.requiredForDelivery = String(input.required);
        });
        this.methodInputs.forEach((input) => input.addEventListener('change', this.handleMethodChange));
        this.updateAddressVisibility();

        return this;
    }

    destroy() {
        this.methodInputs.forEach((input) => input.removeEventListener('change', this.handleMethodChange));
    }

    handleMethodChange() {
        this.updateAddressVisibility();
    }

    updateAddressVisibility() {
        const selectedMethod = this.methodInputs.find((input) => input.checked)?.value;
        const shouldDeliver = selectedMethod === this.deliveryValue;

        this.addressSection.hidden = !shouldDeliver;
        this.addressInputs.forEach((input) => {
            const isRequiredForDelivery = input.dataset.requiredForDelivery === 'true';
            input.disabled = !shouldDeliver;
            input.required = shouldDeliver && isRequiredForDelivery;

            if (!shouldDeliver) {
                input.setCustomValidity('');
                input.classList.remove('is-valid', 'is-invalid');
                input.removeAttribute('aria-invalid');
            }
        });

        this.updateStatus(shouldDeliver);
    }

    /**
     * @param {boolean} shouldDeliver
     */
    updateStatus(shouldDeliver) {
        if (!this.statusElement) {
            return;
        }

        this.statusElement.textContent = shouldDeliver
            ? 'Frete grátis para todo o Brasil.'
            : 'Você poderá resgatar seu exemplar presencialmente com a Eneida no evento de estreia.';
        this.statusElement.dataset.state = 'success';
    }
}
