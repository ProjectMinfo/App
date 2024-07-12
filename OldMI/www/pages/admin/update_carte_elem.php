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

        // //récupération des données
        $nom = sanitize($_POST["nom"]);
        $ingredientsPossibles = sanitize($_POST["liste"]);
        $prix = sanitize($_POST["prix"]);
        $prix_serveur = sanitize($_POST["prix_serveur"]);
        $ref = sanitize($_POST["ref"]);
        $label = sanitize($_POST["label"]);
        $id_carte = sanitize($_POST["id"]);


        //update de l'élément de la carte
        $requete = $conn->prepare("UPDATE carte SET nom = :nom, ingredientsPossibles = :ingredientsPossibles, prix = :prix, prix_serveur = :prix_serveur, ref = :ref, label = :label WHERE id_carte = :id_carte");
        $requete->execute(
            array(
                ":nom" => $nom,
                ":ingredientsPossibles" => $ingredientsPossibles,
                ":prix" => $prix,
                ":prix_serveur" => $prix_serveur,
                ":ref" => $ref,
                ":label" => $label,
                ":id_carte" => $id_carte
            )
        );

        //redirection vers profil.php
        header("Location: /pages/admin/gestion_carte.php?status=succes");
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
?>