<?php
session_start();
require_once '../../includes/functions.php';

$errorMessages = [
    "incorrect_credentials" => "L'adresse mail et/ou le mot de passe sont incorrects.",
    "no_password_set" => "Merci de réinitialiser votre mot de passe pour vous connecter.",
    "invalid_reset" => "Le lien de réinitialisation du mot de passe que vous avez entré est incorrect.",
];

$successMessages = [
    "link_sent" => "Un lien pour réinitialiser votre mot de passe vous a été envoyé par mail.",
    "pwd_changed" => "Votre mot de passe a bien été modifié, vous pouvez dès à présent vous connecter.",
    "account_deleted" => "Votre compte a bien été supprimé.",
];

if (isConnected()) {
    header("Location: ../pages/user/profil.php");
    exit();
} elseif (isset($_GET["error"])) {
    $errorMessage = $errorMessages[$_GET["error"]] ?? "Une erreur inconnue s'est produite.";
} elseif (isset($_GET["success"])) {
    $successMessage = $successMessages[$_GET["success"]] ?? "";
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <title>Chti'MI | Connexion</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/inscription_connexion.css">
</head>

<body>
    <?php require_once '../../includes/header.php'; ?>
    <div class="form-container">
        <div class="form">
            <section class="title-form">
                <h3>Connexion</h3>
            </section>
            <br>
            <form action="script_connexion.php" method="post">
                <input type="email" name="email" id="email" placeholder="Adresse mail">
                <input type="password" name="mdp" id="mdp" placeholder="Mot de passe">
                <input type="submit" value="Se connecter" name="signin" class="conn">
                <?php
                if (isset($_GET["error"])) {
                    echo "<div class='error'>" . $errorMessage . "</div>";
                } elseif (isset($_GET["success"])) {
                    echo "<div class='success' style='color: green;'>" . $successMessage . "</div>";
                }
                ?>
                <a href="mdp_oublie.php">Mot de passe oublié ?</a>
                <a href="inscription.php">S'inscrire</a>
            </form>
        </div>
    </div>
    <?php require_once '../../includes/footer.php'; ?>
</body>

</html>