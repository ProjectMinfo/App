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
        $titre = sanitize($_POST["titre"]);
        $content = $_POST["content"];
        $id_actu = sanitize($_POST["id"]);

        //update du compte
        $requete = $conn->prepare("UPDATE actus SET titre = :titre, content = :content WHERE id_actu = :id_actu");
        $requete->execute(
            array(
                ":titre" => $titre,
                ":content" => $content,
                ":id_actu" => $id_actu
            )
        );

        //redirection vers gestion_actus.php
        header("Location: /pages/admin/gestion_actus.php?status_modify=success");
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
?>