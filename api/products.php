<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/env_loader.php';
require_once __DIR__ . '/product_catalog.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido.'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    loadEnv(__DIR__ . '/../.env');
    $productId = (string) ($_GET['product'] ?? '');
    $product = findSalesProduct($productId);

    if ($product === null) {
        http_response_code(404);
        echo json_encode(['error' => 'Produto não encontrado.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode(getPublicProductData($product), JSON_UNESCAPED_UNICODE);
} catch (Throwable $error) {
    error_log('Erro ao obter produto: ' . $error->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Não foi possível carregar o produto.'], JSON_UNESCAPED_UNICODE);
}
