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
        $requete = $conn->prepare("DELETE FROM actus WHERE id_actu = :id_actu"); //requete et préparation
        $requete->execute(
            array(
                ":id_actu" => sanitize($_GET["id"])
            )
        ); //execution de la requete
        header("Location: /pages/admin/gestion_actus.php"); //redirection
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
?>