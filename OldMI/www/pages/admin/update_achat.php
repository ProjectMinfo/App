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
if(isset($_POST["Enregistrer"])){
    try{
        require_once '../../includes/database.php'; //connexion BDD

        // //récupération des données
        $id_achat = sanitize($_POST["id"]);
        $id_produit = sanitize($_POST["id_produit"]);
        $num_lot = sanitize($_POST["num_lot"]);
        $dlc = sanitize($_POST["dlc"]);
        $portions_achats = sanitize($_POST["portions_achats"]);
        $date_ouverture = sanitize($_POST["date_ouverture"]);
        $date_fermeture = sanitize($_POST["date_fermeture"]);

        if($date_ouverture == ""){
            $date_ouverture = null;
        }
        if($date_fermeture == ""){
            $date_fermeture = null;
        }

        if($portions_achats != $_POST["portions_achats_old"]){
            $add_portions = $portions_achats - $_POST["portions_achats_old"];
        }
        else{
            $add_portions = 0;
        }

        //update de la table achat
        $requete = $conn->prepare("UPDATE achats SET num_lot = :num_lot, dlc = :dlc, nb_portions = :nb_portions, date_ouverture = :date_ouverture, date_fermeture = :date_fermeture WHERE id_achat = :id_achat");
        $requete->execute(
            array(
                ":num_lot" => $num_lot,
                ":dlc" => $dlc,
                ":nb_portions" => $portions_achats,
                ":date_ouverture" => $date_ouverture,
                ":date_fermeture" => $date_fermeture,
                ":id_achat" => $id_achat
            )
        );

        //update de la table articles (gestion_stock)
        $requete = $conn->prepare("UPDATE articles SET qte = qte + :add_qte WHERE id_article = :id_produit");
        $requete->execute(
            array(
                ":add_qte" => $add_portions,
                ":id_produit" => $id_produit
            )
        );

        //redirection
        header("Location: /pages/admin/achats.php");
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
?>