<?php
// Carrega o leitor do .env e busca o arquivo na raiz do projeto (../)
require_once __DIR__ . '/env_loader.php'; 

try {
    loadEnv(__DIR__ . '/../.env');
} catch (Exception $e) {
    http_response_code(500);
    echo "Erro de configuração do servidor.";
    exit;
}

// Recebe a notificação da InfinitePay
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Se a InfinitePay mandar o status de pago (Eles enviam "amount" e "paid_amount" no webhook)
if (isset($data['order_nsu']) && isset($data['paid_amount'])) {
    
    // Prepara o recado para o Google Sheets
    $googlePayload = json_encode([
        "action" => "update_status",
        "order_nsu" => $data['order_nsu'],
        "status" => "PAGO (" . $data['capture_method'] . ")"
    ]);

    // Puxa a URL do Google do arquivo .env
    $googleWebhook = $_ENV['GOOGLE_WEBHOOK_URL'] ?? ''; 

    if (empty($googleWebhook)) {
        http_response_code(500);
        echo "Erro interno: URL do Webhook não configurada.";
        exit;
    }

    $ch = curl_init($googleWebhook);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $googlePayload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_exec($ch);

    // Responde 200 OK para a InfinitePay parar de insistir
    http_response_code(200);
    echo "OK";
} else {
    http_response_code(400);
    echo "Bad Request";
}
?>