<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/env_loader.php';
require_once __DIR__ . '/product_catalog.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondWithJson(['error' => 'Método não permitido.'], 405);
}

try {
    loadEnv(__DIR__ . '/../.env');

    $customerData = getCheckoutInput();
    $productId = $customerData['productId'] ?? 'imersao';
    $product = findSalesProduct($productId);

    if ($product === null) {
        respondWithJson(['error' => 'Produto não encontrado.'], 404);
    }

    if ((int) $product['priceCents'] <= 0) {
        respondWithJson(['error' => 'Este produto ainda não está disponível para venda.'], 409);
    }

    validateCheckoutData($customerData, $product);

    $customerData['productId'] = $product['id'];
    $customerData['produto'] = $product['title'];
    $customerData['order_nsu'] = sprintf(
        '%s-%s-%s',
        $product['orderPrefix'],
        time(),
        bin2hex(random_bytes(4))
    );

    sendOrderToGoogleSheets($customerData);

    $checkoutUrl = createInfinitePayCheckout($customerData, $product);
    respondWithJson(['checkoutUrl' => $checkoutUrl]);
} catch (InvalidArgumentException $error) {
    respondWithJson(['error' => $error->getMessage()], 422);
} catch (Throwable $error) {
    error_log('Erro ao criar checkout: ' . $error->getMessage());
    respondWithJson(['error' => 'Erro interno ao gerar o pagamento.'], 500);
}

/**
 * @return array<string, string>
 */
function getCheckoutInput(): array
{
    $input = json_decode((string) file_get_contents('php://input'), true);

    if (!is_array($input)) {
        throw new InvalidArgumentException('Dados do formulário inválidos.');
    }

    $normalizedInput = [];
    foreach ($input as $key => $value) {
        if (is_string($key) && is_scalar($value)) {
            $normalizedInput[$key] = trim((string) $value);
        }
    }

    return $normalizedInput;
}

/**
 * @param array<string, string> $customerData
 * @param array<string, mixed> $product
 */
function validateCheckoutData(array $customerData, array $product): void
{
    foreach ($product['requiredFields'] as $field) {
        if (($customerData[$field] ?? '') === '') {
            throw new InvalidArgumentException('Preencha todos os campos obrigatórios para continuar.');
        }
    }

    foreach ($product['shippingFields'] ?? [] as $field) {
        if (($customerData[$field] ?? '') === '') {
            throw new InvalidArgumentException('Informe o endereço completo para a entrega.');
        }
    }

    $phoneDigits = preg_replace('/\D/', '', $customerData['whatsapp'] ?? '');
    if (strlen($phoneDigits) !== 11) {
        throw new InvalidArgumentException('Informe um WhatsApp com DDD e nove dígitos.');
    }

    $email = $customerData['email'] ?? '';
    if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        throw new InvalidArgumentException('Informe um e-mail válido.');
    }
}

/**
 * @param array<string, string> $customerData
 */
function sendOrderToGoogleSheets(array $customerData): void
{
    $googleWebhook = $_ENV['GOOGLE_WEBHOOK_URL'] ?? '';

    if ($googleWebhook === '' || strpos($googleWebhook, 'script.google.com') === false) {
        return;
    }

    $request = curl_init($googleWebhook);
    if ($request === false) {
        error_log('Não foi possível iniciar o envio ao Google Sheets.');
        return;
    }

    curl_setopt($request, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($request, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($request, CURLOPT_SSL_VERIFYPEER, true);
    curl_setopt($request, CURLOPT_POSTFIELDS, json_encode($customerData, JSON_UNESCAPED_UNICODE));
    curl_setopt($request, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Accept: application/json',
    ]);
    curl_setopt($request, CURLOPT_TIMEOUT, 10);

    curl_exec($request);
    if (curl_errno($request)) {
        error_log('Erro cURL Google Sheets: ' . curl_error($request));
    }
    curl_close($request);
}

/**
 * @param array<string, string> $customerData
 * @param array<string, mixed> $product
 */
function createInfinitePayCheckout(array $customerData, array $product): string
{
    $phoneDigits = preg_replace('/\D/', '', $customerData['whatsapp']);
    $customer = [
        'name' => $customerData['nome'],
        'phone_number' => '+55' . $phoneDigits,
    ];

    if (($customerData['email'] ?? '') !== '') {
        $customer['email'] = $customerData['email'];
    }

    $baseUrl = getApplicationBaseUrl();
    $payload = [
        'handle' => 'raphael-feijo',
        'order_nsu' => $customerData['order_nsu'],
        'redirect_url' => $baseUrl . '/pages/sucesso/index.html',
        'webhook_url' => $baseUrl . '/api/webhook.php',
        'items' => [[
            'description' => $product['description'],
            'quantity' => 1,
            'price' => $product['priceCents'],
        ]],
        'customer' => $customer,
    ];

    if ($product['requiresShipping']) {
        $payload['address'] = [
            'cep' => preg_replace('/\D/', '', $customerData['cep']),
            'street' => $customerData['logradouro'],
            'neighborhood' => $customerData['bairro'],
            'number' => $customerData['numero'],
            'complement' => $customerData['complemento'] ?? '',
        ];
    }

    $request = curl_init('https://api.checkout.infinitepay.io/links');
    if ($request === false) {
        throw new RuntimeException('Não foi possível iniciar o checkout.');
    }

    curl_setopt($request, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($request, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE));
    curl_setopt($request, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($request, CURLOPT_TIMEOUT, 20);

    $response = curl_exec($request);
    $httpCode = (int) curl_getinfo($request, CURLINFO_HTTP_CODE);
    $curlError = curl_error($request);
    curl_close($request);

    if ($response === false || $httpCode >= 400) {
        error_log('InfinitePay falhou: ' . ($curlError ?: 'HTTP ' . $httpCode));
        throw new RuntimeException('Falha ao gerar o link de pagamento.');
    }

    $responseData = json_decode($response, true);
    $checkoutUrl = is_array($responseData)
        ? ($responseData['url'] ?? $responseData['link'] ?? $responseData['checkout_url'] ?? null)
        : null;

    if (!is_string($checkoutUrl) || $checkoutUrl === '') {
        throw new RuntimeException('A operadora não retornou um link de pagamento.');
    }

    return $checkoutUrl;
}

function getApplicationBaseUrl(): string
{
    $host = preg_replace('/[^a-zA-Z0-9.:-]/', '', $_SERVER['HTTP_HOST'] ?? '');
    if ($host === '') {
        throw new RuntimeException('Domínio da aplicação indisponível.');
    }

    return 'https://' . $host;
}

/**
 * @param array<string, mixed> $payload
 */
function respondWithJson(array $payload, int $statusCode = 200): never
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}
