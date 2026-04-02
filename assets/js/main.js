import { loadComponent } from './utils/componentLoader.js';
import { HeaderMenu } from './modules/HeaderMenu.js';
import { initClipboardHandler } from './utils/clipboard.js';
import { BannerController } from './modules/BannerController.js';
import { FooterController } from './modules/FooterController.js';
import { EventPageController } from './modules/EventPageController.js';

//Calcula a raiz do site baseada no próprio arquivo JS
const PROJECT_ROOT = new URL('../../', import.meta.url).pathname;

// ====== CONFIGURAÇÃO GLOBAL DO SITE ======
const CONFIG_SITE = {
    eventBanner: {
        enabled: true, // False para desativar banner completamente
        showOnlyHomepage: true // Se true, mostra apenas na página principal
    }
};

function isMainPage() {
    const pathname = window.location.pathname;
    return pathname === '/' || pathname === '/index.html' || pathname.endsWith('/portifolio-psicologa-eneida/');
}

function shouldShowBanner() {
    if (!CONFIG_SITE.eventBanner.enabled) return false;
    if (CONFIG_SITE.eventBanner.showOnlyHomepage) return isMainPage();
    return true;
}

document.addEventListener("DOMContentLoaded", async () => {

// 1. Injeta os componentes passando o PROJECT_ROOT como 3º argumento
    await loadComponent('app-header', `${PROJECT_ROOT}components/header.html`, PROJECT_ROOT);
    await loadComponent('app-footer', `${PROJECT_ROOT}components/footer.html`, PROJECT_ROOT);

    // 2. Injeta o Banner se estiver ativo
    if (shouldShowBanner()) {
        await loadComponent('app-banner', `${PROJECT_ROOT}components/banner.html`, PROJECT_ROOT);
        const bannerController = new BannerController();
        bannerController.init();
    }

    // 3. Inicializa Classes Modulares
    const headerMenu = new HeaderMenu();
    headerMenu.init();
    
    const footer = new FooterController();
    footer.init();
    
    const eventController = new EventPageController();
    eventController.init();

    // 4. Utilitários das páginas internas
    initClipboardHandler();
});