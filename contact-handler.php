<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

const DEFAULT_RECIPIENT = 'admin@whitehavenkulliye.org';

function finish(string $page, string $status): void
{
    $anchor = $page === 'volunteer.html' ? 'volunteer-form' : 'contact-form';
    header('Location: ' . $page . '?status=' . rawurlencode($status) . '#' . $anchor, true, 303);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    finish('contact.html', 'invalid');
}

$formType = ($_POST['form_type'] ?? '') === 'volunteer' ? 'volunteer' : 'contact';
$returnPage = $formType === 'volunteer' ? 'volunteer.html' : 'contact.html';

// Silently accept automated submissions that fill the hidden honeypot field.
if (trim((string)($_POST['website'] ?? '')) !== '') {
    finish($returnPage, 'sent');
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || strlen($name) > 120 || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 || strlen($phone) > 40 || strlen($message) > 4000) {
    finish($returnPage, 'invalid');
}

$contactTopics = ['Plan a visit', 'Public agency or funding partnership', 'Program partnership', 'Microgrant Program', 'Prayer information', 'Food pantry', 'Farmers market', 'Volunteer', 'Other'];
$volunteerInterests = ['Food pantry', 'The Suq', 'Events', 'Education or media', 'Campus projects', 'Wherever needed'];

if ($formType === 'volunteer') {
    $selection = trim((string)($_POST['interest'] ?? 'Wherever needed'));
    if (!in_array($selection, $volunteerInterests, true)) {
        $selection = 'Wherever needed';
    }
    $subject = 'Website volunteer interest: ' . $selection;
    $formLabel = 'Volunteer interest';
} else {
    if (strlen($message) < 10) {
        finish($returnPage, 'invalid');
    }
    $selection = trim((string)($_POST['topic'] ?? 'Other'));
    if (!in_array($selection, $contactTopics, true)) {
        $selection = 'Other';
    }
    $subject = 'Website contact: ' . $selection;
    $formLabel = 'General contact';
}

$cleanName = preg_replace('/[\r\n]+/', ' ', $name) ?? $name;
$cleanEmail = preg_replace('/[\r\n]+/', '', $email) ?? $email;
$cleanPhone = preg_replace('/[\r\n]+/', ' ', $phone) ?? $phone;
$ip = filter_var($_SERVER['REMOTE_ADDR'] ?? '', FILTER_VALIDATE_IP) ?: 'Not available';

$body = implode("\r\n", [
    'New submission from whitehavenkulliye.org',
    '',
    'Form: ' . $formLabel,
    'Name: ' . $cleanName,
    'Email: ' . $cleanEmail,
    'Phone: ' . ($cleanPhone !== '' ? $cleanPhone : 'Not provided'),
    'Topic / interest: ' . $selection,
    'Submitted from IP: ' . $ip,
    '',
    'Message:',
    $message !== '' ? $message : 'No additional message provided.',
]);

$autoloadPath = __DIR__ . '/vendor/autoload.php';
$manualLibraryPath = __DIR__ . '/PHPMailer/src';
$localConfigPath = __DIR__ . '/.smtp-config.php';
$privateConfigPath = dirname(__DIR__) . '/.smtp-config.php';
$configPath = file_exists($privateConfigPath) ? $privateConfigPath : $localConfigPath;

if (!file_exists($configPath)) {
    error_log('MDA contact form: PHPMailer or SMTP configuration is missing.');
    finish($returnPage, 'setup');
}

if (file_exists($autoloadPath)) {
    require $autoloadPath;
} elseif (file_exists($manualLibraryPath . '/PHPMailer.php') && file_exists($manualLibraryPath . '/SMTP.php') && file_exists($manualLibraryPath . '/Exception.php')) {
    require $manualLibraryPath . '/Exception.php';
    require $manualLibraryPath . '/PHPMailer.php';
    require $manualLibraryPath . '/SMTP.php';
} else {
    error_log('MDA contact form: PHPMailer library is missing.');
    finish($returnPage, 'setup');
}

$smtp = require $configPath;

if (!is_array($smtp) || empty($smtp['username']) || empty($smtp['password'])) {
    error_log('MDA contact form: SMTP username or password is missing.');
    finish($returnPage, 'setup');
}

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = (string)($smtp['host'] ?? 'smtp.gmail.com');
    $mail->SMTPAuth = true;
    $mail->Username = (string)$smtp['username'];
    $mail->Password = (string)$smtp['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = (int)($smtp['port'] ?? 587);
    $mail->Timeout = 20;
    $mail->CharSet = 'UTF-8';

    $recipient = (string)($smtp['recipient'] ?? DEFAULT_RECIPIENT);
    $mail->setFrom((string)$smtp['username'], 'Memphis Dawah Website');
    $mail->addAddress($recipient, 'Memphis Dawah Association');
    $mail->addReplyTo($cleanEmail, $cleanName);
    $mail->Subject = $subject;
    $mail->Body = $body;
    $mail->send();

    finish($returnPage, 'sent');
} catch (Throwable $error) {
    error_log('MDA contact form SMTP error: ' . $error->getMessage());
    finish($returnPage, 'failed');
}
