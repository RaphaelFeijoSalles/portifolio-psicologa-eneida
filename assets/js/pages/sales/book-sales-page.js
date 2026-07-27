import { SalesHero } from '../../components/sales/SalesHero.js';
import { SalesBenefits } from '../../components/sales/SalesBenefits.js';
import { SalesFAQ } from '../../components/sales/SalesFAQ.js';
import { SalesHighlight } from '../../components/sales/SalesHighlight.js';
import { SalesLocationMap } from '../../components/sales/SalesLocationMap.js';
import { CheckoutFormBase } from '../../components/sales/CheckoutFormBase.js';
import { CepAddressLookup } from '../../modules/CepAddressLookup.js';
import { DeliveryMethodController } from '../../modules/DeliveryMethodController.js';
import { prepareBookOrderPayload } from '../../modules/BookOrderPayload.js';

const BOOK_PRODUCT_ENDPOINT = '/api/products.php?product=livro';
const BOOK_LAUNCH = {
    dateAndTime: '29/07 (quarta-feira), às 19h',
    venue: 'Biblioteca Municipal de Londrina',
    address: 'Av. Rio de Janeiro, 413 - Centro Londrina - PR',
    mapUrl: 'https://www.google.com/maps?q=Biblioteca+Municipal+de+Londrina%2C+Av.+Rio+de+Janeiro%2C+413%2C+Centro%2C+Londrina+-+PR&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Biblioteca%20Municipal%20de%20Londrina%2C%20Av.%20Rio%20de%20Janeiro%2C%20413%2C%20Centro%2C%20Londrina%20-%20PR',
};
const BOOK_LAUNCH_LOCATION = `${BOOK_LAUNCH.venue} (${BOOK_LAUNCH.address})`;

const unavailableBook = {
    title: 'Memórias de uma psicóloga em um relacionamento abusivo',
    description: 'O livro de Eneida Feijó para ler, refletir e acolher a própria história.',
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
        image: {
            src: '../../assets/images/livro/livro.png',
            alt: `Capa do livro ${product.title}`,
        },
    }).render();

    new SalesHighlight('#sales-highlight', {
        eyebrow: 'Evento de estreia do livro',
        title: 'Um encontro especial com a Eneida',
        description: 'Celebre a estreia do livro e, se preferir, resgate seu exemplar presencialmente com a autora.',
        eventDetails: [
            {
                label: 'Data e horário',
                value: BOOK_LAUNCH.dateAndTime,
            },
            {
                label: 'Local',
                value: BOOK_LAUNCH_LOCATION,
            },
        ],
        items: [
            {
                title: 'Frete grátis para todo o Brasil',
                description: 'Se preferir receber em casa, a entrega não terá custo adicional.',
            },
            {
                title: 'Resgate presencial na estreia',
                description: 'Escolha essa opção no pedido para retirar seu exemplar diretamente com a Eneida no evento.',
            },
        ],
        cta: { label: 'Garantir meu exemplar', href: '#book-checkout-section' },
        seal: 'Estreia',
    }).render();

    new SalesLocationMap('#sales-location', {
        eyebrow: 'Evento de estreia',
        title: 'Como chegar à estreia',
        description: `Nos vemos em ${BOOK_LAUNCH.dateAndTime}.`,
        mapTitle: `Mapa para ${BOOK_LAUNCH_LOCATION}`,
        mapUrl: BOOK_LAUNCH.mapUrl,
        venue: BOOK_LAUNCH.venue,
        address: BOOK_LAUNCH.address,
        directionsUrl: BOOK_LAUNCH.directionsUrl,
        directionsLabel: 'Traçar rota',
    }).render();

    new SalesBenefits('#sales-benefits', {
        title: 'Seu pedido em poucos passos',
        subtitle: 'Escolha como receber o livro e finalize o pagamento com segurança.',
        tone: 'alternate',
        items: [
            {
                title: 'Escolha como receber',
                description: 'Receba em casa com frete grátis para todo o Brasil ou retire presencialmente na estreia.',
            },
            {
                title: 'Complete seu pedido',
                description: 'Informe seus dados e, para entrega, o endereço. Você também pode indicar presente ou autógrafo.',
            },
            {
                title: 'Finalize o pagamento',
                description: 'O pagamento é gerado no ambiente protegido do PagBank, por PIX, crédito ou débito.',
            },
        ],
    }).render();

    new SalesFAQ('#sales-faq', {
        title: 'Dúvidas frequentes',
        items: [
            {
                question: 'O frete é gratuito?',
                answer: 'Sim. A entrega do livro é gratuita para qualquer endereço no Brasil.',
            },
            {
                question: 'Posso retirar o livro presencialmente?',
                answer: `Sim. Selecione o resgate presencial no formulário e retire seu exemplar com a Eneida em ${BOOK_LAUNCH.dateAndTime}, na ${BOOK_LAUNCH_LOCATION}.`,
            },
            {
                question: 'Quais são as formas de pagamento?',
                answer: 'Você poderá pagar por PIX, cartão de crédito ou cartão de débito no checkout do PagBank.',
            },
        ],
    }).render();

    const checkout = new CheckoutFormBase({
        target: '#sales-checkout',
        formId: 'book-checkout',
        productId: 'livro',
        title: 'Peça seu exemplar',
        subtitle: 'Escolha entre entrega com frete grátis ou resgate presencial na estreia do livro.',
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
                title: 'Como você quer receber o livro?',
                rows: [
                    [{
                        id: 'metodo_recebimento',
                        name: 'metodo_recebimento',
                        label: 'Escolha uma opção',
                        type: 'segmented',
                        required: true,
                        statusKey: 'delivery-method',
                        options: [
                            {
                                label: 'Receber no endereço',
                                value: 'entrega',
                                description: 'Frete grátis para todo o Brasil.',
                                checked: true,
                            },
                            {
                                label: 'Resgatar presencialmente',
                                value: 'retirada_presencial',
                                description: `${BOOK_LAUNCH.dateAndTime}, na ${BOOK_LAUNCH.venue}.`,
                            },
                        ],
                    }],
                ],
            },
            {
                id: 'book-shipping-address',
                title: 'Endereço de entrega',
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
                title: 'Observações do pedido',
                rows: [
                    [{
                        id: 'observacao',
                        name: 'observacao',
                        label: 'Observação (opcional)',
                        type: 'textarea',
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
                'Cartão de crédito: condições disponíveis no checkout do PagBank.',
                'Cartão de débito: pagamento à vista disponível no checkout do PagBank.',
            ],
            disclaimer: 'Você será redirecionada para o ambiente criptografado do PagBank.',
        },
    }).render();

    if (checkout.form) {
        new CepAddressLookup(checkout.form).init();
        new DeliveryMethodController(checkout.form, {
            addressSectionId: 'book-shipping-address',
            pickupStatusMessage: `Resgate seu exemplar com a Eneida em ${BOOK_LAUNCH.dateAndTime}, na ${BOOK_LAUNCH.venue}.`,
        }).init();
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
