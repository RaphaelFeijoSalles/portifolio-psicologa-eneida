/**
 * EventListController
 * Gerencia a exibição da seção de Próximos Eventos.
 * Permite alternar entre o conteúdo do evento ativo e o placeholder de "Save the Date".
 */
export class EventListController {
    static init(toggleController) {  // Novo parâmetro
        const upcomingEventsContainer = document.querySelector('.upcoming-event-container');
        if (!upcomingEventsContainer) return;

        // Renderiza eventos (placeholder ou lista) baseado no toggle
        this.renderEvents(toggleController);
    }

    static renderPlaceholder() {
        return `
            <div class="save-the-date-card">
                <h3>Próximas Imersões</h3>
                <p class="save-the-date-description">
                    Estamos preparando novas datas e temas especiais para 2026. <br>
                    Fique atento(a) às novidades!
                </p>
                <p><strong>Acompanhe nosso Instagram para ser o primeiro a saber.</strong></p>
                <a href="https://www.instagram.com/psi.eneidafeijo/" target="_blank" class="btn-primary save-the-date-button">
                    Acompanhar no Instagram
                </a>
            </div>
        `;
    }

    static renderEvents(toggleController) {
        const container = document.querySelector('.upcoming-event-container');
        if (!container) return;

        // Limpa conteúdo existente
        container.innerHTML = '';

        // Se toggle permitir, mostra placeholder
        if (toggleController.isEventsPlaceholderEnabled()) {
            container.innerHTML = this.renderPlaceholder();
        } else {
            // Futuro: renderizar lista real de eventos se disponível
            container.innerHTML = '<p>Nenhum evento disponível no momento.</p>';
        }
    }
}