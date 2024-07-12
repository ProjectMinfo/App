<?php

session_start(); //démarrage de la session
require_once "../../includes/functions.php"; //importation des fonctions
require_once "fct_planning.php"; //importation des fonctions du planning
require_once "../../includes/database.php";
require_once "../../includes/fpdf/fpdf.php";
areSetCookies(); //création de la session si cookies existent

if (!isConnected()) {
    header("Location: ../index.php");
    exit();
} elseif (!isServeur($conn, $_SESSION["utilisateur"]["uid"])) {
    header("Location: ../index.php");
    exit();
}

if(isset($_POST["PDF"])){
    //récupération des données
    try {
        $requete = $conn->prepare("SELECT * FROM planning GROUP BY id_planning, date ORDER BY STR_TO_DATE(date, '%d/%m/%Y') ASC;"); //requete et préparation
        $requete->execute(); //execution de la requete
        $resultat = $requete->fetchAll();
    } catch (Exception $e) { //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }

    //on compte le nombre de services par personne
    try {
        $resultat2 = $conn->query("SELECT prenom, COUNT(*) AS nombre_occurrences FROM planning GROUP BY prenom;");
    } catch (Exception $e) { //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }

    $pdf = new FPDF();

    //page compteur services
    $pdf->AddPage();
    $pdf->SetFont('Arial','B',16);
    $pdf->Cell(80,5, 'Compteur services', 0);
    $pdf->Ln();
    $pdf->Ln();
    while ($row = $resultat2->fetch(PDO::FETCH_ASSOC)) {
        $prenom = utf8_decode($row['prenom']);
        $nombre_occurrences = $row['nombre_occurrences'];
        $pdf->SetFont('Arial','',14);
        $pdf->Cell(40,8, "$prenom: $nombre_occurrences", 1);
        $pdf->Ln();
    }


    $pdf->AddPage();
    $pdf->SetFont('Arial','B',16);
    $pdf->Cell(80,5, 'Historique services', 0);
    $pdf->Ln();
    $pdf->Ln();
    $pdf->SetFont('Arial','',8);
    $num_semaine = 0;
    foreach($resultat as $res){
        if($num_semaine != $res["num_semaine"]){
            $num_semaine = $res["num_semaine"];
            $pdf->Ln();
            $pdf->SetFont('Arial','',10);
            $pdf->Cell(40,5, "Semaine: ".$num_semaine, 1);
            $pdf->Ln();
            $pdf->SetFont('Arial','',8);
        }
        $pdf->Cell(40,5,utf8_decode($res["prenom"]), 1);
        $pdf->Cell(40,5,$res["date"], 1);
        $pdf->Ln();
    }

    // Nom du fichier de sortie
    $filename = 'historique_services.pdf';

    $pdf->Output($filename, 'D');
}

?>