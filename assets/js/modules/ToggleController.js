import { loadConfig } from '../config.js';

/**
 * Controlador para toggles globais, promovendo modularização e escalabilidade.
 */
export class ToggleController {
    constructor() {
        this.config = null;
    }

    /**
     * Inicializa o controlador carregando a configuração.
     * @returns {Promise<void>}
     */
    async init() {
        this.config = await loadConfig();
    }

    /**
     * Verifica se o banner deve ser exibido.
     * @returns {boolean}
     */
    isBannerEnabled() {
        return this.config?.enableBanner ?? true;  // Fallback true
    }

    /**
     * Verifica se o placeholder de eventos deve ser exibido.
     * @returns {boolean}
     */
    isEventsPlaceholderEnabled() {
        return this.config?.enableEventsPlaceholder ?? true;  // Fallback true
    }

    // Método extensível para novos toggles
    /**
     * Verifica um toggle genérico.
     * @param {string} key - Chave do toggle.
     * @returns {boolean}
     */
    isEnabled(key) {
        return this.config?.[key] ?? false;
    }
}