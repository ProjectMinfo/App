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

if($_SERVER["REQUEST_METHOD"] == "POST"){
    try{
        require_once '../../includes/database.php'; //connexion BDD
        $nom = sanitize($_POST["nom_elem"]);
        $typePlat = sanitize($_POST["categorie"]);
        $ingredientsPossibles = sanitize($_POST["liste"]);
        $prix = sanitize($_POST["prix"]);
        $prix_serveur = sanitize($_POST["prix_serveur"]);
        $ref = sanitize($_POST["ref"]);
        $label = sanitize($_POST["label"]);

        //insertion dans la BDD de l'article
        $requete = $conn->prepare("INSERT INTO carte(nom, typePlat, ingredientsPossibles, prix, prix_serveur, ref, label) VALUES(:nom, :typePlat, :ingredientsPossibles, :prix, :prix_serveur, :ref, :label)"); //requete et préparation
        $requete->execute(
            array(
                ":nom" => $nom,
                ":typePlat" => $typePlat,
                ":ingredientsPossibles" => $ingredientsPossibles,
                ":prix" => $prix,
                ":prix_serveur" => $prix_serveur,
                ":ref" => $ref,
                ":label" => $label
            )
        ); //execution de la requete
        header("Location: /pages/admin/gestion_carte.php"); //redirection
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
?>