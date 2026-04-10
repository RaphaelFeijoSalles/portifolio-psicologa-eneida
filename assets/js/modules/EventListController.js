/**
 * EventListController
 * Gerencia a exibição da seção de Próximos Eventos.
 * Permite alternar entre o conteúdo do evento ativo e o placeholder de "Save the Date".
 */
export const EventListController = (() => {
    // FEATURE FLAG: Altere para 'true' para mostrar o evento ou 'false' para o placeholder
    const isEventActive = true;

    const renderPlaceholder = () => {
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
    };

    const init = () => {
        const upcomingEventsContainer = document.querySelector('.upcoming-event-container');
        if (!upcomingEventsContainer) return;

        // Se o evento não estiver ativo, injeta o placeholder
        if (!isEventActive) {
            upcomingEventsContainer.innerHTML = renderPlaceholder();
        }
    };

    return { init };
})();