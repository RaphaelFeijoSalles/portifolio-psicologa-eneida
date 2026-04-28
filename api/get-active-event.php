<?php
/**
 * Endpoint para obter evento ativo
 * Consumido por: Frontend (JS), create-checkout.php
 * Response: JSON com dados do evento ativo ou erro
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

try {
    $eventFile = __DIR__ . '/../assets/data/activeEvent.json';
    
    if (!file_exists($eventFile)) {
        http_response_code(404);
        echo json_encode(['error' => 'Arquivo de evento não encontrado']);
        exit;
    }
    
    $eventData = json_decode(file_get_contents($eventFile), true);
    
    if (!$eventData) {
        http_response_code(500);
        echo json_encode(['error' => 'Erro ao decodificar dados do evento']);
        exit;
    }
    
    http_response_code(200);
    echo json_encode($eventData);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro interno: ' . $e->getMessage()]);
}
?>
