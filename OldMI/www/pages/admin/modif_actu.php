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
    <title>Chti'MI | Modifier l'actu</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/includes/tinymce/skins/ui/oxide/skin.min.css">
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
            $requete = $conn->prepare("SELECT * FROM actus WHERE id_actu = :id_actu"); //requete et préparation
            $requete->execute(
                array(":id_actu" => $_GET["id"])
            ); //execution de la requete
            $actu = $requete->fetch(); //recupération des données
        }
        catch(Exception $e){ //en cas d'erreur
            die("Erreur : " . $e->getMessage());
        }
    }
    ?>
    <br>
    <a href="gestion_actus.php" class="retour">< Retour</a>
    <div class="form-container">
        <div class="form">
            <section class="title-form"><strong>Modifier l'actu</strong></section><br>
            <form action="update_actu.php" method="post">
                <input type="text" name="titre" id="titre" value="<?php echo $actu["titre"]; ?>">
                <textarea name="content" id="textarea-id"><?php echo $actu["content"]; ?></textarea>
                <input type="hidden" name="id" id="id" value="<?php echo $actu["id_actu"]; ?>">
                <input type="submit" name="Enregistrer" value="Enregistrer" class="conn">
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