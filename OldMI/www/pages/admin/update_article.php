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
        $nom = sanitize($_POST["nom"]);
        $qte = sanitize($_POST["qte"]);
        $typeingredient = sanitize($_POST["categorie"]);
        $commentaire = sanitize($_POST["commentaire"]);
        $id_article = sanitize($_POST["id"]);


        //update du compte
        $requete = $conn->prepare("UPDATE articles SET nom = :nom, qte = :qte, TypeIngredient = :typeingredient, commentaire = :commentaire WHERE id_article = :id_article");
        $requete->execute(
            array(
                ":nom" => $nom,
                ":qte" => $qte,
                ":typeingredient" => $typeingredient,
                ":commentaire" => $commentaire,
                ":id_article" => $id_article
            )
        );

        //redirection vers profil.php
        header("Location: /pages/admin/modif_article.php?id=$id_article&status=success");
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
?>