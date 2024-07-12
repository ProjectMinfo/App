<?php

session_start();

try {
    require_once '../../includes/database.php'; //connexion BDD
    //maj de l'etat de l'article dans la BDD
    $requete = $conn->prepare("DELETE FROM planning WHERE id_planning = :id_planning"); //requete et préparation
    $requete->execute(
        array(
            ":id_planning" => $_GET["id_planning"]
        )
    ); //execution de la requete
    header("Location: get_planning.php?weeknumber=" . $_GET["num_semaine"]);
} catch (Exception $e) { //en cas d'erreur
    die("Erreur : " . $e->getMessage());
}
