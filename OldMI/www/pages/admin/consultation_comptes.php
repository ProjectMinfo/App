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
    <title>Chti'MI | Gestion des comptes</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/consultation_comptes.css">
</head>
<body>
    <?php
    require_once '../../includes/header.php';
    require_once '../../includes/admin_panel.php'
    ?>
    <br><hr>
    <br>
    <div class="recherche">
        <span>Rechercher un utilisateur :</span>
        <input type="text" id="recherche_num_compte" placeholder="Rechercher par nom/prénom/numéro">
    </div>
    <br><hr>
    <div class="comptes-container">
        <?php
        try{
            require_once '../../includes/database.php'; //connexion BDD

            //récupération dans la BDD des comptes
            $requete = $conn->prepare("SELECT * FROM comptes ORDER BY nom ASC"); //requete et préparation (affichage par odre alphabétique)
            $requete->execute(); //execution de la requete
            $accounts = $requete->fetchAll(); //recupération des données
            $previous = 1;
        }
        catch(Exception $e){ //en cas d'erreur
            die("Erreur : " . $e->getMessage());
        }
        ?>
        <table id="LstComptes">
            <tr>
                <th>Identifiant</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Solde</th>
                <th>Accès</th>
                <th>Modifier</th>
            </tr>
            <?php
                foreach($accounts as $elem){
                    if($previous == 1){
                        echo "<tr class='num_compte odd'>";
                        $previous = 0;
                    }
                    else{
                        echo "<tr class='num_compte'>";
                        $previous = 1;
                    }
                    echo "<td>".$elem["num_compte"]."</td>";
                    echo "<td>".$elem["nom"]."</td>";
                    echo "<td>".$elem["prenom"]."</td>";
                    if($elem["montant"] <= 0){
                        echo "<td class='negatif'>".$elem["montant"]."€</td>";
                    }
                    elseif($elem["montant"] < 3.30){
                        echo "<td class='limite'>".$elem["montant"]."€</td>";
                    }
                    else{
                        echo "<td class='positif'>".$elem["montant"]."€</td>";
                    }
    
                    switch($elem["acces"]){
                        case "0":
                            $Info = "User";
                            break;
                        case "1":
                            $Info = "Serveur";
                            break;
                        case "2":
                            $Info = "Admin";
                            break;
                    }
                    echo "<td>".$Info."</td>";
                    echo '<td><span class="action"><a href="modif_compte.php?id=' . $elem["id_compte"] . '"><img src="/assets/svg/user-pen-solid.svg" class="warning"/></a></span></td>';
                    echo "</tr>";
                }
            ?>
        </table>
    </div>
    <?php
    require_once '../../includes/footer.php';
    ?>
</body>
<script src="chercher.js"></script>
</html>