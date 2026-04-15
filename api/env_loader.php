<?php
function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        throw new Exception("O arquivo .env não foi encontrado.");
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Ignora comentários no .env
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Separa a chave do valor
        list($name, $value) = explode('=', $line, 2);
        
        $name = trim($name);
        $value = trim($value);

        // Remove aspas duplas ou simples se existirem em volta do valor
        $value = trim($value, '"\'');

        // Define a variável no ambiente
        if (!array_key_exists($name, $_SERVER) && !array_key_exists($name, $_ENV)) {
            putenv(sprintf('%s=%s', $name, $value));
            $_ENV[$name] = $value;
            $_SERVER[$name] = $value;
        }
    }
}
?>