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
    <title>Chti'MI | Déclarer un lot comme périmé</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/forms.css">
</head>
<body>
    <?php
    require_once '../../includes/header.php';
    ?>
    <br>
    <a href="achats.php" class="retour">< Retour</a>
    <div class="form-container">
        <div class="form">
            <section class="title-form"><strong>Indiquer la quantité périmée</strong></section>
            <span>Laisser tel quel si le lot entier est périmé</span><br><br>
            <form action="perime_achat.php" method="post">
                <?php
                if(isset($_GET["id"])){
                    $achat_id = sanitize($_GET["id"]);
                    $id_produit = sanitize($_GET["id_produit"]);
                    $nb_portions = sanitize($_GET["portions"]);
                    $nb_perime = sanitize($_GET["qte_perime"]);
                }
                ?>
                <input type="hidden" name="achat_id" value="<?php echo $achat_id; ?>">
                <input type="hidden" name="id_produit" value="<?php echo $id_produit; ?>">
                <input type="number" name="nb_portions" id="nb_portions" value="<?php echo $nb_portions; ?>" min="0" max="<?php echo $nb_portions; ?>">
                <input type="hidden" name="nb_portions_total" id="nb_portions_total" value="<?php echo $nb_portions; ?>">
                <input type="hidden" name="nb_portions_old" id="nb_portions_old" value="<?php echo $nb_portions; ?>">
                <input type="hidden" name="nb_portions_perime" id="nb_portions_perime" value="<?php echo $nb_perime; ?>">
                <input type="submit" name="Declare" value="Périmé" class="conn">
            </form>
        </div>
    </div>
    <?php
    require_once '../../includes/footer.php';
    ?>
</body>
<script src="achats.js"></script>
</html>