<?php
declare(strict_types=1);

/**
 * Static-host quote intake for 2240 Speed Shop (Hostinger PHP + mail()).
 * Next `output: export` copies public/ into out/, so this ships next to the HTML.
 *
 * Text fields always go out via mail() when the MTA accepts them. Photos are
 * attached as MIME parts AND saved under /quote-uploads/{ref}-{token}/ so a
 * host that strips attachments still leaves a path (and a clickable URL) in
 * the message body.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, no-cache, must-revalidate');
header('X-Content-Type-Options: nosniff');

const TO_EMAIL = '2240speedshop@gmail.com';
const FROM_EMAIL = 'noreply@2240speedshop.com';
const FROM_NAME = '2240 Speed Shop';
const MAX_PHOTOS = 12;
const MAX_BYTES_EACH = 6 * 1024 * 1024;
const MAX_BYTES_TOTAL = 18 * 1024 * 1024;
const UPLOAD_DIR = __DIR__ . '/quote-uploads';

function fail(string $message, int $code = 400): void
{
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function ok(array $extra): void
{
    http_response_code(200);
    echo json_encode(['ok' => true] + $extra, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function field(string $key, int $max = 2000): string
{
    $value = trim((string) ($_POST[$key] ?? ''));
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F]/u', '', $value) ?? $value;
    if (strlen($value) > $max) {
        $value = substr($value, 0, $max);
    }
    return $value;
}

function header_safe(string $value): string
{
    return str_replace(["\r", "\n", "\0"], '', $value);
}

function sniff_image(string $path): ?array
{
    $handle = fopen($path, 'rb');
    if ($handle === false) {
        return null;
    }
    $head = fread($handle, 16);
    fclose($handle);
    if (!is_string($head) || strlen($head) < 12) {
        return null;
    }
    if (strncmp($head, "\xFF\xD8\xFF", 3) === 0) {
        return ['ext' => 'jpg', 'mime' => 'image/jpeg'];
    }
    if (strncmp($head, "\x89PNG\r\n\x1A\n", 8) === 0) {
        return ['ext' => 'png', 'mime' => 'image/png'];
    }
    if (strncmp($head, 'GIF8', 4) === 0) {
        return ['ext' => 'gif', 'mime' => 'image/gif'];
    }
    if (strncmp($head, 'RIFF', 4) === 0 && substr($head, 8, 4) === 'WEBP') {
        return ['ext' => 'webp', 'mime' => 'image/webp'];
    }
    if (substr($head, 4, 4) === 'ftyp') {
        $brand = strtolower(substr($head, 8, 4));
        if (in_array($brand, ['heic', 'heif', 'mif1', 'msf1', 'heix', 'hevc'], true)) {
            return ['ext' => 'heic', 'mime' => 'image/heic'];
        }
    }
    return null;
}

function safe_filename(string $original, string $ext, int $index): string
{
    $base = pathinfo($original, PATHINFO_FILENAME);
    // Only the verified image extension may contain a dot. Apache can treat
    // an earlier extension (such as .php.jpg) as a handler on some hosts.
    $base = preg_replace('/[^A-Za-z0-9_-]+/', '-', $base) ?? 'photo';
    $base = trim($base, '.-');
    if ($base === '') {
        $base = 'photo';
    }
    if (strlen($base) > 60) {
        $base = substr($base, 0, 60);
    }
    return sprintf('%02d-%s.%s', $index + 1, $base, $ext);
}

function public_base(): string
{
    $host = header_safe((string) ($_SERVER['HTTP_HOST'] ?? '2240speedshop.com'));
    if (!in_array(strtolower($host), ['2240speedshop.com', 'www.2240speedshop.com', 'steelblue-gaur-917651.hostingersite.com'], true)) {
        $host = '2240speedshop.com';
    }
    return 'https://' . $host;
}

function ensure_upload_root(): void
{
    if (!is_dir(UPLOAD_DIR) && !mkdir(UPLOAD_DIR, 0755, true) && !is_dir(UPLOAD_DIR)) {
        fail('The shop could not file this sheet. Call 780-999-6450.', 500);
    }
    $htaccess = UPLOAD_DIR . '/.htaccess';
    if (!is_file($htaccess)) {
        // The deployment includes this access-control file. Fail closed if
        // it is missing rather than saving private customer sheets publicly.
        fail('The shop could not file this sheet. Call 780-999-6450.', 503);
    }
}

function collect_photos(): array
{
    if (empty($_FILES['photos'])) {
        return [];
    }
    $bag = $_FILES['photos'];
    if (!is_array($bag)) {
        fail('The photos could not be read. Please select them again.');
    }
    $names = $bag['name'] ?? [];
    $tmps = $bag['tmp_name'] ?? [];
    $errors = $bag['error'] ?? [];
    $sizes = $bag['size'] ?? [];
    if (!is_array($names)) {
        $names = [$names];
        $tmps = [$tmps];
        $errors = [$errors];
        $sizes = [$sizes];
    }
    if (!is_array($tmps) || !is_array($errors) || !is_array($sizes)) {
        fail('The photos could not be read. Please select them again.');
    }
    if (count($names) > MAX_PHOTOS) {
        fail('Choose up to 12 photos. No sheet has been sent yet.', 413);
    }

    $out = [];
    $total = 0;
    foreach ($names as $i => $original) {
        if (!is_string($original) || !is_string($tmps[$i] ?? null)
            || !is_int($errors[$i] ?? null) || !is_int($sizes[$i] ?? null)) {
            fail('The photos could not be read. Please select them again.');
        }
        $error = (int) ($errors[$i] ?? UPLOAD_ERR_NO_FILE);
        if ($error === UPLOAD_ERR_NO_FILE && $original === '') {
            continue;
        }
        if ($error === UPLOAD_ERR_INI_SIZE || $error === UPLOAD_ERR_FORM_SIZE) {
            fail('A photo exceeds the upload limit. Choose photos under 6 MB each, or text them to 780-999-6450. No sheet has been sent yet.', 413);
        }
        if ($error !== UPLOAD_ERR_OK) {
            fail('A photo did not finish uploading. Please try again. No sheet has been sent yet.');
        }
        $tmp = (string) ($tmps[$i] ?? '');
        $size = (int) ($sizes[$i] ?? 0);
        if ($tmp === '' || !is_uploaded_file($tmp) || $size <= 0) {
            fail('A photo could not be read. Please select it again. No sheet has been sent yet.');
        }
        if ($size > MAX_BYTES_EACH) {
            fail('Each photo must be 6 MB or smaller. No sheet has been sent yet.', 413);
        }
        if ($total + $size > MAX_BYTES_TOTAL) {
            fail('Keep the photos under 18 MB combined. No sheet has been sent yet.', 413);
        }
        $kind = sniff_image($tmp);
        if ($kind === null) {
            fail('Use JPEG, PNG, WebP, GIF, or HEIC/HEIF photos. One selected file is not supported. No sheet has been sent yet.');
        }
        $bytes = file_get_contents($tmp);
        if (!is_string($bytes) || strlen($bytes) !== $size) {
            fail('A photo could not be read completely. Please try again. No sheet has been sent yet.');
        }
        $out[] = [
            'original' => (string) $original,
            'bytes' => $bytes,
            'size' => $size,
            'ext' => $kind['ext'],
            'mime' => $kind['mime'],
        ];
        $total += $size;
    }
    return $out;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail('Send the sheet as a POST.', 405);
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 0 && empty($_POST) && empty($_FILES)) {
    fail('The sheet was too large to file. Send fewer or smaller photos, or text them to 780-999-6450.', 413);
}

if (field('website', 200) !== '') {
    ok(['reference' => 'Q-SKIP', 'photosReceived' => 0, 'photosStored' => 0, 'photosAttached' => 0]);
}

$name = field('name', 120);
if ($name === '') {
    fail('A name to put on the sheet.');
}

$reference = field('reference', 32);
if (!preg_match('/^Q-[A-Z0-9]{4,12}$/', $reference)) {
    $reference = 'Q-' . strtoupper(substr(base_convert((string) time(), 10, 36), -6));
}

$serviceTitle = field('serviceTitle', 80);
$service = field('service', 80);
$year = field('year', 8);
$make = field('make', 80);
$model = field('model', 80);
$condition = field('condition', 80);
$scope = field('scope', 80);
$budget = field('budget', 80);
$timeline = field('timeline', 80);
$notes = field('notes', 4000);
$phone = field('phone', 40);
$emailRaw = field('email', 160);
$email = filter_var($emailRaw, FILTER_VALIDATE_EMAIL) ? $emailRaw : '';
$method = field('method', 20);
$town = field('town', 80);

$work = $serviceTitle !== '' ? $serviceTitle : $service;
$vehicle = trim($year . ' ' . $make . ' ' . $model);

$photos = collect_photos();
// PHP can truncate uploads before this script runs (max_file_uploads). The
// browser's count lets us catch that instead of accepting a partial selection.
$expectedPhotos = $_POST['photoCount'] ?? null;
if ($expectedPhotos !== null && (!is_string($expectedPhotos)
    || !preg_match('/^(?:[0-9]|1[0-2])$/', $expectedPhotos)
    || (int) $expectedPhotos !== count($photos))) {
    fail('Some photos did not reach the shop. Please select fewer photos and try again. No sheet has been sent yet.');
}
$stored = [];
$token = bin2hex(random_bytes(12));
$slot = $reference . '-' . $token;
$slotDir = UPLOAD_DIR . '/' . $slot;

ensure_upload_root();

if ($photos !== []) {
    if (!mkdir($slotDir, 0755, true) && !is_dir($slotDir)) {
        fail('The shop could not file this sheet. Call 780-999-6450.', 500);
    }
    foreach ($photos as $i => $photo) {
        $filename = safe_filename($photo['original'], $photo['ext'], $i);
        $path = $slotDir . '/' . $filename;
        if (@file_put_contents($path, $photo['bytes']) !== $photo['size']) {
            // Remove only this request's known paths on a failed write.
            @unlink($path);
            foreach ($stored as $saved) {
                @unlink($slotDir . '/' . $saved['name']);
            }
            @rmdir($slotDir);
            fail('The shop could not save every photo. No sheet has been sent yet. Please try again or call 780-999-6450.', 500);
        }
        $stored[] = [
            'name' => $filename,
            'original' => $photo['original'],
            'size' => $photo['size'],
            'mime' => $photo['mime'],
            'bytes' => $photo['bytes'],
            'url' => public_base() . '/quote-uploads/' . rawurlencode($slot) . '/' . rawurlencode($filename),
        ];
    }
}

$lines = [
    'New quote request  ' . $reference,
    str_repeat('=', 42),
    '',
    'Work: ' . ($work !== '' ? $work : 'Not sure yet'),
    'Vehicle: ' . ($vehicle !== '' ? $vehicle : '(not given)'),
    'Where it sits: ' . ($condition !== '' ? $condition : '(not given)'),
    'Scope: ' . ($scope !== '' ? $scope : '(not given)'),
    'Budget band: ' . ($budget !== '' ? $budget : '(not given)'),
    'Timeline: ' . ($timeline !== '' ? $timeline : '(no preference)'),
    '',
    'Name: ' . $name,
    'Phone: ' . ($phone !== '' ? $phone : '(not given)'),
    'Email: ' . ($email !== '' ? $email : '(not given)'),
    'Town: ' . ($town !== '' ? $town : '(not given)'),
    'Best way to reach me: ' . ($method !== '' ? $method : '(not given)'),
    '',
];
if ($notes !== '') {
    $lines[] = 'Notes:';
    $lines[] = $notes;
    $lines[] = '';
}

if ($stored === []) {
    if ($photos === []) {
        $lines[] = 'Photos: none attached.';
    } else {
        $lines[] = 'Photos: the browser sent files but none could be stored (type or size). Ask the customer to text them to 780-999-6450.';
    }
} else {
    $lines[] = 'Photos: ' . count($stored) . ' filed. Attached to this message when the host allows it.';
    $lines[] = 'If the files are missing as attachments, they are on the server at quote-uploads/' . $slot . '/';
    $lines[] = '';
    foreach ($stored as $item) {
        $kb = max(1, (int) round($item['size'] / 1024));
        $lines[] = '  - ' . $item['original'] . '  (' . $kb . ' KB)';
        $lines[] = '    ' . $item['url'];
    }
}

$sheet = implode("\n", $lines) . "\n";
$sheetDir = $photos !== [] ? $slotDir : (UPLOAD_DIR . '/' . $slot);
if (!is_dir($sheetDir) && !mkdir($sheetDir, 0755, true) && !is_dir($sheetDir)) {
    fail('The shop could not file this sheet. Call 780-999-6450.', 500);
}
if (@file_put_contents($sheetDir . '/sheet.txt', $sheet) !== strlen($sheet)) {
    fail('The shop could not file this sheet. Please try again or call 780-999-6450.', 500);
}

$subjectPlain = 'Quote request ' . $reference . ($vehicle !== '' ? ' — ' . $vehicle : '');
$subject = '=?UTF-8?B?' . base64_encode($subjectPlain) . '?=';
$replyTo = $email !== '' ? $email : TO_EMAIL;
$boundary = '=_2240_' . bin2hex(random_bytes(12));

$headers = [
    'MIME-Version: 1.0',
    'From: ' . header_safe(FROM_NAME) . ' <' . FROM_EMAIL . '>',
    'Reply-To: ' . header_safe($replyTo),
    'To: ' . TO_EMAIL,
    'X-Quote-Reference: ' . header_safe($reference),
    'X-Mailer: 2240-quote-form',
    'Content-Type: multipart/mixed; boundary="' . $boundary . '"',
];

$body = '--' . $boundary . "\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= $sheet . "\r\n";

$attached = 0;
$attachBudget = 7 * 1024 * 1024;
$attachedBytes = 0;
foreach ($stored as $item) {
    if ($attachedBytes + (int) $item['size'] > $attachBudget) {
        continue;
    }
    $filename = header_safe($item['name']);
    $body .= '--' . $boundary . "\r\n";
    $body .= 'Content-Type: ' . $item['mime'] . '; name="' . $filename . "\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= 'Content-Disposition: attachment; filename="' . $filename . "\"\r\n\r\n";
    $body .= chunk_split(base64_encode($item['bytes'])) . "\r\n";
    $attached++;
    $attachedBytes += (int) $item['size'];
}
$body .= '--' . $boundary . "--\r\n";

@ini_set('sendmail_from', FROM_EMAIL);
$sent = @mail(
    TO_EMAIL,
    $subject,
    $body,
    implode("\r\n", $headers),
    '-f' . FROM_EMAIL
);

if ($sent !== true) {
    fail('The shop did not receive this sheet. Call 780-999-6450 or try again.', 502);
}

ok([
    'reference' => $reference,
    'photosReceived' => count($photos),
    'photosStored' => count($stored),
    'photosAttached' => $attached,
]);
