export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido. Use POST.' });
    }

    try {
        const customerData = req.body;

        // ==========================================
        // 1. SALVAR DADOS NO GOOGLE SHEETS
        // ==========================================
        // Fazemos isso dentro de um try/catch isolado. 
        // Se a planilha falhar, o erro é "engolido" e o link de pagamento ainda é gerado.
        try {
            if (process.env.GOOGLE_SHEET_WEBHOOK) {
                await fetch(process.env.GOOGLE_SHEET_WEBHOOK, {
                    method: 'POST',
                    body: JSON.stringify(customerData)
                });
                console.log("Dados salvos na planilha com sucesso.");
            } else {
                console.warn("Variável GOOGLE_SHEET_WEBHOOK não configurada na Vercel.");
            }
        } catch (sheetError) {
            console.error("Erro não-crítico ao salvar na planilha:", sheetError);
        }

        // ==========================================
        // 2. GERAR LINK NA INFINITEPAY
        // ==========================================
        const infinitePayPayload = {
            handle: "raphael-feijo",
            order_nsu: `imersao-${Date.now()}`,
            redirect_url: `https://${req.headers.host}/pages/sucesso/index.html`,
            items: [
                {
                    description: "3ª Tarde de Imersão: A cura que vem da terra",
                    quantity: 1,
                    price: 24000
                }
            ],
            customer: {
                name: customerData.nome,
                email: customerData.email,
                phone_number: customerData.whatsapp
            }
        };

        const response = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(infinitePayPayload)
        });

        if (!response.ok) {
            throw new Error('Falha ao gerar link na InfinitePay');
        }

        const data = await response.json();
        const checkoutUrl = data.url || data.link || data.checkout_url;

        // Devolve o link de pagamento para o site
        return res.status(200).json({ checkoutUrl: checkoutUrl });

    } catch (error) {
        console.error("Erro Crítico no Backend:", error);
        return res.status(500).json({ error: 'Erro interno ao processar o pagamento' });
    }
}