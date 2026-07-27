import { escapeHtml } from '../../utils/html.js';

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   label: string,
 *   type?: 'text'|'email'|'tel'|'date'|'textarea'|'radio'|'segmented'|'toggle',
 *   required?: boolean,
 *   placeholder?: string,
 *   autocomplete?: string,
 *   inputMode?: string,
 *   maxLength?: number,
 *   minLength?: number,
 *   pattern?: string,
 *   rows?: number,
 *   value?: string,
 *   hint?: string,
 *   statusKey?: string,
 *   helpLink?: {label: string, href: string},
 *   behavior?: 'phone'|'email'|'cep',
 *   options?: Array<{label: string, value: string, description?: string, checked?: boolean}>,
 *   orderOption?: string
 * }} CheckoutField
 */

/**
 * @param {string} value
 */
export function formatBrazilianPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 2) {
        return digits;
    }

    const ddd = digits.slice(0, 2);
    const firstPart = digits.slice(2, 7);
    const secondPart = digits.slice(7, 11);

    return `(${ddd}) ${firstPart}${secondPart ? `-${secondPart}` : ''}`;
}

/**
 * A página anterior aceitava somente celulares brasileiros com DDD e nove
 * dígitos. Mantemos a mesma regra para todos os checkouts.
 *
 * @param {string} value
 */
export function isValidBrazilianMobile(value) {
    return value.replace(/\D/g, '').length === 11;
}

/**
 * Componente base para checkout. Ele renderiza campos declarativos e concentra
 * a máscara, validação, estado de carregamento e comunicação com a API.
 */
export class CheckoutFormBase {
    /**
     * @param {{
     *   target: string|HTMLElement,
     *   formId: string,
     *   title: string,
     *   subtitle?: string,
     *   productId: string,
     *   sections: Array<{id?: string, className?: string, title?: string, rows: CheckoutField[][]}>,
     *   payment: {priceLabel: string, methods?: string[], submitLabel?: string, disclaimer?: string},
     *   endpoint?: string,
     *   validation?: {emailFields?: string[], phoneFields?: string[], distinctPhonePairs?: Array<[string, string]>},
     *   transformPayload?: (payload: Record<string, string>, form: HTMLFormElement) => Record<string, string>|Promise<Record<string, string>>,
     *   validate?: (payload: Record<string, string>, form: HTMLFormElement) => string|{message: string, fieldName?: string}|null,
     *   available?: boolean,
     *   unavailableMessage?: string
     * }} config
     */
    constructor(config) {
        this.config = {
            endpoint: '/api/create-checkout.php',
            validation: {},
            available: true,
            ...config,
        };
        this.target = typeof config.target === 'string' ? document.querySelector(config.target) : config.target;
        this.form = null;
        this.loadingState = null;
        this.errorState = null;
        this.submitButton = null;
        this.isSubmitting = false;

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePhoneInput = this.handlePhoneInput.bind(this);
        this.handleValidationInput = this.handleValidationInput.bind(this);
    }

