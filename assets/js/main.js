import { loadComponent } from './utils/componentLoader.js';
import { HeaderMenu } from './modules/HeaderMenu.js';
import { initClipboardHandler } from './utils/clipboard.js';
import { BannerController } from './modules/BannerController.js';
import { FooterController } from './modules/FooterController.js';
import { EventPageController } from './modules/EventPageController.js';

// ====== CONFIGURAÇÃO GLOBAL DO SITE ======
const CONFIG_SITE = {
    eventBanner: {
        enabled: true,           // Mude para false para desativar banner completamente
        showOnlyHomepage: true   // Se true, mostra apenas na página principal
    }
};

// Função para verificar se estamos na página principal
function isMainPage() {
    const pathname = window.location.pathname;
    return pathname === '/' || pathname === '/index.html' || pathname.endsWith('/portifolio-psicologa-eneida/');
}

// Função para determinar se deve mostrar o banner
function shouldShowBanner() {
    // Se está desativado globalmente, não mostra em lugar nenhum
    if (!CONFIG_SITE.eventBanner.enabled) {
        return false;
    }

    // Se está ativado e tem a restrição de página principal
    if (CONFIG_SITE.eventBanner.showOnlyHomepage) {
        return isMainPage();
    }

    // Se está ativado e sem restrição de página, mostra em todo lugar
    return true;
}

document.addEventListener("DOMContentLoaded", async () => {
    
    // Descobre se está rodando no GitHub Pages para ajustar o caminho
    const isGitHub = window.location.hostname.includes('github.io');
    const BASE_PATH = isGitHub ? '/portifolio-psicologa-eneida' : '';

    // 1. Injeta os componentes (Header e Footer sempre)
    await loadComponent('app-header', `${BASE_PATH}/components/header.html`);
    await loadComponent('app-footer', `${BASE_PATH}/components/footer.html`);

    // 2. Injeta e inicializa o Banner conforme configuração
    if (shouldShowBanner()) {
        await loadComponent('app-banner', `${BASE_PATH}/components/banner.html`);
        const bannerController = new BannerController();
        bannerController.init();
    }

    // 3. Inicializa Classes Modulares (agora que o HTML existe)
    const headerMenu = new HeaderMenu();
    headerMenu.init();
    const footer = new FooterController()
    footer.init()
    const eventController = new EventPageController();
    eventController.init()

    // 4. Utilitários das páginas internas
    initClipboardHandler(); // Vai checar se o botão existe antes de aplicar
});