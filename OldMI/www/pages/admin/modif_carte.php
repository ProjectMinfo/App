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
    <title>Chti'MI | Modifier l'élément</title>
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

    if(isset($_GET["id"])){
        try{
            require_once '../../includes/database.php'; //connexion BDD

            //récupération dans la BDD des données liées à l'élément de la carte que l'on souhaite modifier
            $requete = $conn->prepare("SELECT * FROM carte WHERE id_carte = :id_carte"); //requete et préparation
            $requete->execute(
                array(
                    ":id_carte" => sanitize($_GET["id"])
                )
            ); //execution de la requete
            $carte_elem = $requete->fetch(); //recupération des données
        }
        catch(Exception $e){ //en cas d'erreur
            die("Erreur : " . $e->getMessage());
        }

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
    }
    ?>
    <script>
        const inputString = "<?php echo $carte_elem["ingredientsPossibles"]; ?>";
    </script>
    <br>
    <a href="gestion_carte.php" class="retour">< Retour</a>
    <div class="form-container">
        <div class="form">
            <section class="title-form"><strong>Modifier l'élément</strong></section><br>
            <form action="update_carte_elem.php" method="post" id="update_carte_elem">
                <section>
                    <label for="nom">Nom:</label>
                    <input type="text" name="nom" id="nom" value="<?php echo $carte_elem["nom"]; ?>">
                </section>
                <div id="sectionsContainer"></div>
                <a href="#" onclick="ajouterIngredient();">Ajouter un ingrédient</a>
                <section>
                    <label for="Prix">Prix:</label>
                    <input type="number" name="prix" id="prix" step="0.01" value="<?php echo $carte_elem["prix"]; ?>">
                </section>
                <section>
                    <label for="Prix serveur">Prix serveur:</label>
                    <input type="number" name="prix_serveur" id="prix_serveur" step="0.01" value="<?php echo $carte_elem["prix_serveur"]; ?>">
                </section>
                <section>
                    <label for="ref">Ref:</label>
                    <input type="text" name="ref" id="ref" value="<?php echo $carte_elem["ref"]; ?>">
                </section>
                <section>
                    <label for="label">Label:</label>
                    <input type="text" name="label" id="label" value="<?php echo $carte_elem["label"]; ?>">
                </section>
                <input type="hidden" name="id" id="id" value="<?php echo $carte_elem["id_carte"]; ?>">
                <input type="hidden" name="liste" id="liste" value="<?php echo $carte_elem["ingredientsPossibles"]; ?>">
                <input type="submit" name="Enregistrer" value="Enregistrer" class="conn">
            </form>
        </div>
    </div>
</body>
<script src="modif_carte.js"></script>
</html>