<?php

session_start();
require_once "../../includes/functions.php";
require_once "../../includes/key.php";

if (isConnected()) {
    header("Location: ../pages/user/profil.php");
    die();
}

function checkCaptcha($response)
{
    if (isset($_SESSION['captcha_resetpwd']) && strtolower($_SESSION['captcha_resetpwd']) === strtolower($response)) {
        unset($_SESSION['captcha_resetpwd']);
        return true;
    } else {
        unset($_SESSION['captcha_resetpwd']);
        return false;
    }
}

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require "../../includes/phpmailer/Exception.php";
require "../../includes/phpmailer/PHPMailer.php";
require "../../includes/phpmailer/SMTP.php";

if (isset($_POST["resetpwd"])) {
    try {

        // Securely sanitize user input
        $email = sanitize($_POST["email"]);
        $captcha = sanitize($_POST["captcha"]);

        // Check if the CAPTCHA is correct
        if (isset($_POST['CAPTCHA']) && !checkCaptcha($_POST['CAPTCHA'])) {
            $error = "invalid_captcha";
            header("Location: mdp_oublie.php?error=" . urldecode($error));
            exit();
        }

        // Retrieve user data from the database
        $stmt = $conn->prepare("SELECT * FROM comptes WHERE email = :email"); //requete et préparation
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);
        $stmt->execute(); // execution de la requete
        $user = $stmt->fetch(); // recupération des données

        // Check if the email exists in the database
        if ($stmt->rowCount() == 0) {
            $error = "invalid_mail";
            header("Location: mdp_oublie.php?error=" . urldecode($error));
            exit();
        }

        // Generate a random reset token for password reset
        $token = bin2hex(random_bytes(32));

        // Update the token and set its expiration in the database
        $stmt = $conn->prepare("UPDATE comptes SET reset_token = :reset_token, token_expiration = NOW() + INTERVAL 1 DAY WHERE email = :email");
        $stmt->bindParam(":reset_token", $token, PDO::PARAM_STR);
        $stmt->bindParam(":email", $email, PDO::PARAM_STR);
        $stmt->execute();
        
        // Send an email with the reset link
        $mail = new PHPMailer(true);
        try {
            $mail->isSmtp();
            $mail->Host = "ssl0.ovh.net";
            $mail->SMTPAuth = true;
            $mail->Username = "noreply@maisonisen.fr";
            $mail->Password = "2022XturE2023";
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;
            $mail->CharSet = "utf-8";
            $mail->setFrom("noreply@maisonisen.fr", "Chti'MI");
            $mail->addAddress($email);
            $mail->Subject = "Réinitialisation de ton mot de passe";

            // Create the email body
            $htmlBody .= '<p>Clique sur le lien suivant pour réinitialiser ton mot de passe :</p>';
            $htmlBody .= '<p><a href="https://maisonisen.fr/pages/general/reset_mdp.php?token=' . $token . '">Réinitialiser le mot de passe</a></p>';
            $htmlBody .= '<small>Le lien est valide pendant 24h. Si vous n\'avez pas demandé à réinitialiser votre mot de passe, merci de ne pas tenir compte de ce message.</small>';
            $mail->Body = $htmlBody;
            $mail->isHTML(true);

            // Send the email
            $mail->send();
            header("Location: connexion.php?success=link_sent");
        } catch (Exception) {
            echo "Erreur: {$mail->ErrorInfo}";
        }
    } catch (Exception $e) { //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
