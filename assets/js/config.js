/**
 * Configuração central para toggles globais do site.
 * Permite controle dinâmico sem alterar código.
 * @type {Object}
 */
export const config = {
    enableBanner: true,  // Ativa/desativa o banner na homepage
    enableEventsPlaceholder: true,  // Ativa/desativa o placeholder na seção de eventos
    // Futuros toggles: enableFooterAds: false, etc.
};

/**
 * Carrega configurações com fallback para valores padrão.
 * @returns {Promise<Object>} Configuração carregada.
 */
export async function loadConfig() {
    try {
        // Futuro: fetch('/api/config') para carregamento remoto
        return config;
    } catch (error) {
        console.warn('Erro ao carregar configuração, usando padrão:', error);
        return config;  // Fallback
    }
}