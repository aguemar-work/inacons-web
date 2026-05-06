<?php
// ============================================================
//  PANEL ADMIN — Gestión de QR dinámicos
// ============================================================

// ── CONFIGURACIÓN ────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_NAME', 'ene06ind_qr');
define('DB_USER', 'ene06ind_qradmin');
define('DB_PASS', 'Inacons2026@$*');

// Contraseña del panel (cámbiala)
define('ADMIN_PASS', 'inacons2025');

// URL base de tu sitio (con /empresa/ al final)
define('BASE_URL', 'https://inacons.com.pe/empresa/');
// ─────────────────────────────────────────────────────────────

session_start();

// ── AUTENTICACIÓN ─────────────────────────────────────────────
if ($_POST['action'] ?? '' === 'login') {
    if ($_POST['password'] === ADMIN_PASS) {
        $_SESSION['admin_ok'] = true;
    } else {
        $login_error = 'Contraseña incorrecta.';
    }
}
if ($_POST['action'] ?? '' === 'logout') {
    session_destroy();
    header('Location: admin.php');
    exit;
}

// Pantalla de login
if (empty($_SESSION['admin_ok'])) { ?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Admin QR — INACONS</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', sans-serif; background: #f0f4f8; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
  .card { background: white; border-radius: 12px; padding: 40px; width: 360px; box-shadow: 0 4px 20px rgba(0,0,0,.1); }
  .logo { text-align: center; margin-bottom: 28px; }
  .logo h1 { font-size: 22px; color: #1a3a5c; }
  .logo p { color: #888; font-size: 13px; margin-top: 4px; }
  label { display: block; font-size: 13px; font-weight: 600; color: #555; margin-bottom: 6px; }
  input[type=password] { width: 100%; padding: 10px 14px; border: 1.5px solid #ddd; border-radius: 8px; font-size: 15px; outline: none; }
  input[type=password]:focus { border-color: #1a3a5c; }
  button { width: 100%; padding: 12px; background: #1a3a5c; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 16px; }
  button:hover { background: #244f7a; }
  .error { background: #fff0f0; color: #c0392b; padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 16px; }
</style>
</head>
<body>
<div class="card">
  <div class="logo">
    <h1>🔒 Panel QR</h1>
    <p>INACONS — Gestión de QR dinámicos</p>
  </div>
  <?php if (!empty($login_error)) echo '<div class="error">' . $login_error . '</div>'; ?>
  <form method="POST">
    <input type="hidden" name="action" value="login">
    <label>Contraseña</label>
    <input type="password" name="password" autofocus placeholder="••••••••">
    <button type="submit">Ingresar</button>
  </form>
</div>
</body>
</html>
<?php exit; }

// ── CONEXIÓN DB ───────────────────────────────────────────────
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('<p style="font-family:sans-serif;color:red;padding:40px;">Error de BD: ' . htmlspecialchars($e->getMessage()) . '</p>');
}

// ── ACCIONES CRUD ─────────────────────────────────────────────
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'crear' || $action === 'editar') {
        $codigo = preg_replace('/[^a-zA-Z0-9\-_]/', '', trim($_POST['codigo'] ?? ''));
        $url    = trim($_POST['url_destino'] ?? '');
        $desc   = trim($_POST['descripcion'] ?? '');

        if ($codigo && $url) {
            if ($action === 'crear') {
                $stmt = $pdo->prepare("INSERT INTO qr_links (codigo, url_destino, descripcion) VALUES (:c, :u, :d)");
                $stmt->execute([':c' => $codigo, ':u' => $url, ':d' => $desc]);
                $msg = "✅ QR <strong>$codigo</strong> creado correctamente.";
            } else {
                $id = (int)($_POST['id'] ?? 0);
                $stmt = $pdo->prepare("UPDATE qr_links SET url_destino=:u, descripcion=:d WHERE id=:id");
                $stmt->execute([':u' => $url, ':d' => $desc, ':id' => $id]);
                $msg = "✅ QR actualizado correctamente.";
            }
        } else {
            $msg = "❌ El código y la URL son obligatorios.";
        }
    }

    if ($action === 'toggle') {
        $id = (int)($_POST['id'] ?? 0);
        $pdo->prepare("UPDATE qr_links SET activo = 1 - activo WHERE id = :id")->execute([':id' => $id]);
    }

    if ($action === 'eliminar') {
        $id = (int)($_POST['id'] ?? 0);
        $pdo->prepare("DELETE FROM qr_links WHERE id = :id")->execute([':id' => $id]);
        $msg = "🗑️ QR eliminado.";
    }
}

// ── LISTAR ────────────────────────────────────────────────────
$links = $pdo->query("SELECT * FROM qr_links ORDER BY creado_en DESC")->fetchAll(PDO::FETCH_ASSOC);

// QR a mostrar (para ver el QR generado)
$ver_qr = $_GET['qr'] ?? '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Panel QR — INACONS</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', sans-serif; background: #f0f4f8; color: #333; }

header { background: #1a3a5c; color: white; padding: 14px 28px; display: flex; align-items: center; justify-content: space-between; }
header h1 { font-size: 18px; font-weight: 700; }
header form button { background: rgba(255,255,255,.15); color: white; border: none; padding: 7px 14px; border-radius: 6px; cursor: pointer; font-size: 13px; }
header form button:hover { background: rgba(255,255,255,.25); }

.container { max-width: 1100px; margin: 0 auto; padding: 28px 20px; }

/* MENSAJE */
.msg { padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; background: #e8f5e9; border: 1px solid #a5d6a7; font-size: 14px; }

/* FORMULARIO NUEVO */
.card { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,.07); margin-bottom: 28px; }
.card h2 { font-size: 16px; color: #1a3a5c; margin-bottom: 18px; padding-bottom: 10px; border-bottom: 2px solid #e8edf2; }
.form-grid { display: grid; grid-template-columns: 1fr 2fr 2fr auto; gap: 12px; align-items: end; }
label { display: block; font-size: 12px; font-weight: 600; color: #666; margin-bottom: 5px; text-transform: uppercase; letter-spacing: .4px; }
input[type=text], input[type=url] { width: 100%; padding: 9px 12px; border: 1.5px solid #ddd; border-radius: 7px; font-size: 14px; outline: none; }
input:focus { border-color: #1a3a5c; }
.prefix { font-size: 11px; color: #999; margin-top: 4px; }
.btn { padding: 10px 20px; border: none; border-radius: 7px; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; }
.btn-primary { background: #1a3a5c; color: white; }
.btn-primary:hover { background: #244f7a; }
.btn-danger { background: #e74c3c; color: white; }
.btn-success { background: #27ae60; color: white; }
.btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 5px; }
.btn-outline { background: transparent; border: 1.5px solid #1a3a5c; color: #1a3a5c; }
.btn-outline:hover { background: #1a3a5c; color: white; }

/* TABLA */
table { width: 100%; border-collapse: collapse; font-size: 14px; }
th { text-align: left; padding: 10px 14px; background: #f7f9fb; border-bottom: 2px solid #e0e7ef; font-size: 12px; text-transform: uppercase; letter-spacing: .4px; color: #888; }
td { padding: 12px 14px; border-bottom: 1px solid #f0f0f0; vertical-align: middle; }
tr:hover td { background: #fafbfc; }
.codigo { font-family: monospace; font-weight: 700; color: #1a3a5c; font-size: 15px; }
.url-dest { color: #555; font-size: 13px; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.badge-on { background: #e8f5e9; color: #2e7d32; }
.badge-off { background: #fce4ec; color: #c62828; }
.actions { display: flex; gap: 6px; flex-wrap: wrap; }
.fecha { font-size: 12px; color: #aaa; }

/* MODAL QR */
.modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.5); z-index: 100; align-items: center; justify-content: center; }
.modal-overlay.open { display: flex; }
.modal { background: white; border-radius: 14px; padding: 32px; text-align: center; min-width: 320px; box-shadow: 0 8px 40px rgba(0,0,0,.2); }
.modal h3 { font-size: 18px; color: #1a3a5c; margin-bottom: 6px; }
.modal .qr-url { font-size: 12px; color: #999; margin-bottom: 20px; word-break: break-all; }
#qrcode { display: flex; justify-content: center; margin-bottom: 20px; }
.modal-actions { display: flex; gap: 10px; justify-content: center; }

@media(max-width: 700px) {
  .form-grid { grid-template-columns: 1fr; }
  table { font-size: 13px; }
  .actions { flex-direction: column; }
}
</style>
</head>
<body>

<header>
  <h1>📱 Panel QR Dinámico — INACONS</h1>
  <form method="POST"><input type="hidden" name="action" value="logout"><button type="submit">Cerrar sesión</button></form>
</header>

<div class="container">

<?php if ($msg): ?>
<div class="msg"><?= $msg ?></div>
<?php endif; ?>

<!-- FORMULARIO CREAR -->
<div class="card">
  <h2>➕ Crear nuevo QR</h2>
  <form method="POST">
    <input type="hidden" name="action" value="crear">
    <div class="form-grid">
      <div>
        <label>Código *</label>
        <input type="text" name="codigo" placeholder="brochure-2025" pattern="[a-zA-Z0-9\-_]+" required>
        <div class="prefix">/empresa/<strong>codigo</strong></div>
      </div>
      <div>
        <label>URL de destino *</label>
        <input type="url" name="url_destino" placeholder="https://drive.google.com/..." required>
      </div>
      <div>
        <label>Descripción (opcional)</label>
        <input type="text" name="descripcion" placeholder="Brochure institucional">
      </div>
      <div>
        <button type="submit" class="btn btn-primary">Crear QR</button>
      </div>
    </div>
  </form>
</div>

<!-- TABLA -->
<div class="card">
  <h2>📋 QRs registrados (<?= count($links) ?>)</h2>
  <?php if (empty($links)): ?>
    <p style="color:#aaa;text-align:center;padding:30px;">Aún no hay QRs creados. ¡Crea el primero!</p>
  <?php else: ?>
  <table>
    <thead>
      <tr>
        <th>Código</th>
        <th>URL Destino</th>
        <th>Descripción</th>
        <th>Estado</th>
        <th>Creado</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
    <?php foreach ($links as $row): ?>
    <tr>
      <td class="codigo">
        <a href="<?= BASE_URL ?>?c=<?= htmlspecialchars($row['codigo']) ?>" target="_blank" style="color:#1a3a5c;text-decoration:none;">
          <?= htmlspecialchars($row['codigo']) ?> ↗
        </a>
      </td>
      <td><div class="url-dest" title="<?= htmlspecialchars($row['url_destino']) ?>"><?= htmlspecialchars($row['url_destino']) ?></div></td>
      <td style="font-size:13px;color:#666;"><?= htmlspecialchars($row['descripcion']) ?></td>
      <td><span class="badge <?= $row['activo'] ? 'badge-on' : 'badge-off' ?>"><?= $row['activo'] ? 'Activo' : 'Pausado' ?></span></td>
      <td class="fecha"><?= date('d/m/Y', strtotime($row['creado_en'])) ?></td>
      <td>
        <div class="actions">
          <!-- Ver QR -->
          <button class="btn btn-success btn-sm"
            onclick="mostrarQR('<?= htmlspecialchars($row['codigo']) ?>', '<?= BASE_URL ?>?c=<?= htmlspecialchars($row['codigo']) ?>')">
            Ver QR
          </button>
          <!-- Editar -->
          <button class="btn btn-outline btn-sm"
            onclick="abrirEditar(<?= $row['id'] ?>, '<?= htmlspecialchars(addslashes($row['codigo'])) ?>', '<?= htmlspecialchars(addslashes($row['url_destino'])) ?>', '<?= htmlspecialchars(addslashes($row['descripcion'])) ?>')">
            Editar URL
          </button>
          <!-- Pausar/Activar -->
          <form method="POST" style="display:inline;">
            <input type="hidden" name="action" value="toggle">
            <input type="hidden" name="id" value="<?= $row['id'] ?>">
            <button type="submit" class="btn btn-sm" style="background:#f39c12;color:white;">
              <?= $row['activo'] ? 'Pausar' : 'Activar' ?>
            </button>
          </form>
          <!-- Eliminar -->
          <form method="POST" style="display:inline;" onsubmit="return confirm('¿Eliminar este QR?')">
            <input type="hidden" name="action" value="eliminar">
            <input type="hidden" name="id" value="<?= $row['id'] ?>">
            <button type="submit" class="btn btn-danger btn-sm">Eliminar</button>
          </form>
        </div>
      </td>
    </tr>
    <?php endforeach; ?>
    </tbody>
  </table>
  <?php endif; ?>
</div>

</div><!-- /container -->

<!-- MODAL VER QR -->
<div class="modal-overlay" id="modalQR">
  <div class="modal">
    <h3 id="qr-titulo">QR: codigo</h3>
    <div class="qr-url" id="qr-url-texto"></div>
    <div id="qrcode"></div>
    <div class="modal-actions">
      <button class="btn btn-primary" onclick="descargarQR()">⬇ Descargar PNG</button>
      <button class="btn btn-outline" onclick="cerrarModal()">Cerrar</button>
    </div>
  </div>
</div>

<!-- MODAL EDITAR -->
<div class="modal-overlay" id="modalEditar">
  <div class="modal" style="min-width:420px;text-align:left;">
    <h3 style="margin-bottom:18px;">✏️ Editar URL de destino</h3>
    <form method="POST">
      <input type="hidden" name="action" value="editar">
      <input type="hidden" name="id" id="edit_id">
      <input type="hidden" name="codigo" id="edit_codigo_hidden">
      <div style="margin-bottom:14px;">
        <label>Código</label>
        <input type="text" id="edit_codigo_display" disabled style="background:#f5f5f5;width:100%;padding:9px 12px;border:1.5px solid #ddd;border-radius:7px;font-size:14px;">
      </div>
      <div style="margin-bottom:14px;">
        <label>Nueva URL de destino *</label>
        <input type="url" name="url_destino" id="edit_url" required style="width:100%;padding:9px 12px;border:1.5px solid #ddd;border-radius:7px;font-size:14px;">
      </div>
      <div style="margin-bottom:18px;">
        <label>Descripción</label>
        <input type="text" name="descripcion" id="edit_desc" style="width:100%;padding:9px 12px;border:1.5px solid #ddd;border-radius:7px;font-size:14px;">
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button type="button" class="btn btn-outline" onclick="document.getElementById('modalEditar').classList.remove('open')">Cancelar</button>
        <button type="submit" class="btn btn-primary">Guardar cambios</button>
      </div>
    </form>
  </div>
</div>

<script>
let qrInstance = null;

function mostrarQR(codigo, url) {
  document.getElementById('qr-titulo').textContent = 'QR: ' + codigo;
  document.getElementById('qr-url-texto').textContent = url;
  const cont = document.getElementById('qrcode');
  cont.innerHTML = '';
  qrInstance = new QRCode(cont, {
    text: url,
    width: 220,
    height: 220,
    colorDark: '#1a3a5c',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
  document.getElementById('modalQR').classList.add('open');
}

function cerrarModal() {
  document.getElementById('modalQR').classList.remove('open');
}

function descargarQR() {
  setTimeout(() => {
    const canvas = document.querySelector('#qrcode canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'qr-' + document.getElementById('qr-titulo').textContent.replace('QR: ', '') + '.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }, 100);
}

function abrirEditar(id, codigo, url, desc) {
  document.getElementById('edit_id').value = id;
  document.getElementById('edit_codigo_display').value = codigo;
  document.getElementById('edit_codigo_hidden').value = codigo;
  document.getElementById('edit_url').value = url;
  document.getElementById('edit_desc').value = desc;
  document.getElementById('modalEditar').classList.add('open');
}

// Cerrar modales al hacer click fuera
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });
});
</script>

</body>
</html>