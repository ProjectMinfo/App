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
    <title>Chti'MI | Modifier l'article</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/forms.css">
</head>
<body>
    <?php
    require_once '../../includes/header.php';

    if(isset($_GET["id"])){
        try{
            require_once '../../includes/database.php'; //connexion BDD

            //récupération dans la BDD
            $requete = $conn->prepare("SELECT * FROM articles WHERE id_article = :id_article"); //requete et préparation
            $requete->execute(
                array(":id_article" => $_GET["id"])
            ); //execution de la requete
            $article = $requete->fetch(); //recupération des données
        }
        catch(Exception $e){ //en cas d'erreur
            die("Erreur : " . $e->getMessage());
        }
    }
    ?>
    <br>
    <a href="gestion_stock.php" class="retour">< Retour</a>
    <div class="form-container">
        <div class="form">
            <section class="title-form"><strong>Modifier l'article</strong></section><br>
            <form action="update_article.php" method="post">
                <input type="text" name="nom" id="nom" value="<?php echo $article["nom"]; ?>">
                <input type="number" name="qte" id="qte" value="<?php echo $article["qte"]; ?>">
                <input type="hidden" name="id" id="id" value="<?php echo $article["id_article"]; ?>">
                <section>
                    Type de l'article:
                    <select name="categorie" id="categorie" required>
                        <option value="0" <?php if($article["TypeIngredient"] == 0){ echo 'selected="selected"'; } ?>>Ingrédient</option>
                        <option value="1" <?php if($article["TypeIngredient"] == 1){ echo 'selected="selected"'; } ?>>Viande</option>
                        <option value="2" <?php if($article["TypeIngredient"] == 2){ echo 'selected="selected"'; } ?>>Extra</option>
                        <option value="3" <?php if($article["TypeIngredient"] == 3){ echo 'selected="selected"'; } ?>>Snack/Boisson</option>
                    </select>
                </section>
                <input type="text" name="commentaire" id="commentaire" placeholder="Commentaire (optionnel)" value="<?php echo $article["commentaire"]; ?>">
                <input type="submit" name="Enregistrer" value="Enregistrer" class="conn">
            </form>
        </div>
    </div>
    <?php
    require_once '../../includes/footer.php';
    ?>
</body>
</html>