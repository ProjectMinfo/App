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
    <title>Chti'MI | Trésorerie</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/tresorerie.css">
</head>
<body>
    <?php
    require_once '../../includes/header.php';
    require_once '../../includes/admin_panel.php'
    ?>
    <?php
    try{
        require_once '../../includes/database.php'; //connexion BDD

        //récupération dans la BDD des solde des comptes
        $requete = $conn->prepare("SELECT montant FROM comptes"); //requete et préparation
        $requete->execute(); //execution de la requete
        $soldes = $requete->fetchAll(); //recupération des données

        //calcul du solde total et calcul des positions de compte (crédités, non-crédités (0€), dans le négatif)
        $solde_total = 0;
        $pos_credit = 0;
        $pos_non_credit = 0;
        $pos_negatif = 0;
        foreach($soldes as $solde){
            $solde_total += $solde["montant"];
            if($solde["montant"] < 0){
                $pos_negatif++;
            }
            else if($solde["montant"] == 0){
                $pos_non_credit++;
            }
            else{
                $pos_credit++;
            }
        }

        //récupération des types de paiements
        $requete = $conn->prepare("SELECT prix, typepaiement FROM commandes"); //requete et préparation
        $requete->execute(); //execution de la requete
        $paiements = $requete->fetchAll(); //recupération des données
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
    ?>
    <div class="grid-container">
        <br>
        <div class="finances">
            <h3>Finances</h3>
            <br>
            <span>Solde total des comptes : <b><?php echo $solde_total."€"; ?></b></span>
        </div>
        <br>
        <div class="stats_comptes">
            <h3>Statistiques des comptes</h3>
            <br>
            <span class="total">
                <?php echo $pos_credit+$pos_non_credit+$pos_non_credit; ?> comptes au total
            </span>
            <br>
            <span class="credites">
                <span><?php echo $pos_credit; ?> comptes crédités</span>
            </span>
            <br>
            <span class="non_credites">
                <span><?php echo $pos_non_credit; ?> comptes non-crédités</span>
            </span>
            <br>
            <span class="negatifs">
                <span><?php echo $pos_negatif; ?> comptes dans le rouge</span>
            </span>
        </div>
        <br>
        <div class="commandes">
            <h3>Commandes par période</h3>
            <br>
            <label for="start">Date de début:</label>
            <input type="date" name="start" id="start">
            <label for="end">Date de fin:</label>
            <input type="date" name="end" id="end">
            <button id="getpaiementbutton">Voir</button>
            <div id="content">
                <?php include("tresorerie/get_paiements.php"); ?>
            </div>
        </div>
        <br>
        <div class="extra">
            <h3>Extra</h3>
            <p>Permet de connaître le % de commandes <i>in</i> sur une période</p>
            <br>
            <label for="start2">Date de début :</label>
            <input type="date" name="start2" id="start2">
            <label for="end2">Date de fin :</label>
            <input type="date" name="end2" id="end2">
            <button id="getextrabutton">Voir</button>
            <div id="content2">
                <?php include("tresorerie/get_extra.php"); ?>
            </div>
        </div>
    </div>
    <?php require_once '../../includes/footer.php'; ?>
    <script src="/assets/js/jquery.min.js"></script>
    <script src="tresorerie.js"></script>
</body>
</html>