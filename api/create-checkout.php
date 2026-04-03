<?php
// Define que a resposta será em formato JSON
header('Content-Type: application/json');

// Segurança: Bloqueia qualquer método que não seja POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

try {
    // 1. Recebe os dados do formulário Front-end
    $inputJSON = file_get_contents('php://input');
    $customerData = json_decode($inputJSON, true);

    // 2. Gera um ID Único para essa compra e anexa aos dados
    $nsu = "imersao-" . time();
    $customerData['order_nsu'] = $nsu;

    // ==========================================
    // 3. SALVAR NO GOOGLE SHEETS
    // ==========================================
    // COLE A URL DO SEU WEBHOOK DO GOOGLE AQUI:
    $googleWebhook = "https://script.google.com/macros/s/AKfycbygdC7Zadtk8FbPA-md8rUOZWi8AJYLsr34MUBqcstvMrQEEYkvD82ppJP3hmETnC3Hkw/exec"; 

    if ($googleWebhook !== "https://script.google.com/macros/s/AKfycbygdC7Zadtk8FbPA-md8rUOZWi8AJYLsr34MUBqcstvMrQEEYkvD82ppJP3hmETnC3Hkw/exec") {
        $ch = curl_init($googleWebhook);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($customerData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        // Executa silenciosamente. Se der erro na planilha, não trava o pagamento.
        curl_exec($ch);
        curl_close($ch);
    }

    // ==========================================
    // 4. GERAR LINK NA INFINITEPAY
    // ==========================================
    // Limpa o telefone e adiciona o +55 obrigatório da InfinitePay
    $telefoneLimpo = preg_replace('/\D/', '', $customerData['whatsapp']);
    $telefoneFormatado = "+55" . $telefoneLimpo;

    $payload = [
        "handle" => "raphael-feijo",
        "order_nsu" => $nsu,
        // Descobre o domínio do seu site automaticamente para o redirecionamento
        "redirect_url" => "https://" . $_SERVER['HTTP_HOST'] . "/pages/sucesso/index.html",
        "webhook_url" => "https://" . $_SERVER['HTTP_HOST'] . "/api/webhook.php",
        "items" => [
            [
                "description" => "3ª Tarde de Imersão: A cura que vem da terra",
                "quantity" => 1,
                "price" => 24000
            ]
        ],
        "customer" => [
            "name" => $customerData['nome'],
            "email" => $customerData['email'],
            "phone_number" => $telefoneFormatado
        ]
    ];

    $chIP = curl_init('https://api.infinitepay.io/invoices/public/checkout/links');
    curl_setopt($chIP, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($chIP, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($chIP, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    
    $response = curl_exec($chIP);
    $httpCode = curl_getinfo($chIP, CURLINFO_HTTP_CODE);
    curl_close($chIP);

    if ($httpCode >= 400) {
        http_response_code(500);
        echo json_encode(['error' => 'Falha ao gerar link na InfinitePay']);
        exit;
    }

    $data = json_decode($response, true);
    
    // Pega a URL de retorno dependendo de como a API deles nomear o campo
    $checkoutUrl = $data['url'] ?? $data['link'] ?? $data['checkout_url'];

    // Devolve para o JavaScript redirecionar a tela
    echo json_encode(['checkoutUrl' => $checkoutUrl]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro interno do servidor']);
}
?>