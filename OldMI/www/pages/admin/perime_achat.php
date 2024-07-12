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

if(isset($_POST["Declare"])){
    try{
        require_once '../../includes/database.php'; //connexion BDD
        //on determine l'etat
        if($_POST["nb_portions"] == $_POST["nb_portions_total"]){
            $etat = 3;
        }
        else{
            $etat = 4;
        }
        //maj de l'achat dans la BDD
        $requete = $conn->prepare("UPDATE achats SET etat = :etat, qte_perimee = :qte_perimee WHERE id_achat = :id_achat"); //requete et préparation
        $requete->execute(
            array(
                ":etat" => $etat,
                ":qte_perimee" => sanitize($_POST["nb_portions"]),
                ":id_achat" => sanitize($_POST["achat_id"])
            )
        ); //execution de la requete
        if($_POST["nb_portions"] != $_POST["nb_portions_perime"]){
            $add = $_POST["nb_portions"] - $_POST["nb_portions_perime"];
        }
        else{
            $add = $_POST["nb_portions"];
        }

        //suppression de la quantité périmée
        $requete = $conn->prepare("UPDATE articles SET qte = qte - :del_qte WHERE id_article = :id_produit");
        $requete->execute(
            array(
                ":del_qte" => $add,
                ":id_produit" => sanitize($_POST["id_produit"])
            )
        );
        header("Location: /pages/admin/achats.php"); //redirection
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
?>