<?php
session_start();
require_once('../../includes/functions.php');
areSetCookies();

if (isset($_POST['envoyer'])) {

    $nom = $_SESSION["utilisateur"]['prenom'] . ' ' . $_SESSION["utilisateur"]['nom'];

    if (!isset($_POST['commandeWrite'])) {
        header('Location:choosePlat.php');
        die();
    }
    $commandeList = explode(";", sanitize($_POST['commandeWrite']));

    $commande_out = $commandeList[1];
    $commande_in = $commandeList[0];
    $prix = round(floatval($_POST['Prix']), 1);

    if (!isset($_POST['moyenPaiment'])) {
        $moyenPaiment = 3;
    } else {
        $moyenPaiment = intval($_POST['moyenPaiment']);
    }

    $stock = sanitize($_POST['ingredientsCommande']);
    $menu = intval($_POST['menu']);

    if (isset($commandeList[2])) {
        $commentaire = $commandeList[2];
    } else {
        $commentaire = "";
    }

    $numCompte = NULL;

    if ($moyenPaiment == 2) {
        $numCompte = $_SESSION["utilisateur"]['id'];
    }

    $SQL = 'INSERT INTO commandes(num_transaction, nom , commande_out , commande_in , prix , typepaiement , etat , stock , menu , commentaire , num_compte) VALUES (0,?,?,?,?,?,0,?,?,?,?)';
    $stmt = $conn->prepare($SQL);

    if ($stmt->execute(array($nom, $commande_out, $commande_in, $prix, $moyenPaiment, $stock, $menu, $commentaire, $numCompte))) {
        $insert = true;
    } else {
        $insert = false;
    }
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chti'MI | Commande validée</title>
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/commandeUser/validate.css">
</head>

<body>
    <?php require_once '../../includes/header.php'; ?>
    <div class="MentionsMainDiv">
        <div>
            <?php
            if ($insert) {
                echo "<p>Votre commande a été passée avec succès ! Rendez vous au comptoir pour lancer la préparation de votre commande !</p>";
                echo "<a href='profil.php'>Retour à mon profil</a>";
            } else {
                echo "<p>Une erreur s'est produite, merci de réessayer plus tard ou de passer commande directement au comptoir.</p>";
                echo "<a href='commander.php'>Retour au choix du menu</a>";
            }
            ?>
        </div>
    </div>
    <?php require_once '../../includes/footer.php'; ?>
</body>

</html>