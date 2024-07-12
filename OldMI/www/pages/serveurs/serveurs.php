<?php
session_start(); //démarrage de la session
require_once "../../includes/functions.php"; //importation des fonctions
areSetCookies(); //création de la session si cookies existent

if (!isConnected()) {
    header("Location: ../index.php");
    exit();
} elseif (!isServeur($conn, $_SESSION["utilisateur"]["uid"])) {
    header("Location: ../index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chti'MI | Page serveur</title>
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/serveur.css">
</head>

<body>
    <?php
    require_once '../../includes/header.php';
    ?>
    <br>
    <a href="../user/profil.php" class="retour">Retour</a>
    <br>
    <div class="ServeurContainer">
        <?php
        echo "<span class='name'>" . $_SESSION["utilisateur"]["prenom"] . " " . $_SESSION["utilisateur"]["nom"] . " - Serveur</span>";
        ?>
    </div>
    <div class="admin-container">
        <a href="../serveurs/commandes.php"><img src="../../assets/svg/pen-to-square-solid.svg" alt="Prise de commande">Prise de commandes</a>
        <a href="../serveurs/planning.php"><img src="../../assets/svg/calendar-days-solid.svg" alt="Planning">Planning</a>
        <a href="../serveurs/affichage_cuisine.php" target="_blank"><img src="../../assets/svg/kitchen-set-solid.svg" alt="Affichage cuisine">Affichage cuisine</a>
    </div>
    <?php require_once '../../includes/footer.php'; ?>
</body>

</html>