import { loadComponent } from './utils/componentLoader.js';
import { HeaderMenu } from './modules/HeaderMenu.js';
import { initClipboardHandler } from './utils/clipboard.js';
import { BannerController } from './modules/BannerController.js';
import { FooterController } from './modules/FooterController.js'

// Função para verificar se estamos na página principal
function isMainPage() {
    const pathname = window.location.pathname;
    // Retorna true se for "/" ou "/index.html"
    return pathname === '/' || pathname === '/index.html' || pathname.endsWith('/portifolio-psicologa-eneida/');
}

document.addEventListener("DOMContentLoaded", async () => {

    // 1. Injeta os componentes (Header e Footer sempre)
    await loadComponent('app-header', '/components/header.html');
    await loadComponent('app-footer', '/components/footer.html');

    // 2. Injeta e inicializa o Banner SOMENTE na página principal
    if (isMainPage()) {
        await loadComponent('app-banner', '/components/banner.html');
        const bannerController = new BannerController();
        bannerController.init();
    }

    // 3. Inicializa Classes Modulares (agora que o HTML existe)
    const headerMenu = new HeaderMenu();
    headerMenu.init();
    const footer = new FooterController()
    footer.init()

    // 4. Utilitários das páginas internas
    initClipboardHandler(); // Vai checar se o botão existe antes de aplicar
});