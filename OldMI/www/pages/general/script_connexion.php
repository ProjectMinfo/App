<?php

session_start();

require_once '../../includes/functions.php';
require_once '../../includes/cookies_utils.php';

function accountNumExists($number, $bdd)
{
    try {
        $stmt = $bdd->prepare("SELECT * FROM comptes WHERE num_compte = :num_compte");
        $stmt->bindParams(':num_compte', $number, PDO::PARAM_STR);
        $stmt->execute();

        if ($stmt->rowCount() != 0) {
            return true;
        } else {
            return false;
        }
    } catch (Exception $e) {
        die("Erreur : " . $e->getMessage());
    }
}

if (isset($_POST["signin"])) {
    try {
        require_once '../../includes/database.php'; // connexion à la base de données

        // sécurisation des données
        $email = sanitize($_POST["email"]);
        $mdp = $_POST["mdp"];

        // récupération dans la BDD
        $stmt = $conn->prepare("SELECT * FROM comptes WHERE email = :email"); //requete et préparation
        $stmt->bindParam(":email", $email, PDO::PARAM_STR); //liaison des paramètres (sécurité
        $stmt->execute(); //execution de la requete
        $user = $stmt->fetch(); //recupération des donnéess

        // si l'utilisateur a un compte mais pas de mdp
        if ($stmt->rowCount() != 0 && $user["mdp"] == null) {
            $error = "no_password_set";
            header("Location: connexion.php?error=" . urldecode($error));
            die();
        }

        // si l'utilisateur existe mais qu'il n'a pas de numéro de compte
        if (isset($user["num_compte"]) && $user["num_compte"] == 0) {
            do {
                $num_compte = rand(100, 999);
            } while (accountNumExists($num_compte, $conn));
            $stmt = $conn->prepare("UPDATE comptes SET num_compte = :num_compte WHERE id_compte = :id_compte");
            $stmt->bindParam(":num_compte", $num_compte, PDO::PARAM_STR);
            $stmt->bindParam(":id_compte", decryptData($_POST["credential"]), PDO::PARAM_STR);
            $stmt->execute();
        }

        // on verifie le mail et le mot de passe
        if ($stmt->rowCount() == 0 || !password_verify($mdp, $user["mdp"])) {
            $error = "incorrect_credentials";
            header("Location: connexion.php?error=" . urldecode($error));
            die();
        }

        // on récupère dans les variables
        $id = $user["id_compte"];
        $nom = $user["nom"];
        $prenom = $user["prenom"];

        // création de la session et des cookies
        require_once "../../includes/set_cookies.php";

        // redirection vers profil.php
        header("Location: ../user/profil.php");
    } catch (Exception $e) { //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
