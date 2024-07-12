<?php

if(!isset($_SESSION["utilisateur"])){
    session_start();
}

function afficherSemaine($numeroSemaine, $bdd)
{
    // Assurez-vous que le numéro de semaine est un entier positif
    $numeroSemaine = intval($numeroSemaine);
    if ($numeroSemaine <= 0) {
        echo "Le numéro de semaine doit être un entier positif.";
        return;
    }

    setlocale(LC_TIME, 'fr_FR.utf8');

    // Obtenez la date du premier jour de l'année en cours
    $datePremierJourAnnee = strtotime(date('2024-01-01'));

    // Calcul de la date du lundi de la semaine correspondante
    $dateActuelle = strtotime("Monday this week", $datePremierJourAnnee);
    $dateActuelle = strtotime("+" . ($numeroSemaine - 1) . " weeks", $dateActuelle);

    // Boucle pour afficher les jours de la semaine
    for ($i = 0; $i < 5; $i++) {
        try {
            require_once '../../includes/database.php';
            $date_bdd = date('j/m/y', $dateActuelle);
            //var_dump($date_bdd);
            $requete1 = $bdd->prepare("SELECT * FROM planning WHERE date = :date_bdd AND tab = 1"); //requete et préparation
            $requete1->execute(
                array(
                    ":date_bdd" => $date_bdd
                )
            ); //execution de la requete
            $resultat1 = $requete1->fetch();

            $requete2 = $bdd->prepare("SELECT * FROM planning WHERE date = :date_bdd AND tab = 2"); //requete et préparation
            $requete2->execute(
                array(
                    ":date_bdd" => $date_bdd
                )
            ); //execution de la requete
            $resultat2 = $requete2->fetch();

            $requete3 = $bdd->prepare("SELECT * FROM planning WHERE date = :date_bdd AND tab = 3"); //requete et préparation
            $requete3->execute(
                array(
                    ":date_bdd" => $date_bdd
                )
            ); //execution de la requete
            $resultat3 = $requete3->fetch();

            $requete4 = $bdd->prepare("SELECT * FROM planning WHERE date = :date_bdd AND tab = 4"); //requete et préparation
            $requete4->execute(
                array(
                    ":date_bdd" => $date_bdd
                )
            ); //execution de la requete
            $resultat4 = $requete4->fetch();

            $requete5 = $bdd->prepare("SELECT * FROM planning WHERE date = :date_bdd AND tab = 5"); //requete et préparation
            $requete5->execute(
                array(
                    ":date_bdd" => $date_bdd
                )
            ); //execution de la requete
            $resultat5 = $requete5->fetch();

            $requete6 = $bdd->prepare("SELECT * FROM planning WHERE date = :date_bdd AND tab = 6"); //requete et préparation
            $requete6->execute(
                array(
                    ":date_bdd" => $date_bdd
                )
            ); //execution de la requete
            $resultat6 = $requete6->fetch();
        } catch (Exception $e) { //en cas d'erreur
            die("Erreur : " . $e->getMessage());
        }

        $array_droits = [163, 153, 175, 150, 182, 164, 168]; //Marco, Edouard, Lucas, Victor, Jules, Aymeric, Mathys

        if ($resultat1 == null) {
            $afficher_case1 = '<button class="inscrire" id="inscrireDevant' . $i . '" data-tab=\'[1, 1, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 1]\'>Inscription</button>';
            if(in_array($_SESSION["utilisateur"]["uid"], $array_droits)){
                $afficher_case1 .= '<br><button class="choix" id="inscrireChoix' . $i . '" data-tab=\'[1, 1, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 1]\'>Choix</button>';
            }
        } else {
            $afficher_case1 =  $resultat1[2];
            if ($resultat1[7] == $_SESSION["utilisateur"]["uid"] || in_array($_SESSION["utilisateur"]["uid"], $array_droits)) {
                $afficher_case1 .= "<br><button id='delete' data-tab2=[" . $resultat1[0] . "," . $resultat1[7] . "," . $numeroSemaine . "]>Désinscription</button>";
            }
        }
        if ($resultat2 == null) {
            $afficher_case2 = '<button class="inscrire" id="inscrireDevant' . $i . '" data-tab=\'[1, 2, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 2]\'>Inscription</button>';
            if(in_array($_SESSION["utilisateur"]["uid"], $array_droits)){
                $afficher_case2 .= '<br><button class="choix" id="inscrireChoix' . $i . '" data-tab=\'[1, 2, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 2]\'>Choix</button>';
            }
        } else {
            $afficher_case2 =  $resultat2[2];
            if ($resultat2[7] == $_SESSION["utilisateur"]["uid"] || in_array($_SESSION["utilisateur"]["uid"], $array_droits)) {
                $afficher_case2 .= "<br><button id='delete' data-tab2=[" . $resultat2[0] . "," . $resultat2[7] . "," . $numeroSemaine . "]>Désinscription</button>";
            }
        }
        if ($resultat3 == null) {
            $afficher_case3 = '<button class="inscrire" id="inscrireDevant' . $i . '" data-tab=\'[2, 1, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 3]\'>Inscription</button>';
            if(in_array($_SESSION["utilisateur"]["uid"], $array_droits)){
                $afficher_case3 .= '<br><button class="choix" id="inscrireChoix' . $i . '" data-tab=\'[2, 1, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 3]\'>Choix</button>';
            }
        } else {
            $afficher_case3 =  $resultat3[2];
            if ($resultat3[7] == $_SESSION["utilisateur"]["uid"] || in_array($_SESSION["utilisateur"]["uid"], $array_droits)) {
                $afficher_case3 .= "<br><button id='delete' data-tab2=[" . $resultat3[0] . "," . $resultat3[7] . "," . $numeroSemaine . "]>Désinscription</button>";
            }
        }
        if ($resultat4 == null) {
            $afficher_case4 = '<button class="inscrire" id="inscrireDevant' . $i . '" data-tab=\'[2, 2, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 4]\'>Inscription</button>';
            if(in_array($_SESSION["utilisateur"]["uid"], $array_droits)){
                $afficher_case4 .= '<br><button class="choix" id="inscrireChoix' . $i . '" data-tab=\'[2, 2, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 4]\'>Choix</button>';
            }
        } else {
            $afficher_case4 =  $resultat4[2];
            if ($resultat4[7] == $_SESSION["utilisateur"]["uid"] || in_array($_SESSION["utilisateur"]["uid"], $array_droits)) {
                $afficher_case4 .= "<br><button id='delete' data-tab2=[" . $resultat4[0] . "," . $resultat4[7] . "," . $numeroSemaine . "]>Désinscription</button>";
            }
        }
        if ($resultat5 == null) {
            $afficher_case5 = '<button class="inscrire" id="inscrireDevant' . $i . '" data-tab=\'[3, 1, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 5]\'>Inscription</button>';
            if(in_array($_SESSION["utilisateur"]["uid"], $array_droits)){
                $afficher_case5 .= '<br><button class="choix" id="inscrireChoix' . $i . '" data-tab=\'[3, 1, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 5]\'>Choix</button>';
            }
        } else {
            $afficher_case5 =  $resultat5[2];
            if ($resultat5[7] == $_SESSION["utilisateur"]["uid"] || in_array($_SESSION["utilisateur"]["uid"], $array_droits)) {
                $afficher_case5 .= "<br><button id='delete' data-tab2=[" . $resultat5[0] . "," . $resultat5[7] . "," . $numeroSemaine . "]>Désinscription</button>";
            }
        }
        if ($resultat6 == null) {
            $afficher_case6 = '<button class="inscrire" id="inscrireDevant' . $i . '" data-tab=\'[3, 2, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 6]\'>Inscription</button>';
            if(in_array($_SESSION["utilisateur"]["uid"], $array_droits)){
                $afficher_case6 .= '<br><button class="choix" id="inscrireChoix' . $i . '" data-tab=\'[3, 2, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 6]\'>Choix</button>';
            }
        } else {
            $afficher_case6 =  $resultat6[2];
            if ($resultat6[7] == $_SESSION["utilisateur"]["uid"] || in_array($_SESSION["utilisateur"]["uid"], $array_droits)) {
                $afficher_case6 .= "<br><button id='delete' data-tab2=[" . $resultat6[0] . "," . $resultat6[7] . "," . $numeroSemaine . "]>Désinscription</button>";
            }
        }

        echo '<div class="jour">';
        switch ($i) {
            case 0:
                $jour_n = "Lundi";
                break;
            case 1:
                $jour_n = "Mardi";
                break;
            case 2:
                $jour_n = "Mercredi";
                break;
            case 3:
                $jour_n = "Jeudi";
                break;
            case 4:
                $jour_n = "Vendredi";
                break;
        }
        echo '<h3>' . $jour_n . " " . date('j/m', $dateActuelle) . '</h3>';
        echo '<br>';

        echo '<table>';
        echo '<tr>';
        echo '<th>Devant</th>';
        echo '<th>Derrière</th>';
        echo '</tr>';
        echo '<tr class="odd">';
        echo '<td>' . $afficher_case1 . '</td>';
        echo '<td>' . $afficher_case2 . '</td>';
        echo '</tr>';
        echo '<tr>';
        echo '<td>' . $afficher_case3 . '</td>';
        echo '<td>' . $afficher_case4 . '</td>';
        echo '</tr>';
        echo '<tr class="odd">';
        echo '<td>' . $afficher_case5 . '</td>';
        echo '<td>' . $afficher_case6 . '</td>';
        echo '</tr>';
        echo '</table>';
        echo '</div>';
        // Passez au jour suivant
        $dateActuelle = strtotime('+1 day', $dateActuelle);
    }
    echo '<script src="gestion_planning.js"></script>';
    echo '<script src="gestion_planning_admin.js"></script>';
    echo '<script src="delete_planning.js"></script>';
}

