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
    <title>Chti'MI | Nouvel élément</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/forms.css">
</head>
<body>
    <script>
        let tab_ingredients = {};
    </script>
    <?php
    require_once '../../includes/header.php';
    ?>
    <?php
    //on récupère le nom des ingrédients disponibles et leur id
    try{
        require_once '../../includes/database.php'; //connexion BDD
        //suppression de l'article dans la BDD
        $requete = $conn->prepare("SELECT * FROM articles"); //requete et préparation
        $requete->execute(); //execution de la requete
        $noms = $requete->fetchAll(); //récupération des noms
        foreach($noms as $elem_tab){
            $elem = $elem_tab["id_article"];
            $nom_elem = $elem_tab["nom"];
            echo "<script>";
            echo "tab_ingredients[$elem] = '$nom_elem';";
            echo "</script>";
        }
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
    ?>
    <br>
    <a href="gestion_carte.php" class="retour">< Retour</a>
    <div class="form-container", id="ajoutelemCarte">
        <div class="form">
            <section class="title-form"><strong>Ajouter un élément</strong></section><br>
            <form action="add_carte_elem.php" method="post" id="add_elem">
                <select name="categorie" id="categorie">
                    <option value="" disabled selected="selected">Choisir le type de l'élément</option>
                    <option value="0">Plat</option>
                    <option value="1">Snack</option>
                    <option value="2">Boisson</option>
                    <option value="3">Menu</option>
                </select>
                <section>
                    Nom:
                    <input type="text" name="nom_elem" id="nom_elem" required>
                </section>
                <label for="ingredients_pos">Ingrédients:</label>
                <div id="sectionsContainer">
                    <section class="ingredients_pos">
                        <select name="article" id="article" required>
                            <option selected disabled>Ingrédient</option>
                            <?php
                            foreach($noms as $nom){
                                echo "<option value='".$nom["id_article"]."'>".$nom["nom"]."</option>";
                            }
                            ?>
                        </select>
                        <select name="qte" id="qte" required>
                            <option selected disabled>Quantité</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                        <select name="defaut" id="defaut" required>
                            <option value="0" selected>Choix libre</option>
                            <option value="1">Par défaut</option>
                            <option value="2">Obligatoire</option>
                        </select>
                    </section>
                </div>
                <a href="#" onclick="ajouterIngredient();">Ajouter un ingrédient</a>
                <section>
                    <label for="prix">Prix:</label>
                    <input type="number" name="prix" id="prix" step="0.01" required>
                </section>
                <section>
                    <label for="prix_serveur">Prix serveur:</label>
                    <input type="number" name="prix_serveur" id="prix_serveur" step="0.01" required>
                </section>
                <section>
                    <label for="ref">Ref:</label>
                    <input type="text" name="ref" id="ref" required>
                </section>
                <section>
                    <label for="label">Label:</label>
                    <input type="text" name="label" id="label" required>
                </section>
                <input type="hidden" name="liste" id="liste">
                <input type="submit" name="Enregistrer" value="Enregistrer" class="conn">
            </form>
        </div>
    </div>
    <?php
    require_once '../../includes/footer.php';
    ?>
</body>
<script src="ajout_carte_elem.js"></script>
</html>