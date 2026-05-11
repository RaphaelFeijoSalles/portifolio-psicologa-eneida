import { loadComponent } from './utils/componentLoader.js';
import { HeaderMenu } from './modules/HeaderMenu.js';
import { BannerController } from './modules/BannerController.js';
import { FooterController } from './modules/FooterController.js';
import { EventPageController } from './modules/EventPageController.js';
import { EventListController } from './modules/EventListController.js';
import { ToggleController } from './modules/ToggleController.js';  // Novo import


//Calcula a raiz do site baseada no próprio arquivo JS
const PROJECT_ROOT = new URL('../../', import.meta.url).pathname;

/**
 * Detecta se a página atual é a homepage principal
 * @returns {boolean}
 */
function isMainPage() {
    const pathname = window.location.pathname;
    return pathname === '/'
        || pathname === '/index.html'
        || pathname.endsWith('/portifolio-psicologa-eneida/')
        || pathname.endsWith('/portifolio-psicologa-eneida/index.html');
}

document.addEventListener("DOMContentLoaded", async () => {
    // 1. Inicializa ToggleController primeiro para carregar config
    const toggleController = new ToggleController();
    await toggleController.init();

    // 1. Injeta os componentes passando o PROJECT_ROOT como 3º argumento
    await loadComponent('app-header', `${PROJECT_ROOT}components/header.html`, PROJECT_ROOT);
    await loadComponent('app-footer', `${PROJECT_ROOT}components/footer.html`, PROJECT_ROOT);

    // 2. Injeta o Banner APENAS na homepage E se toggle permitir
    if (isMainPage() && toggleController.isBannerEnabled()) {
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

    // Passa toggleController para EventListController
    EventListController.init(toggleController);
});