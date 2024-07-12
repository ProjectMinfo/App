<?php
session_start(); // Start the session
require_once './includes/functions.php'; // Import functions
require_once './includes/database.php';
areSetCookies(); // Create the session if cookies exist

try {
    // Fetch recent messages from the 'actus' table
    $stmt = $conn->prepare("SELECT * FROM actus ORDER BY id_actu DESC");
    $stmt->execute();
    $actus = $stmt->fetchAll();
} catch (Exception $e) {
    die("Erreur : " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-witdh, initial-scale=1, maximum-scale=1">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <title>Chti'MI</title>
</head>

<body>
    <?php require_once './includes/header.php'; ?>
    <div class="MentionsMainDiv">
        <div class="PetiteZoneMentions">Les actus</div>
        <?php foreach ($actus as $actu) : ?>
            <div>
                <h2><?= $actu["titre"] ?></h2><br>
                <p><?= $actu["content"] ?></p>
            </div>
        <?php endforeach; ?>
    </div>
    <?php require_once './includes/footer.php'; ?>
</body>

</html>