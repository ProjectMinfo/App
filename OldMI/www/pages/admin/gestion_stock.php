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
    <title>Chti'MI | Gestion des stock</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/gestion_stock.css">
</head>
<body>
    <?php
    require_once '../../includes/header.php';
    require_once '../../includes/admin_panel.php'
    ?>
    <br><hr>
    <br>
    <div class="recherche">
        <a href="ajout_stock.php">Ajouter un élément</a>
        <input type="text" id="recherche_nom" placeholder="Rechercher par article">
    </div>
    <br><hr>
    <br>
    <div class="donnees">
        <div class="ingredients" id="ingredients">
            <caption><h3>Ingrédients</h3></caption>
            <table>
        <?php
        try{
            require_once '../../includes/database.php'; //connexion BDD

            //récupération dans la BDD des articles
            $requete = $conn->prepare("SELECT * FROM articles WHERE TypeIngredient = 0"); //requete et préparation
            $requete->execute(); //execution de la requete
            $articles = $requete->fetchAll(); //recupération des données
            $previous = 1;

            //affichage sur la page
            foreach($articles as $article){
                $article_id = $article["id_article"];
                $article_name = $article["nom"];
                $article_qte = $article["qte"];
                if($previous == 1){
                    echo "<tr class='article odd'>";
                    $previous = 0;
                }
                else{
                    echo "<tr class='article'>";
                    $previous = 1;
                }
                echo "<td class='nom'>$article_name</td>";
                echo "<td>$article_qte</td>";
                echo "<td><span class='action'>";
                echo "<a href='modif_article.php?id=$article_id'><img src='/assets/svg/pen-to-square-solid.svg' class='edit'></a>";
                echo "<a onclick='validate_stock_deletion($article_id)'><img src='/assets/svg/trash-solid.svg' class='delete'></a>";
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
        <div class="viande" id="viande">
            <caption><h3>Viandes</h3></caption>
            <table>
        <?php
        try{
            require_once '../../includes/database.php'; //connexion BDD

            //récupération dans la BDD des articles
            $requete = $conn->prepare("SELECT * FROM articles WHERE TypeIngredient = 1"); //requete et préparation
            $requete->execute(); //execution de la requete
            $articles = $requete->fetchAll(); //recupération des données
            $previous = 1;

            //affichage sur la page
            foreach($articles as $article){
                $article_id = $article["id_article"];
                $article_name = $article["nom"];
                $article_qte = $article["qte"];
                if($previous == 1){
                    echo "<tr class='article odd'>";
                    $previous = 0;
                }
                else{
                    echo "<tr class='article'>";
                    $previous = 1;
                }
                echo "<td class='nom'>$article_name</td>";
                echo "<td>$article_qte</td>";
                echo "<td><span class='action'>";
                echo "<a href='modif_article.php?id=$article_id'><img src='../../assets/svg/pen-to-square-solid.svg' class='edit'></a>";
                echo "<a onclick='validate_stock_deletion($article_id)'><img src='../../assets/svg/trash-solid.svg' class='delete'></a>";
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
        <div class="extra" id="extra">
            <caption><h3>Extras</h3></caption>
            <table>
         <?php
        try{
            require_once '../../includes/database.php'; //connexion BDD

            //récupération dans la BDD des articles
            $requete = $conn->prepare("SELECT * FROM articles WHERE TypeIngredient = 2"); //requete et préparation
            $requete->execute(); //execution de la requete
            $articles = $requete->fetchAll(); //recupération des données
            $previous = 1;

            //affichage sur la page
            foreach($articles as $article){
                $article_id = $article["id_article"];
                $article_name = $article["nom"];
                $article_qte = $article["qte"];
                if($previous == 1){
                    echo "<tr class='article odd'>";
                    $previous = 0;
                }
                else{
                    echo "<tr class='article'>";
                    $previous = 1;
                }
                echo "<td class='nom'>$article_name</td>";
                echo "<td>$article_qte</td>";
                echo "<td><span class='action'>";
                echo "<a href='modif_article.php?id=$article_id'><img src='../../assets/svg/pen-to-square-solid.svg' class='edit'></a>";
                echo "<a onclick='validate_stock_deletion($article_id)'><img src='../../assets/svg/trash-solid.svg' class='delete'></a>";
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
        <div class="boisson-snack" id="boisson">
            <caption><h3>Boissons/Snacks</h3></caption>
            <table>
        <?php
        try{
            require_once '../../includes/database.php'; //connexion BDD

            //récupération dans la BDD des articles
            $requete = $conn->prepare("SELECT * FROM articles WHERE TypeIngredient = 3"); //requete et préparation
            $requete->execute(); //execution de la requete
            $articles = $requete->fetchAll(); //recupération des données
            $previous = 1;

            //affichage sur la page
            foreach($articles as $article){
                $article_id = $article["id_article"];
                $article_name = $article["nom"];
                $article_qte = $article["qte"];
                if($previous == 1){
                    echo "<tr class='article odd'>";
                    $previous = 0;
                }
                else{
                    echo "<tr class='article'>";
                    $previous = 1;
                }
                echo "<td class='nom'>$article_name</td>";
                echo "<td>$article_qte</td>";
                echo "<td><span class='action'>";
                echo "<a href='modif_article.php?id=$article_id'><img src='../../assets/svg/pen-to-square-solid.svg' class='edit'></a>";
                echo "<a onclick='validate_stock_deletion($article_id)'><img src='../../assets/svg/trash-solid.svg' class='delete'></a>";
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
    </div>
    <?php
    require_once '../../includes/footer.php';
    ?>
    <style>
        /* Style de la popup */
        .popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            text-align: center;
        }

        /* Style pour les liens de confirmation et d'annulation */
        .popup a {
            display: inline-block;
            margin: 10px;
            padding: 10px 20px;
            text-decoration: none;
            background-color: #FF3547;
            color: white;
            border-radius: 5px;
            cursor: pointer;
        }

        /* Style pour le lien d'annulation */
        .popup a#cancelDelete {
            background-color: #007BFF;
        }
    </style>
</body>
<script src="chercher_stock.js"></script>
<script src="gestion_stock_suppress.js"></script>
</html>