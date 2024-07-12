<?php

session_start();
require_once '../../includes/functions.php';

$errorMessages = [
    "invalid_mail" => "Aucun compte associé à cette adresse mail n'a été trouvé.",
    "invalid_captcha" => "Le captcha est invalide.",
];

if (isConnected()) {
    header("Location: ../pages/user/profil.php");
    die();
} elseif (isset($_GET["error"])) {
    $errorMessage = $errorMessages[$_GET["error"]] ?? "Une erreur inconnue s'est produite.";
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <title>Chti'MI | Mot de passe oublié</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/forms.css">
</head>

<body>
    <?php
    require_once '../../includes/header.php';
    ?>
    <div class="form-container">
        <div class="form">
            <section class="title-form">
                <h3>Mot de passe oublié ?</h3>
            </section>
            <br>
            <form action="send_reset_mail.php" method="post">
                <input type="email" name="email" id="email" placeholder="Adresse mail" required>
                <a href="#" onclick="var t=document.getElementById('captcha'); t.src=t.src+'&amp;'+Math.random();" style="user-select: none;" tabindex="-1">
                    <img id="captcha" src="../../includes/purecaptcha/purecaptcha_img.php?t=resetpwd" height="40" />
                </a>
                <input type="text" name="CAPTCHA" id="captcha" placeholder="Captcha">
                <input type="submit" value="Envoyer un lien" name="resetpwd" class="conn">
                <?php
                if (isset($_GET["error"])) {
                    echo "<div class='error' id='error'>" . $errorMessage . "</div>";
                }
                ?>
                <a href="connexion.php">Se connecter</a>
            </form>
        </div>
    </div>
    <?php require_once '../../includes/footer.php'; ?>
</body>

</html>