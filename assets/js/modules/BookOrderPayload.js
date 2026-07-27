/**
 * Regras de domínio do pedido de livro. Mantê-las fora da página deixa a
 * montagem do formulário independente da transformação do payload.
 */

/**
 * Junta as opções adicionais ao texto que será salvo no pedido.
 *
 * @param {string} observation
 * @param {string[]} selectedOptions
 */
export function appendOrderOptionsToObservation(observation, selectedOptions) {
    const text = observation.trim();
    const options = selectedOptions.filter(Boolean);

    if (!options.length) {
        return text;
    }

    return `${text}${text ? ' ' : ''}[${options.join(', ')}]`;
}

/**
 * @param {Record<string, string>} payload
 */
export function buildFullAddress(payload) {
    const street = [payload.logradouro, payload.numero].filter(Boolean).join(', ');
    const city = [payload.cidade, payload.uf].filter(Boolean).join(' - ');

    return [
        street,
        payload.complemento,
        payload.bairro,
        city,
        payload.cep ? `CEP ${payload.cep}` : '',
    ].filter(Boolean).join(' | ');
}

/**
 * Intercepta os dados imediatamente antes do envio ao checkout. As opções são
 * agrupadas em um array e registradas junto à observação do cliente.
 *
 * @param {Record<string, string>} payload
 * @param {string[]} selectedOptions
 * @returns {Record<string, string>}
 */
export function prepareBookOrderPayload(payload, selectedOptions) {
    const transformedPayload = {
        ...payload,
        endereco_completo: buildFullAddress(payload),
        observacao: appendOrderOptionsToObservation(payload.observacao || '', selectedOptions),
    };

    delete transformedPayload.para_presente;
    delete transformedPayload.autografado;

    return transformedPayload;
}
