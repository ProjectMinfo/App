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
    <title>Chti'MI | Nouvelle actu</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/includes/tinymce/skins/ui/oxide/skin.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/forms.css">
</head>
<body>
    <?php
    require_once '../../includes/header.php';
    ?>
    <br>
    <a href="gestion_actus.php" class="retour">< Retour</a>
    <div class="form-container">
        <div class="form">
            <section class="title-form"><strong>Ajouter une actu</strong></section><br>
            <form action="add_actu.php" method="post" class="form_add">
                <input type="text" name="titre" id="titre" placeholder="Titre de l'actu" required>
                <textarea name="content" id="textarea-id"></textarea>
                <input type="submit" name="Ajouter" value="Ajouter" class="conn">
            </form>
        </div>
    </div>
    <?php require_once '../../includes/footer.php'; ?>
    <script src="/includes/tinymce/tinymce.min.js"></script>
    <script>
        tinymce.init({
            selector: "#textarea-id",
            plugins: "image",
            toolbar: "undo redo | bold italic | image",
            language: 'fr_FR',
            branding: false,
            promotion: false,
        });
    </script>
</body>
</html>