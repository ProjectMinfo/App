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
        $requete = $conn->prepare("DELETE FROM achats WHERE id_achat = :id_achat"); //requete et préparation
        $requete->execute(
            array(
                ":id_achat" => sanitize($_GET["id"])
            )
        ); //execution de la requete
        if($_GET["etat"] != 2 && $_GET["etat"] != 3 && $_GET["etat"] != 4){ //si le produit n'est pas fermé (terminé) ou périmé, on supprime du stock
            //update de la table articles (gestion_stock)
            $requete = $conn->prepare("UPDATE articles SET qte = qte - :del_qte WHERE id_article = :id_produit");
            $requete->execute(
                array(
                    ":del_qte" => sanitize($_GET["portions"]),
                    ":id_produit" => sanitize($_GET["id_produit"])
                )
            );
        }
        else if($_GET["etat"] == 3 || $_GET["etat"] == 4){ //si le produit est périmé ou partiellement périmé
            //update de la table articles (gestion_stock)
            $to_delete = $_GET["portions"] - $_GET["already_del"];
            $requete = $conn->prepare("UPDATE articles SET qte = qte - :del_qte WHERE id_article = :id_produit");
            $requete->execute(
                array(
                    ":del_qte" => $to_delete,
                    ":id_produit" => sanitize($_GET["id_produit"])
                )
            );
        }
        header("Location: /pages/admin/achats.php"); //redirection
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
?>