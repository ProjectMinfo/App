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
    <title>Chti'MI | Modifier l'achat</title>
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

            //récupération dans la BDD des données liées à l'achat que l'on souhaite modifier
            $requete = $conn->prepare("SELECT * FROM achats WHERE id_achat = :id_achat"); //requete et préparation
            $requete->execute(
                array(":id_achat" => $_GET["id"])
            ); //execution de la requete
            $achat = $requete->fetch(); //recupération des données
        }
        catch(Exception $e){ //en cas d'erreur
            die("Erreur : " . $e->getMessage());
        }
    }
    ?>
    <br>
    <a href="achats.php" class="retour">< Retour</a>
    <div class="form-container">
        <div class="form">
            <section class="title-form"><strong>Modifier l'achat</strong></section><br>
            <form action="update_achat.php" method="post">
                <label>Modifier le lot <span style="color: cornflowerblue;"><?php echo $achat["num_lot"]; ?></span></label>
                <input type="text" name="num_lot" id="num_lot" placeholder="Numéro de lot" value="<?php echo $achat["num_lot"]; ?>" required>
                <input type="date" name="dlc" id="dlc" value="<?php echo $achat["dlc"]; ?>" required>
                <input type="number" name="portions_achats" id="portions_achats" placeholder="Quantité de l'article (en portions)" value="<?php echo $achat["nb_portions"]; ?>" required>
                <input type="hidden" name="portions_achats_old" id="portions_achats_old" value="<?php echo $achat["nb_portions"]; ?>" required>
                <label for="date_ouverture">Date d'ouverture (laisser vide si non ouvert)</label>
                <input type="date" name="date_ouverture" id="date_ouverture" value="<?php echo $achat["date_ouverture"]; ?>">
                <label for="date_fermeture">Date de fermeture (laisser vide si non fini)</label>
                <input type="date" name="date_fermeture" id="date_fermeture"  value="<?php echo $achat["date_fermeture"]; ?>">
                <input type="hidden" name="id" id="id" value="<?php echo $achat["id_achat"]; ?>">
                <input type="hidden" name="id_produit" id="id_produit" value="<?php echo $achat["id_produit"]; ?>">
                <input type="submit" name="Enregistrer" value="Enregistrer" class="conn">
            </form>
        </div>
    </div>
</body>
</html>