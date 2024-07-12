<?php
session_start(); //démarrage de la session
require_once "../../includes/functions.php"; //importation des fonctions
areSetCookies(); //création de la session si cookies existent
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <title>Chti'MI | Carte</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
</head>

<body>
    <?php require_once '../../includes/header.php'; ?>
    <div id="ZoneCarte">
        <img src="/assets/img/Carte1.png" alt="Carte1">
        <img src="/assets/img/Carte2.png" alt="Carte2">
    </div>
    <?php require_once '../../includes/footer.php'; ?>
</body>

</html>