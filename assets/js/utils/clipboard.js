/**
 * Lógica para gerenciar múltiplos botões de cópia (PIX e Endereço).
 */
export function initClipboardHandler() {
    const copyConfigs = [
        { btnId: 'btn-copy-pix', textId: 'pix-key-texto', cleanSpaces: true },
        { btnId: 'btn-copy-endereco', textId: 'endereco-texto', cleanSpaces: false }
    ];

    copyConfigs.forEach(config => {
        const btn = document.getElementById(config.btnId);
        const textElement = document.getElementById(config.textId);

        if (!btn || !textElement) return;

        const svgOriginal = btn.innerHTML;
        const svgCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

        btn.addEventListener('click', async () => {
            try {
                let textToCopy = textElement.innerText;
                // Limpa espaços apenas se configurado (útil para PIX)
                if (config.cleanSpaces) textToCopy = textToCopy.replace(/\s+/g, '');

                await navigator.clipboard.writeText(textToCopy);
                
                btn.classList.add('copied');
                btn.innerHTML = svgCheck;
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = svgOriginal;
                }, 2000);
            } catch (err) {
                console.error('Falha ao copiar:', err);
            }
        });
    });
}