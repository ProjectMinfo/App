<?php
if(isset($_GET["start"]) && isset($_GET["end"])){
    try{
        require_once '../../../includes/database.php'; //connexion BDD
        //récupération des dates de la période
        $date_debut = $_GET['start'];
        $date_fin = $_GET['end'];
        // Convertir les dates en datetime
        $date_debut_datetime = $date_debut . ' 00:00:00';
        $date_fin_datetime = $date_fin . ' 23:59:59';
        $requete = $conn->prepare("SELECT commande_in FROM commandes WHERE date BETWEEN :date_debut AND :date_fin AND etat != 3"); //requete et préparation
        $requete->bindParam(':date_debut', $date_debut_datetime);
        $requete->bindParam(':date_fin', $date_fin_datetime);
        $requete->execute();
        $datas = $requete->fetchAll(); //recupération des données
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }

    //dédicace à ChatGPT pour cette partie du code ptdr
    $tableau = array();
    foreach($datas as $data){
        $result = $data["commande_in"];
        $elements = explode(',', $result);
        foreach ($elements as $element) {
            $element = trim($element);
            if (preg_match('/^(\d+)\s+(.+)/', $element, $matches)) {
                $quantite = intval($matches[1]);
                $nom = $matches[2];
                for ($i = 0; $i < $quantite; $i++) {
                    $tableau[] = $nom;
                }
            } else if($element != ""){
                $tableau[] = $element;
            }
        }
    }

    $totalElements = count($tableau);
    $pourcentages = array();
    $occurrences = array_count_values($tableau);

    foreach ($occurrences as $element => $occurrence) {
        $pourcentage = ($occurrence / $totalElements) * 100;
        $pourcentageArrondi = round($pourcentage, 2);
        $pourcentages[$element] = $pourcentageArrondi;
    }

    echo "<br>";
    foreach ($pourcentages as $element => $pourcentage) {
        echo "$element : $pourcentage%\n";
        echo "<br>";
    }
    echo "<br>";
}