    render() {
        if (!this.target) {
            throw new Error('Não foi possível localizar o destino do CheckoutFormBase.');
        }

        const unavailableMessage = !this.config.available
            ? `<p class="checkout-unavailable" role="status">${escapeHtml(this.config.unavailableMessage || 'Este produto está temporariamente indisponível.')}</p>`
            : '';

        this.target.innerHTML = `
            <section class="section-common sales-checkout" id="${escapeHtml(this.config.formId)}-section">
                <div class="container">
                    <h2 class="section-title">${escapeHtml(this.config.title)}</h2>
                    ${this.config.subtitle ? `<p class="section-subtitle">${escapeHtml(this.config.subtitle)}</p>` : ''}
                    <div class="form-container">
                        ${unavailableMessage}
                        <p class="checkout-form-error" data-checkout-error role="alert" hidden></p>
                        <form id="${escapeHtml(this.config.formId)}" class="native-form" novalidate>
                            <input type="hidden" name="productId" value="${escapeHtml(this.config.productId)}">
                            ${this.renderSections()}
                            ${this.renderPayment()}
                        </form>
                        <div class="checkout-loading" data-checkout-loading aria-live="polite" aria-busy="true">
                            <div class="spinner" aria-hidden="true"></div>
                            <h3>Gerando seu link de pagamento...</h3>
                            <p>Por favor, não feche esta página.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;

        this.form = this.target.querySelector('form');
        this.loadingState = this.target.querySelector('[data-checkout-loading]');
        this.errorState = this.target.querySelector('[data-checkout-error]');
        this.submitButton = this.form?.querySelector('button[type="submit"]');
        this.attachListeners();

        return this;
    }

    renderSections() {
        return this.config.sections.map((section, sectionIndex) => {
            const title = section.title
                ? `<h3 class="form-section-title" id="${escapeHtml(this.config.formId)}-section-${sectionIndex}">${escapeHtml(section.title)}</h3>`
                : '';
            const sectionId = section.id ? ` id="${escapeHtml(section.id)}"` : '';
            const className = `checkout-form-section${section.className ? ` ${escapeHtml(section.className)}` : ''}`;

            return `
                <section${sectionId} class="${className}"${section.title ? ` aria-labelledby="${escapeHtml(this.config.formId)}-section-${sectionIndex}"` : ''}>
                    ${title}
                    ${section.rows.map((row) => this.renderRow(row)).join('')}
                </section>
            `;
        }).join('');
    }

    /**
     * @param {CheckoutField[]} fields
     */
    renderRow(fields) {
        const className = fields.length > 1 ? 'form-grid' : '';
        return `<div class="${className}">${fields.map((field) => this.renderField(field)).join('')}</div>`;
    }

    /**
     * @param {CheckoutField} field
     */
    renderField(field) {
        const type = field.type || 'text';
        const fieldId = escapeHtml(field.id);
        const fieldName = escapeHtml(field.name);
        const label = escapeHtml(field.label);
        const required = field.required ? ' required' : '';
        const attributes = this.renderInputAttributes(field);
        const help = this.renderFieldHelp(field);

        if (type === 'textarea') {
            return `
                <div class="form-group">
                    <label for="${fieldId}">${label}${field.required ? ' *' : ''}</label>
                    <textarea id="${fieldId}" name="${fieldName}" rows="${field.rows || 3}"${required}${attributes}></textarea>
                    ${help}
                </div>
            `;
        }

        if (type === 'radio') {
            const options = field.options || [];
            return `
                <fieldset class="form-section-info form-group">
                    <legend class="form-description">${label}${field.required ? ' *' : ''}</legend>
                    <div class="form-options">
                        ${options.map((option, index) => `
                            <label class="radio-option" for="${fieldId}-${index}">
                                <input id="${fieldId}-${index}" type="radio" name="${fieldName}" value="${escapeHtml(option.value)}" class="custom-radio"${field.required && index === 0 ? ' required' : ''}>
                                <span class="radio-label">${escapeHtml(option.label)}</span>
                            </label>
                        `).join('')}
                    </div>
                    ${help}
                </fieldset>
            `;
        }

        if (type === 'segmented') {
            const options = field.options || [];
            return `
                <fieldset class="form-group sales-segmented-fieldset">
                    <legend>${label}${field.required ? ' *' : ''}</legend>
                    <div class="sales-segmented-control">
                        ${options.map((option, index) => `
                            <label class="sales-segmented-control__option" for="${fieldId}-${index}">
                                <input id="${fieldId}-${index}" type="radio" name="${fieldName}" value="${escapeHtml(option.value)}" class="sales-segmented-control__input"${field.required && index === 0 ? ' required' : ''}${option.checked ? ' checked' : ''}>
                                <span class="sales-segmented-control__content">
                                    <strong>${escapeHtml(option.label)}</strong>
                                    ${option.description ? `<small>${escapeHtml(option.description)}</small>` : ''}
                                </span>
                            </label>
                        `).join('')}
                    </div>
                    ${help}
                </fieldset>
            `;
        }

        if (type === 'toggle') {
            const orderOption = field.orderOption ? ` data-order-option="${escapeHtml(field.orderOption)}"` : '';
            return `
                <div class="form-group sales-toggle-group">
                    <label class="sales-toggle" for="${fieldId}">
                        <input id="${fieldId}" name="${fieldName}" type="checkbox" value="${escapeHtml(field.value || 'Sim')}" class="sales-toggle__input"${orderOption}>
                        <span class="sales-toggle__control" aria-hidden="true"></span>
                        <span class="sales-toggle__label">${label}</span>
                    </label>
                    ${help}
                </div>
            `;
        }

        return `
            <div class="form-group">
                <label for="${fieldId}">${label}${field.required ? ' *' : ''}</label>
                <input id="${fieldId}" name="${fieldName}" type="${escapeHtml(type)}"${required}${attributes}>
                ${help}
            </div>
        `;
    }

    /**
     * @param {CheckoutField} field
     */
    renderInputAttributes(field) {
        const attributes = [];

        if (field.placeholder) attributes.push(` placeholder="${escapeHtml(field.placeholder)}"`);
        if (field.autocomplete) attributes.push(` autocomplete="${escapeHtml(field.autocomplete)}"`);
        if (field.inputMode) attributes.push(` inputmode="${escapeHtml(field.inputMode)}"`);
        if (field.maxLength) attributes.push(` maxlength="${field.maxLength}"`);
        if (field.minLength) attributes.push(` minlength="${field.minLength}"`);
        if (field.pattern) attributes.push(` pattern="${escapeHtml(field.pattern)}"`);
        if (field.behavior === 'phone') attributes.push(' data-phone-input');
        if (field.behavior === 'email') attributes.push(' data-email-input');
        if (field.behavior === 'cep') attributes.push(' data-cep-input');
        if (field.hint || field.statusKey || field.helpLink) attributes.push(` aria-describedby="${escapeHtml(field.id)}-help"`);

        return attributes.join('');
    }

    /**
     * @param {CheckoutField} field
     */
    renderFieldHelp(field) {
        if (!field.hint && !field.statusKey && !field.helpLink) {
            return '';
        }

        const link = field.helpLink
            ? ` <a class="cep-help-link" href="${escapeHtml(field.helpLink.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(field.helpLink.label)}</a>`
            : '';
        const status = field.statusKey
            ? ` <span data-${escapeHtml(field.statusKey)}-status aria-live="polite"></span>`
            : '';

        return `<p class="field-hint" id="${escapeHtml(field.id)}-help">${field.hint ? escapeHtml(field.hint) : ''}${link}${status}</p>`;
    }

