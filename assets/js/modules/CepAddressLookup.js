/**
 * Faz o preenchimento de endereço a partir do CEP sem acoplar a regra à página
 * ou ao formulário de um produto específico.
 */
export class CepAddressLookup {
    /**
     * @param {HTMLFormElement} form
     * @param {{cepField?: string, fields?: Record<string, string>}} options
     */
    constructor(form, options = {}) {
        this.form = form;
        this.cepField = options.cepField || 'cep';
        this.fields = {
            logradouro: 'logradouro',
            bairro: 'bairro',
            localidade: 'cidade',
            uf: 'uf',
            ...options.fields,
        };
        this.cepInput = this.form.elements.namedItem(this.cepField);
        this.statusElement = this.form.querySelector('[data-cep-status]');
        this.abortController = null;
        this.lastRequestedCep = '';

        this.handleCepInput = this.handleCepInput.bind(this);
    }

    init() {
        if (!(this.cepInput instanceof HTMLInputElement)) {
            return this;
        }

        this.cepInput.addEventListener('input', this.handleCepInput);
        return this;
    }

    destroy() {
        if (this.cepInput instanceof HTMLInputElement) {
            this.cepInput.removeEventListener('input', this.handleCepInput);
        }
        this.abortController?.abort();
    }

    /**
     * @param {InputEvent} event
     */
    handleCepInput(event) {
        const input = /** @type {HTMLInputElement} */ (event.target);
        const cep = input.value.replace(/\D/g, '').slice(0, 8);
        input.value = CepAddressLookup.formatCep(cep);

        if (cep.length !== 8) {
            this.lastRequestedCep = '';
            this.abortController?.abort();
            this.setStatus('');
            return;
        }

        if (cep === this.lastRequestedCep) {
            return;
        }

        this.lookup(cep);
    }

    /**
     * @param {string} cep
     */
    async lookup(cep) {
        this.abortController?.abort();
        this.abortController = new AbortController();
        this.lastRequestedCep = cep;
        this.setStatus('Buscando endereço…', 'loading');

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
                signal: this.abortController.signal,
            });

            if (!response.ok) {
                throw new Error('Não foi possível consultar o CEP.');
            }

            const address = await response.json();
            if (cep !== this.lastRequestedCep) {
                return;
            }

            if (address.erro) {
                this.setStatus('CEP não encontrado. Confira o número ou informe o endereço manualmente.', 'error');
                return;
            }

            this.fillAddress(address);
            this.setStatus('Endereço preenchido. Informe o número e complemente se necessário.', 'success');
            this.focusAddressNumber();
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                return;
            }

            console.error('Erro ao consultar o ViaCEP:', error);
            this.setStatus('Não foi possível buscar o CEP agora. Você pode preencher o endereço manualmente.', 'error');
        }
    }

    /**
     * @param {Record<string, string>} address
     */
    fillAddress(address) {
        Object.entries(this.fields).forEach(([viaCepKey, formFieldName]) => {
            const input = this.form.elements.namedItem(formFieldName);
            const value = address[viaCepKey];

            if (input instanceof HTMLInputElement && value) {
                input.value = value;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }

    focusAddressNumber() {
        const numberInput = this.form.elements.namedItem('numero');
        if (numberInput instanceof HTMLInputElement) {
            numberInput.focus();
        }
    }

    /**
     * @param {string} message
     * @param {'loading'|'success'|'error'} [state]
     */
    setStatus(message, state) {
        if (!this.statusElement) {
            return;
        }

        this.statusElement.textContent = message;
        this.statusElement.dataset.state = state || '';
    }

    /**
     * @param {string} cep
     */
    static formatCep(cep) {
        return cep.length > 5 ? `${cep.slice(0, 5)}-${cep.slice(5)}` : cep;
    }
}
