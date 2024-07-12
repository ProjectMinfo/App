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

if(isset($_POST["sendNet"])){
    if(isset($_POST['comment'])){
        $comm = sanitize($_POST['comment']);
        $nom = $_SESSION['utilisateur']['prenom'].' '.$_SESSION['utilisateur']['nom'];
        $SQL = 'INSERT INTO nettoyage (explication,nom_membre) VALUES (?,?)';
        $stmt = $conn->prepare($SQL);
        if($stmt->execute(array($comm,$nom))){
            $_SESSION['succes']="Le nettoyage a été enrgistré avec succès!";
        }else{
            $_SESSION['error']="Une erreur c'est produite. Contactez les deux bg du pôle info";
        }
        

    }


}else{
    $_SESSION['error']="Merci de remplir le commantaire";
}
var_dump($_POST);
header('Location:salle_secu.php');

?>