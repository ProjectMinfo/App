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

if(isset($_POST["sendTemp"])){
    if(isset($_POST['tmp1']) && isset($_POST['tmp2'])){
        $tmp1 = floatval($_POST['tmp1']);
        $tmp2 = floatval($_POST['tmp2']);
        $nom = $_SESSION['utilisateur']['prenom'].' '.$_SESSION['utilisateur']['nom'];
        $SQL = 'INSERT INTO temperatures (tmp1,tmp2,NomMembre) VALUES (?,?,?)';
        $stmt = $conn->prepare($SQL);
        if($stmt->execute(array($tmp1,$tmp2,$nom))){
            $_SESSION['succes']="Le relevé a été enrgistré avec succès!";
        }else{
            $_SESSION['error']="Une erreur c'est produite. Contactez les deux bg du pôle info";
        }
        

    }


}else{
    $_SESSION['error']="Merci de remplir les deux températures";
}
header('Location:salle_secu.php');

?>