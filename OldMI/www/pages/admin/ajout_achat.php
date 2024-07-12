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
    <title>Chti'MI | Nouvel achat</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/forms.css">
</head>
<body>
    <?php
    require_once '../../includes/header.php';
    ?>
    <script>
        let tab_ingredients = {};
        let tab_viandes = {};
        let tab_extra = {};
        let tab_boisson_snacks = {};
        let commentaires = {}; //id_produit : commentaire
    </script>
    <br>
    <a href="achats.php" class="retour">< Retour</a>
    <div class="form-container">
        <div class="form">
            <section class="title-form"><strong>Ajouter un achat</strong></section><br>
            <form action="add_achat.php" method="post">
                <?php
                //Récupération des noms de produits enregistrés
                try{
                    require_once '../../includes/database.php'; //connexion BDD
                    //suppression de l'article dans la BDD
                    $requete = $conn->prepare("SELECT * FROM articles ORDER BY TypeIngredient"); //requete et préparation
                    $requete->execute(); //execution de la requete
                    $noms = $requete->fetchAll(); //récupération des noms
                    foreach($noms as $elem_tab){
                        $elem = $elem_tab["id_article"];
                        $nom_elem = $elem_tab["nom"];
                        echo "<script>";
                        switch($elem_tab["TypeIngredient"]){
                            case 0:
                                echo "tab_ingredients[$elem] = '$nom_elem';";
                                break;
                            case 1:
                                echo "tab_viandes[$elem] = '$nom_elem';";
                                break;
                            case 2:
                                echo "tab_extra[$elem] = '$nom_elem';";
                                break;
                            case 3:
                                echo "tab_boisson_snacks[$elem] = '$nom_elem';";
                                break;
                        }
                        $commentaire = $elem_tab["commentaire"];
                        echo "commentaires[$elem] = '$commentaire';";
                        echo "</script>";
                    }
                }
                catch(Exception $e){ //en cas d'erreur
                    die("Erreur : " . $e->getMessage());
                }
                ?>
                <select name="categorie" id="categorie" required>
                    <option value="" disabled selected="selected">Choisir le type de l'article acheté</option>
                    <option value="0">Ingrédient</option>
                    <option value="1">Viande</option>
                    <option value="2">Extra</option>
                    <option value="3">Snack/Boisson</option>
                </select>
                <select name="nom_article" id="nom_article" required>
                    <option value="" disabled selected="selected">Choisir le nom du produit</option>
                </select>
                <input type="hidden" name="id_produit" id="id_produit">
                <input type="text" name="num_lot" id="num_lot" placeholder="Numéro de lot" required>
                <input type="date" name="dlc" id="dlc" required>
                <span class="commentaire" id="commentaire">Commentaire</span>
                <input type="number" name="portions_achats" id="portions_achats" placeholder="Quantité de l'article (en portions)" required>
                <label for="duplicate">Dupliquer l'achat:</label>
                <input type="number" name="duplicate" id="duplicate" placeholder="Dupliquer cet achat" value="1">
                <input type="submit" name="Enregistrer" value="Enregistrer" class="conn">
            </form>
        </div>
    </div>
    <?php
    require_once '../../includes/footer.php';
    ?>
</body>
<script src="achats.js"></script>
</html>