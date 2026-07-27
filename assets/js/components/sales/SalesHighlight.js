import { escapeHtml } from '../../utils/html.js';

/**
 * Bloco de destaque reutilizável para informações importantes de uma oferta,
 * como lançamentos, bônus ou condições especiais.
 */
export class SalesHighlight {
    /**
     * @param {string|HTMLElement} target
     * @param {{eyebrow?: string, title: string, description: string, eventDetails?: Array<{label: string, value: string}>, items?: Array<{title: string, description: string}>, cta?: {label: string, href: string}, seal?: string}} content
     */
    constructor(target, content) {
        this.target = typeof target === 'string' ? document.querySelector(target) : target;
        this.content = content;
    }

    render() {
        if (!this.target) {
            throw new Error('Não foi possível localizar o destino do SalesHighlight.');
        }

        const eyebrow = this.content.eyebrow
            ? `<p class="sales-highlight__eyebrow">${escapeHtml(this.content.eyebrow)}</p>`
            : '';
        const items = (this.content.items || []).map((item) => `
            <li>
                <strong>${escapeHtml(item.title)}</strong>
                <span>${escapeHtml(item.description)}</span>
            </li>
        `).join('');
        const eventDetails = (this.content.eventDetails || []).map((detail) => `
            <div>
                <dt>${escapeHtml(detail.label)}</dt>
                <dd>${escapeHtml(detail.value)}</dd>
            </div>
        `).join('');
        const cta = this.content.cta
            ? `<a class="btn-primary sales-highlight__cta" href="${escapeHtml(this.content.cta.href)}">${escapeHtml(this.content.cta.label)}</a>`
            : '';
        const seal = this.content.seal
            ? `<div class="sales-highlight__seal" aria-hidden="true">${escapeHtml(this.content.seal)}</div>`
            : '';

        this.target.innerHTML = `
            <section class="sales-highlight">
                <div class="container">
                    <article class="sales-highlight__card">
                        <div class="sales-highlight__content">
                            ${eyebrow}
                            <h2>${escapeHtml(this.content.title)}</h2>
                            <p>${escapeHtml(this.content.description)}</p>
                            ${eventDetails ? `<dl class="sales-highlight__event-details">${eventDetails}</dl>` : ''}
                            ${items ? `<ul class="sales-highlight__list">${items}</ul>` : ''}
                            ${cta}
                        </div>
                        ${seal}
                    </article>
                </div>
            </section>
        `;

        return this;
    }
}