function afficherCourses($numeroSemaine, $bdd){
    // Assurez-vous que le numéro de semaine est un entier positif
    $numeroSemaine = intval($numeroSemaine);
    if ($numeroSemaine <= 0) {
        echo "Le numéro de semaine doit être un entier positif.";
        return;
    }

    setlocale(LC_TIME, 'fr_FR.utf8');

    // Obtenez la date du premier jour de l'année en cours
    $datePremierJourAnnee = strtotime(date('2024-01-01'));

    // Calcul de la date du lundi de la semaine correspondante
    $dateActuelle = strtotime("Monday this week", $datePremierJourAnnee);
    $dateActuelle = strtotime("+" . ($numeroSemaine - 1) . " weeks", $dateActuelle);

    // Boucle pour afficher les jours de la semaine
    for ($i = 0; $i < 5; $i++) {
        try {
            require_once '../../includes/database.php';
            $date_bdd = date('j/m/y', $dateActuelle);
            //var_dump($date_bdd);
            $requete1 = $bdd->prepare("SELECT * FROM planning_courses WHERE date = :date_bdd"); //requete et préparation
            $requete1->execute(
                array(
                    ":date_bdd" => $date_bdd
                )
            ); //execution de la requete
            $resultat1 = $requete1->fetch();
        } catch (Exception $e) { //en cas d'erreur
            die("Erreur : " . $e->getMessage());
        }

        $array_droits = [163, 153, 175, 150, 182, 164, 168]; //Marco, Edouard, Lucas, Victor, Jules, Aymeric, Mathys
        
        if ($resultat1 == null) {
            $afficher_case1 = '<button class="inscrire_courses" id="inscrireDevant' . $i . '" data-tab=\'[1, 1, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 1]\'>Inscription</button>';
            if(in_array($_SESSION["utilisateur"]["uid"], $array_droits)){
                $afficher_case1 .= '<br><button class="choix_courses" id="inscrireChoix' . $i . '" data-tab=\'[1, 1, "' . date('j/m/y', $dateActuelle) . '", ' . $numeroSemaine . ', 1]\'>Choix</button>';
            }
        } else {
            $afficher_case1 =  $resultat1[1];
            if ($resultat1[4] == $_SESSION["utilisateur"]["uid"] || in_array($_SESSION["utilisateur"]["uid"], $array_droits)) {
                $afficher_case1 .= "<br><button id='delete_courses' data-tab2=[" . $resultat1[0] . "," . $resultat1[4] . "," . $numeroSemaine . "]>Désinscription</button>";
            }
        }

        echo '<div class="jour">';
        switch ($i) {
            case 0:
                $jour_n = "Lundi";
                break;
            case 1:
                $jour_n = "Mardi";
                break;
            case 2:
                $jour_n = "Mercredi";
                break;
            case 3:
                $jour_n = "Jeudi";
                break;
            case 4:
                $jour_n = "Vendredi";
                break;
        }
        echo '<h3>' . $jour_n . " " . date('j/m', $dateActuelle) . '</h3>';
        echo '<br>';

        echo '<table>';
        echo '<tr class="odd">';
        echo '<td>' . $afficher_case1 . '</td>';
        echo '</tr>';
        echo '</table>';
        echo '</div>';
        // Passez au jour suivant
        $dateActuelle = strtotime('+1 day', $dateActuelle);
    }
    echo '<script src="gestion_planning_courses.js"></script>';
    echo '<script src="gestion_planning_admin_courses.js"></script>';
    echo '<script src="delete_planning_courses.js"></script>';
}