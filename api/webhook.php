<?php
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

    // URL do Google Script aqui!
    $googleWebhook = "URL_DO_GOOGLE_AQUI"; 

    $ch = curl_init($googleWebhook);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $googlePayload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_exec($ch);
    curl_close($ch);

    // Responde 200 OK para a InfinitePay parar de insistir
    http_response_code(200);
    echo "OK";
} else {
    http_response_code(400);
    echo "Bad Request";
}
?>