<?php
declare(strict_types=1);

/**
 * Catálogo server-side. Preço e descrição usados no checkout nunca são
 * confiados ao navegador, evitando que alguém altere o valor da cobrança.
 *
 * As variáveis BOOK_* são opcionais enquanto a página estiver em preparação.
 * Sem BOOK_PRICE_CENTS positivo, o livro permanece indisponível para venda.
 *
 * @return array<string, array<string, mixed>>
 */
function getSalesProducts(): array
{
    $bookPriceCents = getPositiveIntegerEnvironmentValue('BOOK_PRICE_CENTS');

    return [
        'imersao' => [
            'id' => 'imersao',
            'orderPrefix' => 'imersao',
            'title' => '3ª Tarde de Imersão: A cura que vem da terra',
            'description' => '3ª Tarde de Imersão: A cura que vem da terra',
            'priceCents' => 24000,
            'requiredFields' => ['nome', 'email', 'whatsapp'],
            'requiresShipping' => false,
        ],
        'livro' => [
            'id' => 'livro',
            'orderPrefix' => 'livro',
            'title' => getEnvironmentString('BOOK_TITLE', 'Memórias de uma psicóloga em um relacionamento abusivo'),
            'description' => getEnvironmentString('BOOK_DESCRIPTION', 'Memórias de uma psicóloga em um relacionamento abusivo, de Eneida Feijó.'),
            'priceCents' => $bookPriceCents,
            'requiredFields' => ['nome', 'whatsapp', 'metodo_recebimento', 'observacao'],
            'shippingFields' => ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'uf', 'endereco_completo'],
            'requiresShipping' => true,
            'deliveryMethodField' => 'metodo_recebimento',
            'deliveryMethodShippingValue' => 'entrega',
            'allowedDeliveryMethods' => ['entrega', 'retirada_presencial'],
        ],
    ];
}

/**
 * @return array<string, mixed>|null
 */
function findSalesProduct(string $productId): ?array
{
    $products = getSalesProducts();
    return $products[$productId] ?? null;
}

/**
 * @param array<string, mixed> $product
 * @return array<string, mixed>
 */
function getPublicProductData(array $product): array
{
    $priceCents = (int) $product['priceCents'];
    $available = $priceCents > 0;

    return [
        'id' => $product['id'],
        'title' => $product['title'],
        'description' => $product['description'],
        'available' => $available,
        'priceLabel' => $available ? formatPriceInReais($priceCents) : null,
    ];
}

function getEnvironmentString(string $name, string $fallback): string
{
    $value = trim((string) ($_ENV[$name] ?? ''));
    return $value !== '' ? $value : $fallback;
}

function getPositiveIntegerEnvironmentValue(string $name): int
{
    $value = filter_var($_ENV[$name] ?? null, FILTER_VALIDATE_INT);
    return is_int($value) && $value > 0 ? $value : 0;
}

function formatPriceInReais(int $priceCents): string
{
    return 'R$ ' . number_format($priceCents / 100, 2, ',', '.');
}
