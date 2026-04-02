// Arquivo: /api/create-checkout.js

export default async function handler(req, res) {
    // 1. Segurança básica: Só aceita requisição POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido. Use POST.' });
    }

    try {
        // Dados recebidos do seu formulário nativo
        const customerData = req.body;

        // 2. Monta o Payload EXATAMENTE como a documentação da InfinitePay pediu
        const infinitePayPayload = {
            handle: "raphael-feijo", // Sua InfiniteTag (sem o $)
            order_nsu: `imersao-${Date.now()}`, // Identificador único do pedido
            redirect_url: `https://${req.headers.host}/pages/sucesso/index.html`, // Para onde o cliente volta
            
            // Lista de produtos (em centavos: 24000 = R$ 240,00)
            items: [
                {
                    description: "3ª Tarde de Imersão: A cura que vem da terra",
                    quantity: 1,
                    price: 24000
                }
            ],
            
            // Dados do cliente para pré-preencher o checkout
            customer: {
                name: customerData.nome,
                email: customerData.email,
                phone_number: customerData.whatsapp
            }
        };

        // 3. Chama a API Pública da InfinitePay (Sem necessidade de Headers de Autenticação!)
        const response = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(infinitePayPayload)
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error("Erro da InfinitePay:", errorDetails);
            throw new Error('Falha ao gerar link na InfinitePay');
        }

        const data = await response.json();

        // 4. A API devolve o link criado. Nós pegamos e enviamos de volta pro Front-end!
        // A documentação deles costuma devolver o link diretamente na propriedade "url" ou dentro de um objeto.
        const checkoutUrl = data.url || data.link || data.checkout_url;

        return res.status(200).json({ checkoutUrl: checkoutUrl });

    } catch (error) {
        console.error("Erro no Backend:", error);
        return res.status(500).json({ error: 'Erro interno ao processar o pagamento' });
    }
}