import { escapeHtml } from '../../utils/html.js';

/**
 * Cabeçalho reutilizável para páginas de venda.
 */
export class SalesHero {
    /**
     * @param {string|HTMLElement} target
     * @param {{eyebrow?: string, title: string|string[], subtitle?: string, meta?: string, description?: string, cta?: {label: string, href: string}, image?: {src: string, alt: string}}} content
     */
    constructor(target, content) {
        this.target = typeof target === 'string' ? document.querySelector(target) : target;
        this.content = content;
    }

    render() {
        if (!this.target) {
            throw new Error('Não foi possível localizar o destino do SalesHero.');
        }

        const titleLines = Array.isArray(this.content.title)
            ? this.content.title
            : [this.content.title];

        const eyebrow = this.content.eyebrow
            ? `<p class="sales-hero__eyebrow">${escapeHtml(this.content.eyebrow)}</p>`
            : '';
        const subtitle = this.content.subtitle
            ? `<p class="sales-hero__subtitle">${escapeHtml(this.content.subtitle)}</p>`
            : '';
        const meta = this.content.meta
            ? `<p class="sales-hero__meta">${escapeHtml(this.content.meta)}</p>`
            : '';
        const description = this.content.description
            ? `<p class="sales-hero__description">${escapeHtml(this.content.description)}</p>`
            : '';
        const cta = this.content.cta
            ? `<a class="btn-primary sales-hero__cta" href="${escapeHtml(this.content.cta.href)}">${escapeHtml(this.content.cta.label)}</a>`
            : '';
        const copy = `
            <div class="sales-hero__copy">
                ${eyebrow}
                <h1>${titleLines.map(escapeHtml).join('<br>')}</h1>
                ${subtitle}
                ${meta}
                ${description}
                ${cta}
            </div>
        `;
        const image = this.content.image
            ? `
                <figure class="sales-hero__media">
                    <img src="${escapeHtml(this.content.image.src)}" alt="${escapeHtml(this.content.image.alt)}">
                </figure>
            `
            : '';
        const content = this.content.image
            ? `<div class="sales-hero__layout">${copy}${image}</div>`
            : copy;

        this.target.innerHTML = `
            <section class="event-hero sales-hero${this.content.image ? ' sales-hero--with-image' : ''}">
                <div class="container">
                    ${content}
                </div>
            </section>
        `;

        return this;
    }
}
