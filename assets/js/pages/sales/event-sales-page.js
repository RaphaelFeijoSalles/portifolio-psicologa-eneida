import { SalesHero } from '../../components/sales/SalesHero.js';
import { SalesBenefits } from '../../components/sales/SalesBenefits.js';
import { SalesFAQ } from '../../components/sales/SalesFAQ.js';
import { CheckoutFormBase } from '../../components/sales/CheckoutFormBase.js';

function initEventSalesPage() {
    new SalesHero('#sales-hero', {
        title: ['3ª Tarde de Imersão:', 'A cura que vem da terra'],
        subtitle: 'Vivência de reconexão, relaxamento e enraizamento.',
        meta: '18 de Abril de 2026 (Sábado)',
    }).render();

    new SalesBenefits('#sales-benefits', {
        title: 'Como Garantir sua Vaga',
        subtitle: 'O processo de inscrição é simples, rápido e 100% seguro.',
        tone: 'alternate',
        items: [
            {
                title: 'Preencha o formulário',
                description: 'Complete seus dados pessoais e de contato. Essas informações ajudam a preparar a imersão.',
            },
            {
                title: 'Pagamento seguro',
                description: 'Ao gerar o pagamento, você será direcionada ao ambiente criptografado do PagBank para pagar por PIX, crédito ou débito.',
            },
            {
                title: 'Confirmação da vaga',
                description: 'Após a aprovação do pagamento, sua vaga estará garantida e você será direcionada para a confirmação.',
            },
        ],
    }).render();

    new SalesFAQ('#sales-faq', {
        title: 'Dúvidas frequentes',
        items: [
            {
                question: 'Quais são as formas de pagamento?',
                answer: 'Você poderá escolher PIX, cartão de crédito ou cartão de débito no ambiente seguro do PagBank.',
            },
            {
                question: 'Quando minha vaga é confirmada?',
                answer: 'A confirmação acontece assim que o pagamento for aprovado pela operadora.',
            },
            {
                question: 'O que preciso levar?',
                answer: 'Use roupas confortáveis que possam sujar, leve chinelos, repelente e sua garrafa de água.',
            },
        ],
    }).render();

    new CheckoutFormBase({
        target: '#sales-checkout',
        formId: 'native-checkout-form',
        productId: 'imersao',
        title: 'Inscrição e Pagamento',
        subtitle: 'Preencha seus dados abaixo para gerar seu link de pagamento seguro.',
        sections: [
            {
                title: 'Dados Pessoais',
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
                        id: 'email',
                        name: 'email',
                        label: 'E-mail',
                        type: 'email',
                        required: true,
                        behavior: 'email',
                        autocomplete: 'email',
                        placeholder: 'seu@email.com',
                    }, {
                        id: 'nascimento',
                        name: 'nascimento',
                        label: 'Data de nascimento',
                        type: 'date',
                        required: true,
                        autocomplete: 'bday',
                    }],
                    [{
                        id: 'whatsapp',
                        name: 'whatsapp',
                        label: 'Contato / WhatsApp',
                        type: 'tel',
                        required: true,
                        behavior: 'phone',
                        autocomplete: 'tel',
                        inputMode: 'numeric',
                        maxLength: 15,
                        placeholder: '(43) 99999-9999',
                    }, {
                        id: 'emergencia',
                        name: 'emergencia',
                        label: 'Contato para emergência',
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
                title: 'Sobre a Imersão',
                rows: [
                    [{
                        id: 'expectativa',
                        name: 'expectativa',
                        label: 'Você já participou de uma imersão? O que espera desta tarde?',
                        type: 'textarea',
                        required: true,
                        rows: 3,
                    }],
                    [{
                        id: 'proximo_encontro',
                        name: 'proximo_encontro',
                        label: 'O que gostaria que tivesse em um próximo encontro?',
                        type: 'textarea',
                        required: true,
                        rows: 2,
                    }],
                    [{
                        id: 'autoriza_imagem',
                        name: 'autoriza_imagem',
                        label: 'Termo de Imagem: autorizo a gravação e o uso da minha imagem e voz, a título gratuito, para divulgação do trabalho da psicóloga Eneida Feijó.',
                        type: 'radio',
                        required: true,
                        options: [
                            { label: 'Sim, eu autorizo.', value: 'Sim' },
                            { label: 'Não, eu não autorizo.', value: 'Não' },
                        ],
                    }],
                ],
            },
        ],
        validation: {
            emailFields: ['email'],
            phoneFields: ['whatsapp', 'emergencia'],
            distinctPhonePairs: [['whatsapp', 'emergencia']],
        },
        payment: {
            priceLabel: 'Valor do investimento: R$ 240,00',
            methods: [
                'PIX: pagamento à vista sem taxas adicionais.',
                'Cartão de crédito: parcelamento em até 12x, com taxas da operadora.',
                'Cartão de débito: pagamento à vista disponível no checkout do PagBank.',
            ],
            disclaimer: 'Você será redirecionada para o ambiente criptografado do PagBank.',
        },
    }).render();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventSalesPage, { once: true });
} else {
    initEventSalesPage();
}
