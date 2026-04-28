/**
 * EventListController
 * Gerencia a exibição da seção de Próximos Eventos.
 * Permite alternar entre o conteúdo do evento ativo e o placeholder de "Save the Date".
 * Consome evento ativo via API (get-active-event.php)
 */
export class EventListController {
    static init(toggleController) {
        const upcomingEventsContainer = document.querySelector('.upcoming-event-container');
        if (!upcomingEventsContainer) return;

        // Renderiza eventos (placeholder ou evento ativo) baseado no toggle
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

    static async renderEvents(toggleController) {
        const container = document.querySelector('.upcoming-event-container');
        if (!container) return;

        // Limpa conteúdo existente
        container.innerHTML = '';

        // Se toggle de placeholder estiver ativado, mostra placeholder
        if (toggleController.isEventsPlaceholderEnabled()) {
            container.innerHTML = this.renderPlaceholder();
        } else {
            // Carrega evento ativo do servidor
            try {
                const response = await fetch('./api/get-active-event.php');
                
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                
                const eventData = await response.json();
                
                // Se evento está ativo, renderiza; senão, mostra placeholder
                if (eventData.isActive) {
                    container.innerHTML = this.renderEventCard(eventData);
                } else {
                    container.innerHTML = this.renderPlaceholder();
                }
            } catch (error) {
                console.error('Erro ao carregar evento:', error);
                // Fallback: mostra placeholder em caso de erro
                container.innerHTML = this.renderPlaceholder();
            }
        }
    }

    /**
     * Renderiza um card com informações do evento ativo
     * @param {Object} eventData - Dados do evento do activeEvent.json
     * @returns {string} HTML do card do evento
     */
    static renderEventCard(eventData) {
        const { eventPage, id } = eventData;
        return `
            <div class="event-card">
                <h3>${eventPage.fullTitle}</h3>
                <p><strong>📅 Data:</strong> ${eventPage.date}</p>
                <p><strong>⏰ Horário:</strong> ${eventPage.time}</p>
                <p><strong>📍 Local:</strong> ${eventPage.location}</p>
                <p class="event-description">${eventPage.description}</p>
                <a href="/pages/${id}/" class="btn-primary">Saiba Mais e Se Inscreva</a>
            </div>
        `;
    }
}