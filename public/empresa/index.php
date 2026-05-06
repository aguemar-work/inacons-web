<?php
// ============================================================
//  MOTOR DE REDIRECCIÓN — inacons.com.pe/empresa/CODIGO
// ============================================================

// ── MISMA CONFIGURACIÓN QUE setup.php ───────────────────────
define('DB_HOST', 'localhost');
define('DB_NAME', 'ene06ind_qr');
define('DB_USER', 'ene06ind_qradmin');
define('DB_PASS', 'Inacons2026@$*');
// ─────────────────────────────────────────────────────────────

// Leer el código de la URL: /empresa/mi-codigo
$codigo = trim($_GET['c'] ?? '');

// Si no hay código, redirigir al home
if ($codigo === '') {
    header('Location: https://inacons.com.pe');
    exit;
}

// Limpiar el código (solo letras, números, guiones)
$codigo = preg_replace('/[^a-zA-Z0-9\-_]/', '', $codigo);

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT url_destino FROM qr_links WHERE codigo = :codigo AND activo = 1 LIMIT 1");
    $stmt->execute([':codigo' => $codigo]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        // Redirección 301 (permanente) al destino
        header('Location: ' . $row['url_destino'], true, 301);
        exit;
    } else {
        // Código no encontrado
        header('HTTP/1.0 404 Not Found');
        echo '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Enlace no encontrado</title>
        <style>body{font-family:sans-serif;text-align:center;padding:80px 20px;color:#333;}
        h1{color:#c0392b;}a{color:#2980b9;}</style></head>
        <body><h1>404 — Enlace no encontrado</h1>
        <p>El código <strong>' . htmlspecialchars($codigo) . '</strong> no existe o fue desactivado.</p>
        <a href="https://inacons.com.pe">← Volver al inicio</a></body></html>';
        exit;
    }

} catch (PDOException $e) {
    header('HTTP/1.0 500 Internal Server Error');
    echo 'Error interno. Contacta al administrador.';
    exit;
}
?>