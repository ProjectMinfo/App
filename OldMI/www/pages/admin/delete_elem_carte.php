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

if(isset($_GET["id"])){
    try{
        require_once '../../includes/database.php'; //connexion BDD
        //suppression de l'article dans la BDD
        $requete = $conn->prepare("DELETE FROM carte WHERE id_carte = :id_carte"); //requete et préparation
        $requete->execute(
            array(
                ":id_carte" => sanitize($_GET["id"])
            )
        ); //execution de la requete
        header("Location: /pages/admin/gestion_carte.php"); //redirection
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
?>