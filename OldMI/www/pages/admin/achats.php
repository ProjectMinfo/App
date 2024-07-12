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
    <title>Chti'MI | Achats</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/achats.css">
    <title>Chti'MI | Achats</title>
</head>
<body>
    <?php
    require_once '../../includes/header.php';
    require_once '../../includes/admin_panel.php'
    ?>
    <br><hr>
    <br>
    <div class="recherche">
        <a href="ajout_achat.php">Ajouter un achat</a>
        <input type="text" id="recherche_lot" placeholder="Rechercher par article/numéro de lot">
        <label for="checkboxHideClose">Afficher les fermés</label>
        <input type="checkbox" id="checkboxHideClose" name="checkboxHideClose" checked>
    </div>
    <br><hr>
    <div class="achats-container">
        <table>
            <tr class="titre-tab">
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Numéro de lot</th>
                <th>Quantité</th>
                <th>Date d'ouverture</th>
                <th>Date de fermeture</th>
                <th>Date limite de consommation</th>
                <th>État</th>
                <th>Actions</th>
            </tr>
        <?php
        try{
            require_once '../../includes/database.php'; //connexion BDD

            //récupération dans la BDD des achats
            $requete = $conn->prepare("SELECT * FROM achats ORDER BY dlc DESC"); //requete et préparation
            $requete->execute(); //execution de la requete
            $achats = $requete->fetchAll(); //recupération des données
            $previous = 1;

            //affichage sur la page
            foreach($achats as $achat){
                $achat_id = $achat["id_achat"];
                $article_id = $achat["id_produit"];
                $article_name = $achat["nom_article"];
                $nb_portions = $achat["nb_portions"];
                $categorie = $achat["categorie"];
                $num_lot = $achat["num_lot"];
                $achat_qte = $achat["nb_portions"];
                $date_ouv = $achat["date_ouverture"];
                $date_ferm = $achat["date_fermeture"];
                $dlc = $achat["dlc"];
                $etat = $achat["etat"];
                $nb_perime = $achat["qte_perimee"];

                //définition de la catégorie
                if($categorie == 0){
                    $categorie = "Ingrédient";
                }
                else if($categorie == 1){
                    $categorie = "Viande";
                }
                else if($categorie == 2){
                    $categorie = "Extra";
                }
                else if($categorie == 3){
                    $categorie = "Snack/Boisson";
                }

                //permet d'éviter les doublons je crois
                if($previous == 1){
                    echo "<tr class='achat odd'>";
                    $previous = 0;
                }
                else{
                    echo "<tr class='achat'>";
                    $previous = 1;
                }
                echo "<td class='nom'>$article_name</td>";
                echo "<td>$categorie</td>";
                echo "<td class='num_lot'>$num_lot</td>";
                echo "<td>$achat_qte</td>";
                echo "<td>";
                if($date_ouv == null){
                    echo "NR";
                }
                else{
                    echo $date_ouv;
                }
                echo "</td>";
                echo "<td>";
                if($date_ferm == null){
                    echo "NR";
                }
                else{
                    echo $date_ferm;
                }
                echo "</td>";
                if(estPerime($dlc)){
                    echo "<td style='color: red;'>";
                }
                else{
                    echo "<td style='color: green;'>";
                }
                echo "$dlc</td>";
                echo "<td>";
                switch($etat){
                    case 0:
                        echo "Non entamé";
                        break;
                    case 1:
                        echo "Ouvert";
                        break;
                    case 2:
                        echo "Fermé";
                        break;
                    case 3:
                        echo "Périmé";
                        break;
                    case 4:
                        echo "$nb_perime/$nb_portions périmées";
                        break;
                }
                echo "</td>";
                echo "<td><span class='action'>";
                if($etat == 0){
                    echo "<a href='open_achat.php?id=$achat_id' title='Ouvrir'><img src='/assets/svg/box-open-solid.svg' class='open'></a>";
                    echo "<a href='perime_achat_interface.php?id=$achat_id&id_produit=$article_id&portions=$nb_portions&qte_perime=$nb_perime' title='Déclarer comme périmé'><img src='/assets/svg/skull-crossbones-solid.svg' class='warning'></a>";
                }
                else if($etat == 1){
                    echo "<a href='close_achat.php?id=$achat_id&id_produit=$article_id&portions=$nb_portions&already_del=$nb_perime' title='Fermer'><img src='/assets/svg/box-solid.svg' class='close'></a>";
                    echo "<a href='perime_achat_interface.php?id=$achat_id&id_produit=$article_id&portions=$nb_portions&qte_perime=$nb_perime' title='Déclarer comme périmé'><img src='/assets/svg/skull-crossbones-solid.svg' class='warning'></a>";
                }
                echo "<a href='modif_achat.php?id=$achat_id' title='Modifier'><img src='/assets/svg/pen-to-square-solid.svg' class='edit'></a>";
                echo "<a onclick='validate_achat_deletion($achat_id, $article_id, $nb_portions, $etat, $nb_perime)'><img src='/assets/svg/trash-solid.svg' class='delete'></a>";
                echo "</span></td>";
                echo "</tr>";
            }
        }
        catch(Exception $e){ //en cas d'erreur
            die("Erreur : " . $e->getMessage());
        }
        ?>
        </table>
    </div>
    <?php require_once '../../includes/footer.php'; ?>
    <script src="chercher_achat.js"></script>
    <script src="gestion_achats_suppress.js"></script>
</body>
</html>