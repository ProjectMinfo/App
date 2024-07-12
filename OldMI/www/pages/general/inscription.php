<?php
session_start();
require_once '../../includes/functions.php';


if (isConnected()) {
    header("Location: ../pages/user/profil.php");
    exit();
}

$errorMessages = [
    "invalid_mail" => "Vous devez utiliser votre adresse mail Junia.",
    "mail_already_used" => "Cette adresse mail est déjà utilisée.",
    "password_not_valid" => "Votre mot de passe doit faire au moins 8 caractères et contenir un chiffre.",
    "password_dont_match" => "Les mots de passe ne correspondent pas.",
    "invalid_captcha" => "Le captcha est invalide.",
    "terms_not_agreed" => "Vous devez accepter la politique données personnelles pour vous inscrire.",
];

if (isset($_GET["error"])) {
    $errorMessage = $errorMessages[$_GET["error"]] ?? "Une erreur inconnue s'est produite.";
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <title>Chti'MI | Inscription</title>
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/inscription_connexion.css">
</head>

<body>
    <?php require_once '../../includes/header.php'; ?>
    <div class="form-container" style="height: 80vh;">
        <div class="form">
            <section class="title-form">
                <h3>Inscription</h3>
            </section>
            <br>
            <form action="script_inscription.php" method="post">
                <input type="text" name="nom" id="nom" placeholder="Nom">
                <input type="text" name="prenom" id="prenom" placeholder="Prénom">
                <input type="email" name="email" id="email" placeholder="Adresse mail Junia">
                <section>
                    Votre promo :
                    <select name="promo" id="promo">
                        <option value="65">65</option>
                        <option value="66">66</option>
                        <option value="67">67</option>
                        <option value="68">68</option>
                        <option value="69">69</option>
                    </select>
                </section>
                <input type="password" name="mdp" id="mdp" placeholder="Mot de passe">
                <input type="password" name="mdp2" id="mdp2" placeholder="Confirmer le mot de passe">
                <a href="#" onclick="var t=document.getElementById('captcha'); t.src=t.src+'&amp;'+Math.random();" style="user-select: none;" tabindex="-1">
                    <img id="captcha" src="../../includes/purecaptcha/purecaptcha_img.php?t=register" height="40" />
                </a>
                <input type="text" name="CAPTCHA" id="captcha" placeholder="Captcha">
                <input type="checkbox" name="terms_agree" id="terms_agree" style="height: auto;">
                <label for="terms_agree">J'accepte la <a href="donnees_personnelles.php">politique données personnelles</a></label>
                <input type="submit" value="S'inscrire" name="signup" class="conn">
                <div class="error" id="error">
                    <?php if (isset($_GET["error"])) : ?>
                        <?php echo $errorMessage; ?>
                    <?php endif; ?>
                </div>
                <a href="connexion.php">Se connecter</a>
            </form>
        </div>
    </div>
    <?php require_once '../../includes/footer.php'; ?>
    <script src="/assets/js/jquery.min.js"></script>
    <script src="verif_inscription.js"></script>
</body>

</html>