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

if(isset($_POST["Ajouter"])){
    try{
        require_once '../../includes/database.php'; //connexion BDD
        $article_name = sanitize($_POST["nom_article"]);
        $article_qte = sanitize($_POST["qte_article"]);
        $article_type = sanitize($_POST["article_type"]);
        $commentaire = sanitize($_POST["commentaire"]);

        //insertion dans la BDD de l'article
        $requete = $conn->prepare("INSERT INTO articles(nom, qte, TypeIngredient, commentaire) VALUES(:nom, :qte, :typeingredient, :commentaire)"); //requete et préparation
        $requete->execute(
            array(
                ":nom" => $article_name,
                ":qte" => $article_qte,
                ":typeingredient" => $article_type,
                ":commentaire" => $commentaire
            )
        ); //execution de la requete
        header("Location: /pages/admin/gestion_stock.php"); //redirection
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
?>