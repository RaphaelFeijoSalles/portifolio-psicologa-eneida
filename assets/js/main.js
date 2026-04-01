import { loadComponent } from './utils/componentLoader.js';
import { HeaderMenu } from './modules/HeaderMenu.js';
import { initClipboardHandler } from './utils/clipboard.js';
import { BannerController } from './modules/BannerController.js';

// Configuração Global
const CONFIG_SITE = {
    showEventBanner: true // Mude para false para desativar o banner em todo o site
};

document.addEventListener("DOMContentLoaded", async () => {
    
    // 1. Injeta os componentes (Header e Footer sempre)
    await loadComponent('app-header', '/components/header.html');
    await loadComponent('app-footer', '/components/footer.html');

    // 2. Injeta e inicializa o Banner se estiver ativo
    if (CONFIG_SITE.showEventBanner) {
        await loadComponent('app-banner', '/components/banner.html');
        const bannerController = new BannerController();
        bannerController.init();
    }

    // 3. Inicializa Classes Modulares (agora que o HTML existe)
    const headerMenu = new HeaderMenu();
    headerMenu.init();

    // 4. Utilitários das páginas internas
    initClipboardHandler(); // Vai checar se o botão existe antes de aplicar
});