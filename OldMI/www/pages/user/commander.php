<?php
session_start();
require_once('../../includes/functions.php');
areSetCookies();
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chti'MI | Commander</title>
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/commandeUser/selectmenu.css">
</head>

<body>
    <?php
    date_default_timezone_set('Europe/Paris');
    require_once("../../includes/header.php");
    $can_order = true;
    if (!isset($_SESSION['utilisateur']) && empty($_SESSION['utilisateur'])) {
        $can_order = false;
    ?>
        <div class="MentionsMainDiv">
            <div>
                <p>Il faut être connecté pour commander.</p>
                <a href="../general/connexion.php">Se connecter</a>
            </div>
        </div>
    <?php
    }
    if(HeuresActives($conn)){
        if (!canOrder($conn) || in_array(date("N"), array(6, 7))) {
            $can_order = false;
        ?>
            <div class="MentionsMainDiv">
                <div>
                    <p>La prise de commande est désactivée.</p>
                    <a href="../../index.php">Retour à l'accueil</a>
                </div>
            </div>
        <?php
        } elseif (intval(date("H")) >= 12 || intval(date("H")) < 0) {
            $can_order = false;
        ?>
            <div class="MentionsMainDiv">
                <div>
                    <p>Tu ne peux commander qu'avant midi le jour de ta commande. Reviens demain !</p>
                    <a href="../../index.php">Retour à l'accueil</a>
                </div>
            </div>
        <?php
        }
    }
    if ($can_order) {

    ?>
        <div style="text-align:center ;padding-top: 25px;">
            <h1>Choisissez un menu</h1>
            <p>Si vous souhaitez commander hors menu, merci de vous rendre directement au comptoir.</p>
        </div>

        <div class="menu-container">
            <a class="menu-item" href="choosePlat.php?menu=1">
                <h2>Ch'tite Faim</h2>
                <?php
                if (isServeur($conn, $_SESSION["utilisateur"]["uid"])) {
                    $prix = getPrixMenu($conn, 1, true)[0];
                } else {
                    $prix = getPrixMenu($conn, 1, false)[0];
                }
                ?>
                <h3><?= $prix ?>€</h3>
                <img src="../../assets/img/Chtite_faim.png" class="menu-img">
                <p><strong>Contient :</strong></p>
                <ul class="option-list">
                    <li>1 plat</li>
                    <li>2 périphériques (snacks et/ou boissons)</li>
                </ul>
            </a>
            <a class="menu-item" href="choosePlat.php?menu=2">
                <h2>P'tit QuinQuin</h2>
                <?php
                if (isServeur($conn, $_SESSION["utilisateur"]["uid"])) {
                    $prix = getPrixMenu($conn, 2, true)[0];
                } else {
                    $prix = getPrixMenu($conn, 2, false)[0];
                }
                ?>
                <h3><?= $prix ?>€</h3>
                <img src="../../assets/img/Ptit_quinquin.png" class="menu-img">
                <p><strong>Contient :</strong></p>
                <ul class="option-list">
                    <li>1 plat</li>
                    <li>1 extra (Croque-Monsieur ou Hot-Dog)</li>
                    <li>1 périphérique (snack ou boisson)</li>
                </ul>
            </a>
            <a class="menu-item" href="choosePlat.php?menu=3">
                <h2>T'Cho Biloute</h2>
                <?php
                if (isServeur($conn, $_SESSION["utilisateur"]["uid"])) {
                    $prix = getPrixMenu($conn, 3, true)[0];
                } else {
                    $prix = getPrixMenu($conn, 3, false)[0];
                }
                ?>
                <h3><?= $prix ?>€</h3>
                <img src="../../assets/img/Tcho_biloute.png" class="menu-img">
                <p><strong>Contient :</strong></p>
                <ul class="option-list">
                    <li>2 plats</li>
                </ul>
            </a>
        </div>
    <?php
    }
    require_once '../../includes/footer.php';
    ?>
</body>

</html>