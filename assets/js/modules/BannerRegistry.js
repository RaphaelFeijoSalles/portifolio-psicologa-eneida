/**
 * Catálogo de banners da homepage. Para adicionar uma nova campanha, basta
 * incluir uma definição e o respectivo toggle no arquivo de configuração.
 * O primeiro banner habilitado é exibido, evitando sobreposição de avisos.
 */
const HOMEPAGE_BANNERS = [
    {
        id: 'book',
        toggleKey: 'enableBookBanner',
        componentPath: 'components/book-banner.html',
    },
    {
        id: 'event',
        toggleKey: 'enableBanner',
        componentPath: 'components/banner.html',
    },
];

/**
 * @param {{isEnabled: (key: string) => boolean}} toggleController
 * @returns {{id: string, toggleKey: string, componentPath: string}|null}
 */
export function getActiveHomepageBanner(toggleController) {
    return HOMEPAGE_BANNERS.find(({ toggleKey }) => toggleController.isEnabled(toggleKey)) || null;
}
