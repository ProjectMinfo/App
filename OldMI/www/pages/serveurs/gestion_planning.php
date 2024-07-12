<?php

session_start();

try {
    require_once '../../includes/database.php'; //connexion BDD
    //maj de l'etat de l'article dans la BDD
    $idserveur = 0;
    $prenom = "";
    if(isset($_GET["idserveur"]) && !empty($_GET["idserveur"])){
        $idserveur = $_GET["idserveur"];
        $requete = $conn->prepare("SELECT prenom FROM comptes WHERE id_compte = $idserveur");
        $requete->execute();
        $prenom = $requete->fetch();
        $prenomto = $prenom[0];
    }
    else{
        $idserveur = $_SESSION["utilisateur"]["uid"];
        $prenomto = $_SESSION["utilisateur"]["prenom"];
    }
    $requete = $conn->prepare("INSERT INTO planning(prenom, poste, num_poste, date, num_semaine, id_user, tab) VALUES(:prenom, :poste, :num_poste, :date, :num_semaine, :id_user, :tab)"); //requete et préparation
    $requete->execute(
        array(
            ":prenom" => $prenomto,
            ":poste" => intval($_GET["poste"]),
            ":num_poste" => intval($_GET["num_poste"]),
            ":date" => $_GET["date"],
            ":num_semaine" => $_GET["num_semaine"],
            ":id_user" => $idserveur,
            ":tab" => intval($_GET["tab"])
        )
    ); //execution de la requete
    header("Location: get_planning.php?weeknumber=" . $_GET["num_semaine"]);
} catch (Exception $e) { //en cas d'erreur
    die("Erreur : " . $e->getMessage());
}
