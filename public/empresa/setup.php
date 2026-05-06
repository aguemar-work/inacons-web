<?php
// ============================================================
//  SETUP — Ejecutar UNA SOLA VEZ para crear la base de datos
//  Luego ELIMINA este archivo del servidor por seguridad
// ============================================================

// ── CONFIGURA ESTOS DATOS CON LOS DE TU CPANEL ──────────────
define('DB_HOST', 'localhost');
define('DB_NAME', 'ene06ind_qr');
define('DB_USER', 'ene06ind_qradmin');
define('DB_PASS', 'Inacons2026@$*');
// ─────────────────────────────────────────────────────────────

try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS qr_links (
            id          INT AUTO_INCREMENT PRIMARY KEY,
            codigo      VARCHAR(100) NOT NULL UNIQUE,
            url_destino TEXT NOT NULL,
            descripcion VARCHAR(255) DEFAULT '',
            activo      TINYINT(1) DEFAULT 1,
            creado_en   DATETIME DEFAULT CURRENT_TIMESTAMP,
            editado_en  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    echo '<div style="font-family:sans-serif;max-width:500px;margin:60px auto;padding:30px;background:#d4edda;border-radius:10px;border:1px solid #c3e6cb;">';
    echo '<h2 style="color:#155724;">✅ Base de datos creada correctamente</h2>';
    echo '<p style="color:#155724;">La tabla <strong>qr_links</strong> fue creada en <strong>' . DB_NAME . '</strong>.</p>';
    echo '<hr>';
    echo '<p style="color:#721c24;background:#f8d7da;padding:12px;border-radius:6px;"><strong>⚠️ IMPORTANTE:</strong> Elimina este archivo <code>setup.php</code> del servidor ahora mismo.</p>';
    echo '<a href="admin.php" style="display:inline-block;margin-top:10px;padding:10px 20px;background:#155724;color:white;text-decoration:none;border-radius:6px;">Ir al Panel Admin →</a>';
    echo '</div>';

} catch (PDOException $e) {
    echo '<div style="font-family:sans-serif;max-width:500px;margin:60px auto;padding:30px;background:#f8d7da;border-radius:10px;border:1px solid #f5c6cb;">';
    echo '<h2 style="color:#721c24;">❌ Error de conexión</h2>';
    echo '<p><strong>Mensaje:</strong> ' . htmlspecialchars($e->getMessage()) . '</p>';
    echo '<p>Verifica que los datos de DB_HOST, DB_NAME, DB_USER y DB_PASS sean correctos.</p>';
    echo '</div>';
}
?>