<?php
header('Content-Type: application/json');

$event = $_GET['event'] ?? '';

if (empty($event)) {
    http_response_code(400);
    echo json_encode(['error' => 'Parâmetro "event" não fornecido.']);
    exit;
}

// Sanitize the event name to prevent directory traversal attacks
$event = basename($event);
$baseDir = '../assets/images/eventos/';
$eventDir = $baseDir . $event;

if (!is_dir($eventDir)) {
    http_response_code(404);
    echo json_encode(['error' => 'Evento não encontrado.']);
    exit;
}

// --- Nova Lógica de Miniatura Genérica ---
// 1. Procurar por uma miniatura genérica para o evento.
$genericVideoThumb = null;
$possibleThumbNames = ['thumbnail.jpg', 'thumbnail.png', 'cover.jpg', 'cover.png'];

foreach ($possibleThumbNames as $thumbName) {
    if (file_exists($eventDir . '/' . $thumbName)) {
        $genericVideoThumb = '/assets/images/eventos/' . $event . '/' . rawurlencode($thumbName);
        break; // Para ao encontrar a primeira opção
    }
}

// 2. Se não encontrar, usar o placeholder global.
if (!$genericVideoThumb) {
    $genericVideoThumb = '/assets/images/ui/video-placeholder.png';
}
// --- Fim da Nova Lógica ---

$files = scandir($eventDir);
$media = [];
$imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
$videoExtensions = ['mp4', 'webm', 'ogg'];

foreach ($files as $file) {
    if ($file === '.' || $file === '..') {
        continue;
    }

    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    $url = '/assets/images/eventos/' . $event . '/' . rawurlencode($file);

    // Ignora os próprios arquivos de miniatura da listagem principal
    if (in_array(strtolower($file), $possibleThumbNames)) {
        continue;
    }

    if (in_array($extension, $imageExtensions)) {
        $media[] = [
            'type' => 'image',
            'url' => $url,
            'thumbnail' => $url
        ];
    } elseif (in_array($extension, $videoExtensions)) {
        $media[] = [
            'type' => 'video',
            'url' => $url,
            'thumbnail' => $genericVideoThumb // 3. Usar a miniatura encontrada para todos os vídeos
        ];
    }
}

echo json_encode($media);
?>