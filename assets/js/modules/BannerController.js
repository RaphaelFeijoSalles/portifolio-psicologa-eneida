export class BannerController {
    constructor(enableBanner = true) {  // Novo parâmetro opcional
        this.enableBanner = enableBanner;
        this.banner = document.getElementById("event-banner");
        this.closeBtn = document.getElementById("close-banner");
        this.bannerLink = this.banner ? this.banner.querySelector("a") : null;
        this.BANNER_DISMISSED_KEY = "bannerDismissed_session";

        this.hideBanner = this.hideBanner.bind(this);
        this.handleBannerLinkClick = this.handleBannerLinkClick.bind(this);
    }

    init() {
        if (!this.enableBanner) return;  // Respeita toggle
        if (!this.banner) return;

        // Verifica se o banner foi explicitamente fechado nesta sessão
        const isDismissed = sessionStorage.getItem(this.BANNER_DISMISSED_KEY);

        if (isDismissed) {
            // Se foi fechado, deixa oculto
            this.banner.classList.add("hidden");
            return;
        }

        // Senão, mostra com animação
        setTimeout(() => {
            this.banner.classList.add("visible");
        }, 500);

        this.bindEvents();
    }

    bindEvents() {
        if (this.closeBtn) this.closeBtn.addEventListener("click", this.hideBanner);
        // Usar handleBannerLinkClick para interceptar e controlar o link
        if (this.bannerLink) this.bannerLink.addEventListener("click", this.handleBannerLinkClick);
    }

    unbindEvents() {
        if (this.closeBtn) this.closeBtn.removeEventListener("click", this.hideBanner);
        if (this.bannerLink) this.bannerLink.removeEventListener("click", this.handleBannerLinkClick);
    }

    hideBanner() {
        // Remove o banner com animação
        this.banner.classList.remove("visible");
        this.banner.classList.add("hidden");

        // Registra que foi fechado nesta sessão (persiste enquanto a aba está aberta)
        sessionStorage.setItem(this.BANNER_DISMISSED_KEY, "true");
    }

    handleBannerLinkClick(e) {
        // Intercepta o clique no link do banner
        const href = this.bannerLink.getAttribute("href");

        // Remove o banner com efeito suave
        this.hideBanner();

        // Navega para o alvo de forma suave
        if (href && href.startsWith("#")) {
            e.preventDefault();

            // Aguarda um pouco para o efeito de sumir do banner ser visível
            setTimeout(() => {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth" });
                    // Atualiza a URL sem recarregar a página
                    window.history.replaceState(null, document.title, href);
                }
            }, 300);
        }
    }
}
