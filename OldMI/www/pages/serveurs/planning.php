<?php

session_start(); //démarrage de la session
require_once "../../includes/functions.php"; //importation des fonctions
require_once "fct_planning.php"; //importation des fonctions du planning
require_once "../../includes/database.php";
areSetCookies(); //création de la session si cookies existent

if (!isConnected()) {
    header("Location: ../index.php");
    exit();
} elseif (!isServeur($conn, $_SESSION["utilisateur"]["uid"])) {
    header("Location: ../index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <title>Chti'MI | Planning serveurs</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/planning.css">
</head>

<body>
    <?php require_once '../../includes/header.php'; ?>
    <br>
    <hr>
    <br>
    <div class="recherche">
        <section>
            <?php 
                $weekNumber = date('W');
                $jourDeLaSemaine = date("l");
                if ($jourDeLaSemaine == "Saturday" || $jourDeLaSemaine == "Sunday") {
                    $weekNumber++;
                }
            ?>
            <label for="current_week">Semaine de service : <?php echo $weekNumber; ?></label>
            <input type="hidden" name="semaine_actuelle" id="semaine_actuelle" value="<?php echo $weekNumber; ?>">
            <button id="recherche_semaine_act">Voir la semaine en cours</button>
        </section>
        <section>
            <label for="recherche_semaine">Semaine:</label>
            <select name="recherche_semaine" id="recherche_semaine">
                <?php
                for ($i = $weekNumber; $i <= 26; $i++) {
                    echo "<option value='$i'>Semaine $i</option>";
                }
                echo '<script>var id_serveur = ' . $_SESSION["utilisateur"]["uid"] . '</script>';
                ?>
            </select>
            <button id="Recherche">Aller à</button>
            <?php 
                $array_droits = [163, 153, 175, 150, 182, 164, 168]; //Marco, Edouard, Lucas, Victor, Jules, Aymeric, Mathys
                if(in_array($_SESSION["utilisateur"]["uid"], $array_droits)){
            ?>
            <form action="generatePDF.php" method="post">
                <input type="submit" id="PDF" name="PDF" value="Historique des services">
            </form>
            <?php
                }
            ?>
        </section>
    </div>
    <span style="text-align: center; color: red;">Attention, désormais la semaine suivante apparaît dès le samedi sur le planning</span>
    <hr>
    <br>
    <div class="day-container" id="content">
        <?php afficherSemaine($weekNumber, $conn); ?>
    </div>
    <?php if(isAdmin($conn, $_SESSION["utilisateur"]["uid"])){ ?>
    <br>
    <h3 style="text-align: center;">Courses Match</h3>
    <div class="courses-match" id="content2">
        <?php afficherCourses($weekNumber, $conn); ?>
    </div>
    <?php } ?>
    <?php require_once '../../includes/footer.php'; ?>
    <?php
    try{
        require_once '../../includes/database.php'; //connexion BDD

        //récupération des serveurs
        $requete = $conn->prepare("SELECT * FROM comptes WHERE acces = 1 OR acces = 2 ORDER BY nom");
        $requete->execute();
        $serveurs = $requete->fetchAll();
        $serveurs = json_encode($serveurs);
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
    ?>
    <script>
        var serveurs = <?php echo $serveurs ?>;
    </script>
    <script src="/assets/js/jquery.min.js"></script>
    <script src="planning.js"></script>
</body>

</html>