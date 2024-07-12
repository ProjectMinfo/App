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
        $id_produit = sanitize($_POST["id_produit"]);
        $nom_article = sanitize($_POST["nom_article"]);
        $categorie = sanitize($_POST["categorie"]);
        $num_lot = sanitize($_POST["num_lot"]);
        $dlc = sanitize($_POST["dlc"]);
        $portions_achats = sanitize($_POST["portions_achats"]);
        $duplicate = sanitize($_POST["duplicate"]);

        //insertion dans la BDD de l'article
        for($i = 0; $i < $duplicate; $i++){
            $requete = $conn->prepare("INSERT INTO achats(id_produit, nom_article, categorie, num_lot, dlc, nb_portions) VALUES(:id_produit, :nom_article, :categorie, :num_lot, :dlc, :nb_portions)"); //requete et préparation
            $requete->execute(
                array(
                    ":id_produit" => $id_produit,
                    ":nom_article" => $nom_article,
                    ":categorie" => $categorie,
                    ":num_lot" => $num_lot,
                    ":dlc" => $dlc,
                    ":nb_portions" => $portions_achats
                )
            ); //execution de la requete

            //update de la table articles (gestion_stock)
            $requete = $conn->prepare("UPDATE articles SET qte = qte + :add_qte WHERE id_article = :id_produit");
            $requete->execute(
                array(
                    ":add_qte" => $portions_achats,
                    ":id_produit" => $id_produit
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