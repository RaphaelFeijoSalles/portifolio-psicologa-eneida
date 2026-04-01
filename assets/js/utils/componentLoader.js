/**
 * Carrega um arquivo HTML e o injeta dentro de um elemento alvo.
 * @param {string} targetId - O ID do elemento que receberá o HTML.
 * @param {string} filePath - O caminho do arquivo HTML (ex: '/components/header.html').
 */
export async function loadComponent(targetId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        const html = await response.text();
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.innerHTML = html;
        }
    } catch (error) {
        console.error(`Falha ao carregar o componente ${filePath}:`, error);
    }
}