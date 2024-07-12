<?php

session_start();
require_once '../../includes/functions.php';

$errorMessages = [
    "incorrect_data" => "Cette demande de réinitialisation n'est pas valide, merci de réessayer.",
    "invalid_token" => "Le lien de réinitialisation est expiré, merci de renouveler votre demande.",
    "password_not_valid" => "Votre mot de passe doit faire au moins 8 caractères et contenir un chiffre.",
    "password_dont_match" => "Les mots de passe ne correspondent pas.",
    "invalid_captcha" => "Le captcha est invalide.",
];

$stmt = $conn->prepare("SELECT email FROM comptes WHERE reset_token = :token_reset AND token_expiration > NOW()");
$stmt->bindParam(":token_reset", $_GET["token"], PDO::PARAM_STR);
$stmt->execute();

if (isConnected()) {
    header("Location: ../index.php");
    die();
} elseif (empty($_GET["token"]) || $stmt->rowCount() == 0) {
    $error = "invalid_reset";
    header("Location: connexion.php?error=" . urldecode($error));
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
    <title>Chti'MI | Réinitialisation du mot de passe</title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/inscription_connexion.css">
</head>

<body>
    <?php require_once '../../includes/header.php'; ?>
    <div class="form-container">
        <div class="form">
            <section class="title-form">
                <h3>Réinitialisation du mot de passe</h3>
            </section>
            <br>
            <form action="script_reset_mdp.php" method="post">
                <input type="hidden" name="token" value="<?php echo $_GET['token']; ?>">
                <input type="password" name="mdp" id="mdp" placeholder="Mot de passe">
                <input type="password" name="mdp2" id="mdp2" placeholder="Confirmer le mot de passe">
                <a href="#" onclick="var t=document.getElementById('captcha'); t.src=t.src+'&amp;'+Math.random();" style="user-select: none;" tabindex="-1">
                    <img id="captcha" src="../../includes/purecaptcha/purecaptcha_img.php?t=newpwd" height="40" />
                </a>
                <input type="text" name="CAPTCHA" id="captcha" placeholder="Captcha">
                <input type="submit" name="changepwd" value="Réinitialiser le mot de passe" class="conn">
                <div class="error" id="error">
                    <?php if (isset($_GET["error"])) : ?>
                        <?php echo $errorMessage; ?>
                    <?php endif; ?>
                </div>
            </form>
        </div>
    </div>
    <?php require_once '../../includes/footer.php'; ?>
</body>

</html>