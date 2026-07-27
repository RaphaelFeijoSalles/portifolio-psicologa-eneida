export class BannerController {
    /**
     * @param {string|Document|HTMLElement} target
     */
    constructor(target = document) {
        this.target = typeof target === 'string' ? document.querySelector(target) : target;
        this.banner = this.target?.matches?.('[data-site-banner]')
            ? this.target
            : this.target?.querySelector('[data-site-banner]') || null;
        this.closeBtn = this.banner?.querySelector('[data-banner-close]') || null;
        this.bannerLink = this.banner?.querySelector('[data-banner-link]') || null;
        this.dismissedKey = this.banner?.dataset.bannerDismissedKey
            || `siteBannerDismissed:${this.banner?.dataset.bannerId || 'default'}`;
        this.showTimer = null;

        this.hideBanner = this.hideBanner.bind(this);
        this.handleBannerLinkClick = this.handleBannerLinkClick.bind(this);
    }

    init() {
        if (!this.banner) return this;

        // Verifica se o banner foi explicitamente fechado nesta sessão
        const isDismissed = sessionStorage.getItem(this.dismissedKey);

        if (isDismissed) {
            // Se foi fechado, deixa oculto
            this.banner.classList.add('hidden');
            return this;
        }

        // Senão, mostra com animação
        this.showTimer = window.setTimeout(() => {
            this.banner.classList.add('visible');
        }, 500);

        this.bindEvents();
        return this;
    }

    bindEvents() {
        if (this.closeBtn) this.closeBtn.addEventListener('click', this.hideBanner);
        if (this.bannerLink) this.bannerLink.addEventListener('click', this.handleBannerLinkClick);
    }

    unbindEvents() {
        if (this.closeBtn) this.closeBtn.removeEventListener('click', this.hideBanner);
        if (this.bannerLink) this.bannerLink.removeEventListener('click', this.handleBannerLinkClick);
    }

    destroy() {
        if (this.showTimer) {
            window.clearTimeout(this.showTimer);
        }

        this.unbindEvents();
    }

    hideBanner() {
        if (!this.banner) return;

        if (this.showTimer) {
            window.clearTimeout(this.showTimer);
            this.showTimer = null;
        }

        // Remove o banner com animação
        this.banner.classList.remove('visible');
        this.banner.classList.add('hidden');

        // Registra que foi fechado nesta sessão (persiste enquanto a aba está aberta)
        sessionStorage.setItem(this.dismissedKey, 'true');
    }

    handleBannerLinkClick(e) {
        // Intercepta o clique no link do banner
        const href = this.bannerLink?.getAttribute('href');

        // Remove o banner com efeito suave
        this.hideBanner();

        // Navega para o alvo de forma suave
        if (href && href.startsWith('#')) {
            e.preventDefault();

            // Aguarda um pouco para o efeito de sumir do banner ser visível
            setTimeout(() => {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    // Atualiza a URL sem recarregar a página
                    window.history.replaceState(null, document.title, href);
                }
            }, 300);
        }
    }
}
