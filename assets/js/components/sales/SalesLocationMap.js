import { escapeHtml } from '../../utils/html.js';

/**
 * Mapa de localização reutilizável para páginas de venda com evento
 * presencial, incluindo endereço e atalho para traçar uma rota.
 */
export class SalesLocationMap {
    /**
     * @param {string|HTMLElement} target
     * @param {{eyebrow?: string, title: string, description?: string, mapTitle: string, mapUrl: string, venue: string, address: string, directionsUrl?: string, directionsLabel?: string}} content
     */
    constructor(target, content) {
        this.target = typeof target === 'string' ? document.querySelector(target) : target;
        this.content = content;
    }

    render() {
        if (!this.target) {
            throw new Error('Não foi possível localizar o destino do SalesLocationMap.');
        }

        const eyebrow = this.content.eyebrow
            ? `<p class="sales-location__eyebrow">${escapeHtml(this.content.eyebrow)}</p>`
            : '';
        const description = this.content.description
            ? `<p class="sales-location__description">${escapeHtml(this.content.description)}</p>`
            : '';
        const directions = this.content.directionsUrl
            ? `
                <a class="sales-location__route" href="${escapeHtml(this.content.directionsUrl)}" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                    </svg>
                    <span>${escapeHtml(this.content.directionsLabel || 'Traçar rota')}</span>
                </a>
            `
            : '';

        this.target.innerHTML = `
            <section class="sales-location">
                <div class="container">
                    <header class="sales-location__header">
                        ${eyebrow}
                        <h2>${escapeHtml(this.content.title)}</h2>
                        ${description}
                    </header>
                    <article class="sales-location__card">
                        <iframe class="sales-location__map" title="${escapeHtml(this.content.mapTitle)}" src="${escapeHtml(this.content.mapUrl)}" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade"></iframe>
                        <div class="sales-location__info">
                            <div>
                                <strong>${escapeHtml(this.content.venue)}</strong>
                                <span>${escapeHtml(this.content.address)}</span>
                            </div>
                            ${directions}
                        </div>
                    </article>
                </div>
            </section>
        `;

        return this;
    }
}
