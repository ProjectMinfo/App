<?php

session_start(); //démarrage de la session
require_once "../../includes/functions.php"; //importation des fonctions
areSetCookies(); //création de la session si cookies existent

if (!isConnected() || !isAdmin($conn, $_SESSION["utilisateur"]["uid"])) {
    header("Location: ../index.php");
    die();
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-witdh, initial-scale=1, maximum-scale=1">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <title>Chti'MI | Administration</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/admin.css">
</head>

<body>
    <?php require_once '../../includes/header.php'; ?>
    <br>
    <a href="../user/profil.php" class="retour">Retour au profil</a>
    <br>
    <div class="container">
        <?php echo "<span class='name'>Bienvenue " . $_SESSION["utilisateur"]["prenom"] . " " . $_SESSION["utilisateur"]["nom"] . "</span>"; ?>
        <div class="admin-container">
            <a href="gestion_stock.php"><img src="../../assets/svg/boxes-packing-solid.svg" alt="Gestion du stock"><span>Gestion des stocks</span></a>
            <a href="tresorerie.php"><img src="../../assets/svg/money-check-dollar-solid.svg" alt=""><span>Trésorerie</span></a>
            <a href="consultation_comptes.php"><img src="../../assets/svg/user-pen-solid.svg" alt=""><span>Gestion des comptes</span></a>
            <a href="achats.php"><img src="../../assets/svg/wallet-solid.svg" alt=""><span>Gestion des achats</span></a>
            <a href="gestion_carte.php"><img src="../../assets/svg/burger-solid.svg" alt=""><span>Modification de la carte</span></a>
            <a href="settings.php"><img src="../../assets/svg/gear-solid.svg" alt=""><span>Paramètres</span></a>
        </div>
    </div>
    <div class="container">
        <div class="admin-container">
            <a href="gestion_actus.php"><img src="../../assets/svg/newspaper-solid.svg" alt=""><span>Gestion des actus</span></a>
            <a href="salle_secu.php"><img src="../../assets/svg/broom-ball-solid.svg" alt=""><span>Salle et sécurité</span></a>
            <a href="../serveurs/commandes.php"><img src="../../assets/svg/pen-to-square-solid.svg" alt="Prise de commande">Prise de commandes</a>
            <a href="../serveurs/planning.php"><img src="../../assets/svg/calendar-days-solid.svg" alt="Planning">Planning</a>
            <a href="../serveurs/affichage_cuisine.php" target="_blank"><img src="../../assets/svg/kitchen-set-solid.svg" alt="Affichage cuisine">Affichage cuisine</a>
        </div>
    </div>
    <?php require_once '../../includes/footer.php'; ?>
</body>

</html>