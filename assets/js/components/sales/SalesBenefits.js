import { escapeHtml } from '../../utils/html.js';

/**
 * Seção de benefícios, etapas ou diferenciais de uma oferta.
 */
export class SalesBenefits {
    /**
     * @param {string|HTMLElement} target
     * @param {{id?: string, title: string, subtitle?: string, items: Array<{title: string, description: string}>, tone?: 'default'|'alternate', numbered?: boolean}} content
     */
    constructor(target, content) {
        this.target = typeof target === 'string' ? document.querySelector(target) : target;
        this.content = content;
    }

    render() {
        if (!this.target) {
            throw new Error('Não foi possível localizar o destino do SalesBenefits.');
        }

        const sectionClass = this.content.tone === 'alternate'
            ? 'section-common section-bg-alt sales-benefits'
            : 'section-common sales-benefits';
        const subtitle = this.content.subtitle
            ? `<p class="section-subtitle">${escapeHtml(this.content.subtitle)}</p>`
            : '';
        const numbered = this.content.numbered !== false;

        this.target.innerHTML = `
            <section${this.content.id ? ` id="${escapeHtml(this.content.id)}"` : ''} class="${sectionClass}">
                <div class="container">
                    <h2 class="section-title">${escapeHtml(this.content.title)}</h2>
                    ${subtitle}
                    <div class="sales-benefits__grid">
                        ${this.content.items.map((item, index) => `
                            <article class="sales-benefits__item">
                                ${numbered ? `<span class="sales-benefits__number" aria-hidden="true">${index + 1}</span>` : ''}
                                <h3>${escapeHtml(item.title)}</h3>
                                <p>${escapeHtml(item.description)}</p>
                            </article>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;

        return this;
    }
}
