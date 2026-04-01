export class BannerController {
    constructor() {
        this.banner = document.getElementById("event-banner");
        this.closeBtn = document.getElementById("close-banner");
        this.bannerLink = this.banner ? this.banner.querySelector("a") : null;
        
        this.hideBanner = this.hideBanner.bind(this);
    }

    init() {
        if (!this.banner) return;
        setTimeout(() => {
            this.banner.classList.add("visible");
        }, 500);
        this.bindEvents();
    }

    bindEvents() {
        if (this.closeBtn) this.closeBtn.addEventListener("click", this.hideBanner);
        if (this.bannerLink) this.bannerLink.addEventListener("click", this.hideBanner);
    }

    unbindEvents() {
        if (this.closeBtn) this.closeBtn.removeEventListener("click", this.hideBanner);
        if (this.bannerLink) this.bannerLink.removeEventListener("click", this.hideBanner);
    }

    hideBanner() {
        this.banner.classList.add("hidden");
    }
}