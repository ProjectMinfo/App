<?php

session_start();
require_once '../../includes/functions.php';

function checkCaptcha($response)
{
    // Check if the provided CAPTCHA response matches the stored one
    if (isset($_SESSION['captcha_newpwd']) && strtolower($_SESSION['captcha_newpwd']) === strtolower($response)) {
        unset($_SESSION['captcha_newpwd']);
        return true;
    } else {
        unset($_SESSION['captcha_newpwd']);
        return false;
    }
}

function passwordValidation($password)
{
    $uppercase = preg_match('@[A-Z]@', $password);
    $lowercase = preg_match('@[a-z]@', $password);
    $number = preg_match('@[0-9]@', $password);
    $specialchars = preg_match('@[^\w]@', $password);
    return $uppercase && $lowercase && $number && $specialchars && strlen($password) >= 8;
}

if (isset($_POST["changepwd"])) {
    // Securely sanitize user input and extract token from the decrypted data
    $token = sanitize($_POST["token"]);
    $captcha = sanitize($_POST["CAPTCHA"]);
    $mdp = $_POST["mdp"];
    $mdp2 = $_POST["mdp2"];

    // Use prepared statements to prevent SQL injection
    $stmt = $conn->prepare("SELECT email FROM comptes WHERE reset_token = :token_reset AND token_expiration > NOW()");
    $stmt->bindParam(":token_reset", $token, PDO::PARAM_STR);
    $stmt->execute();

    // Ensure that token is valid and not empty
    if (empty($token) || $stmt->rowCount() == 0) {
        // TODO CLEAN TOKENS
        header("Location: connexion.php?error=invalid_reset");
        die();
    } else {
        $email = $stmt->fetch()["email"];

        // Check if passwords match and meet requirements
        if ($mdp != $mdp2) {
            $error = "password_dont_match";
        } else if (passwordValidation($mdp) == false) {
            $error = "password_not_valid";
        } elseif (isset($_POST['CAPTCHA']) && !checkCaptcha($_POST['CAPTCHA'])) {
            $error = "invalid_captcha";
        } else {
            // Use prepared statements to prevent SQL injection and update the password
            $mdp = password_hash($mdp, PASSWORD_DEFAULT);
            $stmt = $conn->prepare("UPDATE comptes SET mdp = :mdp, reset_token = NULL, token_expiration = NULL WHERE email = :email");
            $stmt->bindParam(":mdp", $mdp, PDO::PARAM_STR);
            $stmt->bindParam(":email", $email, PDO::PARAM_STR);
            $stmt->execute();
            header("Location: connexion.php?success=pwd_changed");
            die();
        }
    }
    // Consolidate error handling and redirect
    header("Location: reset_mdp.php?token=" . $token . "&error=" . urldecode($error));
    die();
}
