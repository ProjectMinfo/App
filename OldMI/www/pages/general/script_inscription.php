<?php
session_start();
require_once '../../includes/functions.php';

function checkCaptcha($response)
{
    if (isset($_SESSION['captcha_register']) && strtolower($_SESSION['captcha_register']) === strtolower($response))
        $res = true;
    else
        $res = false;
    //this has to be done everytime you check captcha
    //otherwise your captcha is ineffective (not one-time)
    unset($_SESSION['captcha_register']);
    return $res;
}

function accountNumExists($number, $bdd)
{
    try {
        $requete = $bdd->prepare("SELECT * FROM comptes WHERE num_compte = :num_compte");
        $requete->bindParam(':num_compte', $number);
        $requete->execute();

        if ($requete->rowCount() != 0) {
            return true; // Le chiffre existe en base de données
        } else {
            return false; // Le chiffre n'existe pas en base de données
        }
    } catch (Exception $e) {
        die("Erreur : " . $e->getMessage());
    }
}

if (isset($_POST["signup"])) {
    try {
        require_once '../../includes/database.php'; // connexion à la base de données

        //sécurisation des données et format des données
        $nom = strtoupper(sanitize($_POST["nom"])); //on met le nom en majuscule
        $prenom = ucfirst(strtolower(sanitize($_POST["prenom"]))); //on met la première lettre du prenom en majuscule et le reste en minuscule
        $email = sanitize($_POST["email"]);
        $promo = sanitize($_POST["promo"]);
        $mdp = sanitize($_POST["mdp"]);
        $mdp2 = sanitize($_POST["mdp2"]);
        $captcha = sanitize($_POST["captcha"]);

        //on regarde si l'adresse mail est bien de type junia
        $regex = '/^[a-zA-Z]+([\-][a-zA-Z]+)*(\.[a-zA-Z]+([\-]{0,2}[a-zA-Z]+)*)?@(student\.)?junia\.com$/';
        if (!preg_match($regex, $email)) {
            $error = "invalid_mail";
            header("Location: inscription.php?error=" . urldecode($error));
            die();
        }

        // on vérifie si l'adresse n'est pas déjà utilisée
        $requete = $conn->prepare("SELECT * FROM comptes WHERE email = :email");
        $requete->execute(
            array(
                ":email" => $email
            )
        );
        if ($requete->rowCount() > 0) {
            $error = "mail_already_used";
            header("Location: inscription.php?error=" . urldecode($error));
            die();
        }

        // Validate password strength
        $uppercase = preg_match('@[A-Z]@', $mdp);
        $lowercase = preg_match('@[a-z]@', $mdp);
        $number = preg_match('@[0-9]@', $mdp);
        $specialchars = preg_match('@[^\w]@', $mdp);

        // Check if passwords match and meet requirements
        if ($mdp != $mdp2) {
            $error = "password_dont_match";
            header("Location: inscription.php?error=" . urldecode($error));
            die();
        } else if (!$uppercase || !$lowercase || !$number || strlen($mdp) < 8) {
            $error = "password_not_valid";
            header("Location: inscription.php?error=" . urldecode($error));
            die();
        }

        // on vérifie si le captcha est correct
        if (isset($_POST['CAPTCHA']) && !checkCaptcha($_POST['CAPTCHA'])) {
            $error = "invalid_captcha";
            header("Location: inscription.php?error=" . urldecode($error));
            die();
        }

        // on vérifie si la politique données personnelles a été acceptée
        if (!isset($_POST['terms_agree'])) {
            $error = "terms_not_agreed";
            header("Location: inscription.php?error=" . urldecode($error));
            die();
        }

        // génération aléatoire du numéro de compte un peu moche
        do {
            $num_compte = rand(100, 999);
        } while (accountNumExists($num_compte, $conn));

        //hashage du mot de passe
        $mdp = password_hash($mdp, PASSWORD_DEFAULT);

        //insertion dans la BDD
        $requete = $conn->prepare("INSERT INTO comptes(nom, prenom, email, promo, mdp, num_compte) VALUES(:nom, :prenom, :email, :promo, :mdp, :num_compte)");
        $requete->execute(
            array(
                ":nom" => $nom,
                ":prenom" => $prenom,
                ":email" => $email,
                ":promo" => $promo,
                ":mdp" => $mdp,
                ":num_compte" => $num_compte
            )
        );

        //on récupère l'id de l'utilisateur
        $id = $conn->lastInsertId();

        // création de la session et des cookies
        require_once "../../includes/set_cookies.php";

        //redirection vers profil.php
        header("Location: ../user/profil.php");
    } catch (Exception $e) { //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
