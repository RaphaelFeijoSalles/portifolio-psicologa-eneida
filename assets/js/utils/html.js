/**
 * Escapa textos interpolados em templates HTML. Os dados das páginas de venda
 * são locais, mas manter essa fronteira evita que uma configuração futura
 * introduza HTML não confiável na página.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
