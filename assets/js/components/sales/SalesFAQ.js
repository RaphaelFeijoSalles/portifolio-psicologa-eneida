import { escapeHtml } from '../../utils/html.js';

/**
 * FAQ acessível baseado em <details>, compartilhado por páginas de venda.
 */
export class SalesFAQ {
    /**
     * @param {string|HTMLElement} target
     * @param {{id?: string, title?: string, subtitle?: string, items: Array<{question: string, answer: string}>, tone?: 'default'|'alternate'}} content
     */
    constructor(target, content) {
        this.target = typeof target === 'string' ? document.querySelector(target) : target;
        this.content = content;
    }

    render() {
        if (!this.target) {
            throw new Error('Não foi possível localizar o destino do SalesFAQ.');
        }

        const sectionClass = this.content.tone === 'alternate'
            ? 'section-common section-bg-alt sales-faq'
            : 'section-common sales-faq';
        const subtitle = this.content.subtitle
            ? `<p class="section-subtitle">${escapeHtml(this.content.subtitle)}</p>`
            : '';

        this.target.innerHTML = `
            <section${this.content.id ? ` id="${escapeHtml(this.content.id)}"` : ''} class="${sectionClass}">
                <div class="container sales-faq__container">
                    <h2 class="section-title">${escapeHtml(this.content.title || 'Perguntas frequentes')}</h2>
                    ${subtitle}
                    <div class="sales-faq__list">
                        ${this.content.items.map((item) => `
                            <details class="sales-faq__item">
                                <summary>${escapeHtml(item.question)}</summary>
                                <p>${escapeHtml(item.answer)}</p>
                            </details>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;

        return this;
    }
}