    renderPayment() {
        const methods = this.config.payment.methods || [];
        const submitLabel = this.config.payment.submitLabel || 'Gerar Pagamento Seguro';
        const disabled = this.config.available ? '' : ' disabled aria-disabled="true"';

        return `
            <div class="checkout-actions">
                <p class="investment-value"><strong>${escapeHtml(this.config.payment.priceLabel)}</strong></p>
                ${methods.length ? `
                    <div class="payment-info-box">
                        <p><strong>Formas de Pagamento:</strong></p>
                        <ul>${methods.map((method) => `<li>${escapeHtml(method)}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                <div class="flex flex-column flex-center gap-3">
                    <button type="submit" class="btn-primary btn-icon checkout-submit"${disabled}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            <polyline points="9 12 11 14 15 10"></polyline>
                        </svg>
                        ${escapeHtml(submitLabel)}
                    </button>
                    ${this.config.payment.disclaimer ? `<p class="checkout-disclaimer">${escapeHtml(this.config.payment.disclaimer)}</p>` : ''}
                </div>
            </div>
        `;
    }

    attachListeners() {
        if (!this.form) {
            return;
        }

        this.form.addEventListener('submit', this.handleSubmit);
        this.form.querySelectorAll('[data-phone-input]').forEach((input) => {
            input.addEventListener('input', this.handlePhoneInput);
        });
        this.form.querySelectorAll('[data-email-input]').forEach((input) => {
            input.addEventListener('input', this.handleValidationInput);
        });
    }

    /**
     * @param {InputEvent} event
     */
    handlePhoneInput(event) {
        const input = /** @type {HTMLInputElement} */ (event.target);
        input.value = formatBrazilianPhone(input.value);
        this.validateLiveFields();
    }

    handleValidationInput() {
        this.validateLiveFields();
    }

    validateLiveFields() {
        if (!this.form) {
            return;
        }

        const { emailFields = [], phoneFields = [], distinctPhonePairs = [] } = this.config.validation;

        emailFields.forEach((name) => {
            const input = this.getInput(name);
            if (!input) return;

            const valid = input.value.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
            this.setFieldValidity(input, valid, 'Informe um e-mail válido.');
        });

        phoneFields.forEach((name) => {
            const input = this.getInput(name);
            if (!input) return;

            const valid = input.value.length === 0 || isValidBrazilianMobile(input.value);
            this.setFieldValidity(input, valid, 'Informe um WhatsApp com DDD e nove dígitos.');
        });

        distinctPhonePairs.forEach(([firstName, secondName]) => {
            const first = this.getInput(firstName);
            const second = this.getInput(secondName);
            if (!first || !second) return;

            const bothComplete = isValidBrazilianMobile(first.value) && isValidBrazilianMobile(second.value);
            const areEqual = first.value === second.value;
            if (bothComplete && areEqual) {
                this.setFieldValidity(second, false, 'O contato de emergência deve ser diferente do WhatsApp.');
            }
        });
    }

    /**
     * @param {HTMLInputElement} input
     * @param {boolean} isValid
     * @param {string} message
     */
    setFieldValidity(input, isValid, message) {
        if (input.value.length === 0) {
            input.setCustomValidity('');
            input.classList.remove('is-valid', 'is-invalid');
            input.removeAttribute('aria-invalid');
            return;
        }

        input.setCustomValidity(isValid ? '' : message);
        input.classList.toggle('is-valid', isValid);
        input.classList.toggle('is-invalid', !isValid);
        input.setAttribute('aria-invalid', String(!isValid));
    }

    /**
     * @param {string} name
     */
    getInput(name) {
        const input = this.form?.elements.namedItem(name);
        return input instanceof HTMLInputElement ? input : null;
    }

    /**
     * @param {SubmitEvent} event
     */
    async handleSubmit(event) {
        event.preventDefault();

        if (!this.form || !this.config.available || this.isSubmitting) {
            return;
        }

        this.hideError();
        this.validateLiveFields();

        if (!this.form.checkValidity()) {
            this.form.reportValidity();
            return;
        }

        let payload = Object.fromEntries(new FormData(this.form).entries());

        try {
            if (this.config.validate) {
                const validationResult = this.config.validate(payload, this.form);
                if (validationResult) {
                    const result = typeof validationResult === 'string'
                        ? { message: validationResult }
                        : validationResult;
                    this.showError(result.message, result.fieldName);
                    return;
                }
            }

            if (this.config.transformPayload) {
                payload = await this.config.transformPayload(payload, this.form);
            }
        } catch (error) {
            console.error('Erro ao preparar os dados do checkout:', error);
            this.showError('Não foi possível preparar seus dados. Revise o formulário e tente novamente.');
            return;
        }

        this.showLoading();

        try {
            const response = await fetch(this.config.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data.checkoutUrl) {
                throw new Error(data.error || 'Não foi possível gerar o link de pagamento.');
            }

            window.location.assign(data.checkoutUrl);
        } catch (error) {
            console.error('Erro ao gerar checkout:', error);
            this.showFormAgain();
            this.showError(error.message || 'Erro ao processar. Tente novamente.');
        }
    }

    showLoading() {
        this.isSubmitting = true;
        this.form.hidden = true;
        this.loadingState?.classList.add('is-visible');
        if (this.submitButton) this.submitButton.disabled = true;
        this.loadingState?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showFormAgain() {
        this.isSubmitting = false;
        this.form.hidden = false;
        this.loadingState?.classList.remove('is-visible');
        if (this.submitButton) this.submitButton.disabled = false;
    }

    /**
     * @param {string} message
     * @param {string} [fieldName]
     */
    showError(message, fieldName) {
        if (this.errorState) {
            this.errorState.textContent = message;
            this.errorState.hidden = false;
        }

        const field = fieldName ? this.getInput(fieldName) : null;
        field?.focus();
    }

    hideError() {
        if (this.errorState) {
            this.errorState.textContent = '';
            this.errorState.hidden = true;
        }
    }
}
