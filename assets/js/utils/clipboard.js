/**
 * Lógica do botão de copiar endereço de forma minimalista.
 * Mantém apenas o contorno azul e ícone singelo.
 */
export function initClipboardHandler() {
    const btnCopy = document.getElementById('btn-copy-endereco');
    const enderecoTexto = document.getElementById('endereco-texto');

    if (!btnCopy || !enderecoTexto) return;

    // Ícone de check de sucesso
    const svgCheck = `
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;

    // Ícone original
    const svgOriginal = btnCopy.innerHTML;

    btnCopy.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(enderecoTexto.innerText);
            
            // Adiciona feedback visual (borda verde/azul e check)
            btnCopy.classList.add('copied');
            btnCopy.innerHTML = svgCheck;
            
            // Remove o evento visual após 2 segundos
            setTimeout(() => {
                btnCopy.classList.remove('copied');
                btnCopy.innerHTML = svgOriginal;
            }, 2000);
        } catch (err) {
            console.error('Falha ao copiar:', err);
        }
    });
}