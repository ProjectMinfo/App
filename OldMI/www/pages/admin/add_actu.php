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
        $titre = sanitize($_POST["titre"]);
        $content = $_POST["content"];

        //insertion dans la BDD de l'actu
        $requete = $conn->prepare("INSERT INTO actus(titre, content) VALUES(:titre, :content)"); //requete et préparation
        $requete->execute(
            array(
                ":titre" => $titre,
                ":content" => $content
            )
        ); //execution de la requete
        header("Location: /pages/admin/gestion_actus.php"); //redirection
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
?>