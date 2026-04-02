/**
 * Carrega um arquivo HTML, injeta o caminho base correto e coloca na tela.
 */
export async function loadComponent(targetId, filePath, projectRoot = './') {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        
        let html = await response.text();
        
        // Troca a variável {{ROOT}} pelo caminho dinâmico da raiz!
        html = html.replace(/\{\{ROOT\}\}/g, projectRoot);
        
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.innerHTML = html;
        }
    } catch (error) {
        console.error(`Falha ao carregar o componente ${filePath}:`, error);
    }
}