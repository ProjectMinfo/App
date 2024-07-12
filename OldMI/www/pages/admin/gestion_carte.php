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
    <title>Chti'MI | Modification de la carte</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/gestion_carte.css">
</head>
<body>
    <?php
    require_once '../../includes/header.php';
    require_once '../../includes/admin_panel.php'
    ?>
    <br><hr>
    <br>
    <div class="recherche">
        <a href="ajout_carte_elem.php">Ajouter un élément à la carte</a>
        <input type="text" id="recherche_elem" placeholder="Rechercher un élément">
    </div>
    <br><hr>
    <div class="gestion-container">
        <table>
            <tr>
                <th>Nom</th>
                <th>Type</th>
                <th>Prix</th>
                <th>Prix serveur</th>
                <th>Ref</th>
                <th>Label</th>
                <th>Actions</th>
            </tr>
        <?php
        try{
            require_once '../../includes/database.php'; //connexion BDD

            //récupération dans la BDD des achats
            $requete = $conn->prepare("SELECT * FROM carte ORDER BY typePlat"); //requete et préparation
            $requete->execute(); //execution de la requete
            $carte_elems = $requete->fetchAll(); //recupération des données
            $previous = 1;
        }
        catch(Exception $e){ //en cas d'erreur
            die("Erreur : " . $e->getMessage());
        }
        ?>
        <?php
        foreach($carte_elems as $carte_elem){
            $id_carte = $carte_elem["id_carte"];
            //on determine le type de l'élément
            switch($carte_elem["typePlat"]){
                case 0:
                    $typeplat = "Plat Principal";
                    break;
                case 1:
                    $typeplat = "Snack";
                    break;
                case 2:
                    $typeplat = "Boisson";
                    break;
                case 3:
                    $typeplat = "Menu";
                    break;
            }

            if($previous == 1){
                echo "<tr class='elem_carte odd'>";
                $previous = 0;
            }
            else{
                echo "<tr class='elem_carte'>";
                $previous = 1;
            }
            echo "<td class='elem_nom'>".$carte_elem["nom"]."</td>";
            echo "<td>".$typeplat."</td>";
            echo "<td>".$carte_elem["prix"]."</td>";
            echo "<td>".$carte_elem["prix_serveur"]."</td>";
            echo "<td>".$carte_elem["ref"]."</td>";
            echo "<td>".$carte_elem["label"]."</td>";
            echo "<td><span class='action'>";
            echo "<a href='modif_carte.php?id=$id_carte' title='Modifier élément'><img src='/assets/svg/pen-to-square-solid.svg' class='open'></a>";
            echo "<a href='delete_elem_carte.php?id=$id_carte' title='Supprimer élément'><img src='/assets/svg/trash-solid.svg' class='open'></a>";
            echo "</span></td>";
            echo "</tr>";
        }
        ?>
        </table>
    </div>
    <br>
    <?php
    require_once '../../includes/footer.php';
    ?>
</body>
<script src="chercher_carte.js"></script>
</html>