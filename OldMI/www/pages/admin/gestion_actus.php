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
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-witdh, initial-scale=1, maximum-scale=1">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <title>Chti'MI | Gestion Actus</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/gestion_actus.css">
</head>
<body>
    <?php
    require_once '../../includes/header.php';
    require_once '../../includes/admin_panel.php'
    ?>
    <br><hr>
    <br>
    <div class="recherche">
        <a href="ajout_actu.php">Ajouter une actu</a>
        <input type="text" id="" placeholder="Rechercher une actu">
    </div>
    <br><hr>
    <div class="gestion-container">
        <table>
            <tr>
                <th>Titre</th>
                <th>Action</th>
            </tr>
        <?php
        try{
            require_once '../../includes/database.php'; //connexion BDD

            //récupération dans la BDD des achats
            $requete = $conn->prepare("SELECT * FROM actus ORDER BY id_actu DESC"); //requete et préparation
            $requete->execute(); //execution de la requete
            $actus = $requete->fetchAll(); //recupération des données
            $previous = 1;
        }
        catch(Exception $e) { //en cas d'erreur
            die("Erreur : " . $e->getMessage());
        }
        ?>
        <?php
        foreach ($actus as $actu) {
            $id_actu = $actu["id_actu"];

            if ($previous == 1) {
                echo "<tr class='actu odd'>";
                $previous = 0;
            } else {
                echo "<tr class='actu'>";
                $previous = 1;
            }
            echo "<td class='titre'>".$actu["titre"]."</td>";
            echo "<td><span class='action'>";
            echo "<a href='modif_actu.php?id=$id_actu' title='Modifier élément'><img src='/assets/svg/pen-to-square-solid.svg' class='edit'/></a>";
            echo "<a href='delete_actu.php?id=$id_actu' title='Supprimer élément'><img src='/assets/svg/trash-solid.svg' class='delete'/></a>";
            echo "</span></td>";
            echo "</tr>";
        }
        ?>
        </table>
    </div>
    <br>
    <?php require_once '../../includes/footer.php'; ?>
</body>
</html>