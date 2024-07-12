<?php
session_start(); //démarrage de la session
require_once "../../includes/functions.php"; //importation des fonctions
areSetCookies(); //création de la session si cookies existent
if (!isConnected()){
    header("Location: ../index.php");
    exit();
} elseif (!isAdmin($conn,$_SESSION["utilisateur"]["uid"])) {
    header("Location: ../index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-witdh, initial-scale=1, maximum-scale=1">
        <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
        <title>Chti'MI | Paramètres</title>
        <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
        <link rel="stylesheet" href="/assets/css/global.css">
        <link rel="stylesheet" href="/assets/css/settings.css">
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    </head>
    <body>
        <?php
            require_once '../../includes/header.php';
            require_once '../../includes/admin_panel.php';
            try{
                require_once '../../includes/database.php'; //connexion BDD
            }catch(Exception $e){ //en cas d'erreur
                die("Erreur : " . $e->getMessage());
            }
        ?>
        <h1 title="On va pouvoir désactiver les heures!">Paramètres</h1>
        <?php if(isset($_SESSION['error'])){
            ?>
            <div class="MentionsMainDiv">
            <div>
                <p><?=$_SESSION['error']?></p>
            </div>
        </div>
            <?php
            unset($_SESSION['error']);
        } ?>
        <form class="container" action="settings_update.php" method="POST">
            <?php 
            $settings = getAllSettings($conn);

            
            ?>
            <div class="setting-box">
                <input type="checkbox" id="CommandesActiveCheck" name="activerCommandes" <?php if(intval($settings[0]["value"])==1){echo("checked");}?>><label for="CommandesActiveCheck">Commandes en ligne</label>
            </div>
            <div class="setting-box">
                <input type="checkbox" id="ModeEventCheck" name="activerEvent" <?php if(intval($settings[2]["value"])==1){echo("checked");}?>><label for="ModeEventCheck">Mode évenement</label>
            </div>
            <div class="setting-box">
                <input type="checkbox" id="HeuresCommandesCheck" name="activerHeures" <?php if(intval($settings[3]["value"])==1){echo("checked");}?>><label for="HeuresCommandesCheck">Limitation des heures pour les commandes en ligne</label>
            </div>
            <div><input type="submit" value="Mettre à jour" class="btn btn-valider"></div>
        </form>
        
    </body>
</html>