import { SalesHero } from '../../components/sales/SalesHero.js';
import { SalesBenefits } from '../../components/sales/SalesBenefits.js';
import { SalesFAQ } from '../../components/sales/SalesFAQ.js';
import { CheckoutFormBase } from '../../components/sales/CheckoutFormBase.js';
import { CepAddressLookup } from '../../modules/CepAddressLookup.js';
import { prepareBookOrderPayload } from '../../modules/BookOrderPayload.js';

const BOOK_PRODUCT_ENDPOINT = '/api/products.php?product=livro';

const unavailableBook = {
    title: 'Livro físico de Eneida Feijó',
    description: 'Adquira seu exemplar físico e receba no endereço informado.',
    available: false,
    priceLabel: null,
};

async function loadBookProduct() {
    try {
        const response = await fetch(BOOK_PRODUCT_ENDPOINT, { headers: { Accept: 'application/json' } });
        if (!response.ok) {
            throw new Error('Produto indisponível.');
        }

        return { ...unavailableBook, ...await response.json() };
    } catch (error) {
        console.error('Não foi possível carregar as informações do livro:', error);
        return unavailableBook;
    }
}

/**
 * @param {{title: string, description: string, available: boolean, priceLabel: string|null}} product
 */
function renderBookSalesPage(product) {
    document.title = `${product.title} - Eneida Feijó`;

    new SalesHero('#sales-hero', {
        eyebrow: 'Livro físico',
        title: product.title,
        subtitle: 'Um convite à leitura, reflexão e cuidado.',
        description: product.description,
        cta: { label: 'Quero meu exemplar', href: '#book-checkout-section' },
    }).render();

    new SalesBenefits('#sales-benefits', {
        title: 'Seu pedido em poucos passos',
        subtitle: 'Preencha seus dados de entrega e finalize o pagamento com segurança.',
        tone: 'alternate',
        items: [
            {
                title: 'Informe o endereço',
                description: 'Use o CEP para agilizar o preenchimento e informe os dados completos para a entrega.',
            },
            {
                title: 'Personalize seu exemplar',
                description: 'Você pode indicar se o livro é para presente e se deseja recebê-lo autografado.',
            },
            {
                title: 'Finalize com segurança',
                description: 'O pagamento é gerado no ambiente protegido da InfinitePay, por PIX ou cartão.',
            },
        ],
    }).render();

    new SalesFAQ('#sales-faq', {
        title: 'Dúvidas frequentes',
        items: [
            {
                question: 'Como encontro meu CEP?',
                answer: 'No formulário há um link “Esqueci meu CEP” que abre a busca oficial dos Correios em outra aba.',
            },
            {
                question: 'Posso pedir o livro para presente?',
                answer: 'Sim. Ative a opção “Para presente?” antes de gerar o pagamento para incluir essa informação no pedido.',
            },
            {
                question: 'Como confirmo meu pedido?',
                answer: 'Após a aprovação do pagamento, você será direcionada para a página de confirmação.',
            },
        ],
    }).render();

    const checkout = new CheckoutFormBase({
        target: '#sales-checkout',
        formId: 'book-checkout',
        productId: 'livro',
        title: 'Peça seu exemplar',
        subtitle: 'Os campos marcados com asterisco são necessários para preparar e entregar seu pedido.',
        available: product.available,
        unavailableMessage: 'A venda do livro será liberada assim que os dados do produto forem configurados.',
        sections: [
            {
                title: 'Dados do pedido',
                rows: [
                    [{
                        id: 'nome',
                        name: 'nome',
                        label: 'Nome completo',
                        required: true,
                        autocomplete: 'name',
                        placeholder: 'Digite seu nome completo',
                    }],
                    [{
                        id: 'whatsapp',
                        name: 'whatsapp',
                        label: 'WhatsApp',
                        type: 'tel',
                        required: true,
                        behavior: 'phone',
                        autocomplete: 'tel',
                        inputMode: 'numeric',
                        maxLength: 15,
                        placeholder: '(43) 99999-9999',
                    }],
                ],
            },
            {
                title: 'Endereço completo',
                rows: [
                    [{
                        id: 'cep',
                        name: 'cep',
                        label: 'CEP',
                        required: true,
                        behavior: 'cep',
                        autocomplete: 'postal-code',
                        inputMode: 'numeric',
                        maxLength: 9,
                        pattern: '\\d{5}-?\\d{3}',
                        placeholder: '00000-000',
                        hint: 'Digite o CEP para preencher o endereço automaticamente.',
                        statusKey: 'cep',
                        helpLink: {
                            label: 'Esqueci meu CEP',
                            href: 'https://buscacepinter.correios.com.br/app/endereco/index.php',
                        },
                    }],
                    [{
                        id: 'logradouro',
                        name: 'logradouro',
                        label: 'Rua / Avenida',
                        required: true,
                        autocomplete: 'address-line1',
                    }, {
                        id: 'numero',
                        name: 'numero',
                        label: 'Número',
                        required: true,
                        autocomplete: 'address-line2',
                    }],
                    [{
                        id: 'complemento',
                        name: 'complemento',
                        label: 'Complemento',
                        autocomplete: 'address-line2',
                        placeholder: 'Apartamento, bloco, referência…',
                    }, {
                        id: 'bairro',
                        name: 'bairro',
                        label: 'Bairro',
                        required: true,
                        autocomplete: 'address-level3',
                    }],
                    [{
                        id: 'cidade',
                        name: 'cidade',
                        label: 'Cidade',
                        required: true,
                        autocomplete: 'address-level2',
                    }, {
                        id: 'uf',
                        name: 'uf',
                        label: 'UF',
                        required: true,
                        autocomplete: 'address-level1',
                        maxLength: 2,
                        placeholder: 'PR',
                    }],
                ],
            },
            {
                title: 'Observação do pedido',
                rows: [
                    [{
                        id: 'observacao',
                        name: 'observacao',
                        label: 'Observação',
                        type: 'textarea',
                        required: true,
                        rows: 3,
                        placeholder: 'Escreva uma observação para seu pedido.',
                    }],
                    [{
                        id: 'para_presente',
                        name: 'para_presente',
                        label: 'Para presente?',
                        type: 'toggle',
                        value: 'Sim',
                        orderOption: 'Presente',
                    }, {
                        id: 'autografado',
                        name: 'autografado',
                        label: 'Autografado?',
                        type: 'toggle',
                        value: 'Sim',
                        orderOption: 'Autografado',
                    }],
                ],
            },
        ],
        validation: {
            phoneFields: ['whatsapp'],
        },
        transformPayload: (payload, form) => {
            const selectedOptions = Array.from(form.querySelectorAll('[data-order-option]:checked'))
                .map((input) => input.dataset.orderOption || '')
                .filter(Boolean);

            return prepareBookOrderPayload(payload, selectedOptions);
        },
        payment: {
            priceLabel: product.available && product.priceLabel
                ? `Valor do livro: ${product.priceLabel}`
                : 'Valor do livro em configuração',
            methods: [
                'PIX: pagamento à vista sem taxas adicionais.',
                'Cartão de crédito: condições disponíveis no checkout da InfinitePay.',
            ],
            disclaimer: 'Você será redirecionada para o ambiente criptografado da InfinitePay.',
        },
    }).render();

    if (checkout.form) {
        new CepAddressLookup(checkout.form).init();
    }
}

async function initBookSalesPage() {
    const product = await loadBookProduct();
    renderBookSalesPage(product);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookSalesPage, { once: true });
} else {
    initBookSalesPage();
}
