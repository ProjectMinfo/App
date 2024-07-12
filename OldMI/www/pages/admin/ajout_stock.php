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
    <title>Chti'MI | Ajout élément</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/gestion_stock.css">
    <link rel="stylesheet" href="/assets/css/forms.css">
</head>
<body>
    <?php
    require_once '../../includes/header.php';
    ?>
    <br>
    <a href="gestion_stock.php" class="retour">< Retour</a>
    <div class="form-container">
        <div class="form">
            <section class="title-form"><strong>Ajouter un article</strong></section><br>
            <form action="add_article.php" method="post" class="form_add">
                <input type="text" name="nom_article" id="nom_article" placeholder="Nom de l'article" required>
                <select name="article_type" id="article_type" required>
                    <option value="" disabled selected="selected">Choisir le type d'article</option>
                    <option value="0">Ingrédient</option>
                    <option value="1">Viande</option>
                    <option value="2">Extra</option>
                    <option value="3">Snack/Boisson</option>
                </select>
                <input type="number" name="qte_article" id="qte_article" placeholder="Quantité de l'article" required>
                <input type="text" name="commentaire" id="commentaire" placeholder="Commentaire (optionel)">
                <input type="submit" name="Ajouter" value="Ajouter" class="conn">
            </form>
        </div>
    </div>
</body>
</html>