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
if(isset($_POST["Modifier"])){
    try{
        require_once '../../includes/database.php'; //connexion BDD

        // //sécurisation des données et format des données
        $nom = strtoupper(sanitize($_POST["nom"])); //on met le nom en majuscule
        $prenom = ucfirst(strtolower(sanitize($_POST["prenom"]))); //on met la première lettre du prenom en majuscule et le reste en minuscule
        $email = sanitize($_POST["email"]);
        $montant = sanitize($_POST["montant"]);
        $num_compte = sanitize($_POST["num_compte"]);
        $acces = sanitize($_POST["acces"]);
        $id_redirection = $_POST["id"];

        //on regarde si l'adresse mail est bien de type junia
        $pattern = '/^[a-zA-Z]+([-][a-zA-Z]+)?(\.[a-zA-Z]+)?@(student\.)?junia\.com$/'; //pattern de l'adresse mail
        if(!preg_match($pattern, $email)){
            $error = "invalid_mail";
            header("Location: modif_compte.php?id=$id_redirection&error=" . urldecode($error));
            exit();
        }
        
        //on vérifie si l'adresse n'est pas deja dans la bdd
        $requete = $conn->prepare("SELECT * FROM comptes WHERE email = :email");
        $requete->execute(
            array(
                ":email" => $email
            )
        );
        if($email != $_POST["email_old"] && $requete->rowCount() > 0){
            $error = "mail_already_used";
            header("Location: modif_compte.php?id=$id_redirection&error=" . urldecode($error));
            exit();
        }

        if ($acces < 0 || $acces > 2) {
            $error = "wrong_access_code";
            header("Location: modif_compte.php?id=$id_redirection&error=" . urlencode($error));
            exit();
        }

        //on vérifie que le numéro de compte choisi soit disponible et valide (entre 1 et 999)
        if($num_compte < 1 || $num_compte > 999){
            $error = "invalid_account_number";
            header("Location: modif_compte.php?id=$id_redirection&error=" . urldecode($error));
            exit();
        }
        $requete = $conn->prepare("SELECT * FROM comptes WHERE num_compte = :num_compte");
        $requete->execute(
            array(
                ":num_compte" => $num_compte
            )
        );
        if($num_compte != $_POST["num_compte_old"] && $requete->rowCount() > 0){
            $error = "num_account_already_used";
            header("Location: modif_compte.php?id=$id_redirection&error=" . urldecode($error));
            exit();
        }


        //update du compte
        $requete = $conn->prepare("UPDATE comptes SET nom = :nom, prenom = :prenom, email = :email, montant = :montant, num_compte = :num_compte, acces = :acces WHERE id_compte = :id_compte");
        $requete->execute(
            array(
                ":nom" => $nom,
                ":prenom" => $prenom,
                ":email" => $email,
                ":montant" => $montant,
                ":num_compte" => $num_compte,
                ":id_compte" => sanitize($_POST["id"]),
                ":acces" => sanitize($_POST["acces"])
            )
        );

        //traitement du nouveau montant
        if($montant != $_POST["montant_old"]){
            $transaction = $montant - $_POST["montant_old"];

            //définition du type de transaction
            if($transaction < 0){
                $type = 1;
            }
            else if($transaction > 0){
                $type = 2;
            }
            //insertion de la transaction
            $requete = $conn->prepare("INSERT INTO transactions(date, num_compte, montant, type, id_serveur) VALUES(:date_, :num_compte, :montant, :type_, :id_serveur)");
            $requete->execute(
                array(
                    ":date_" => date("Y-m-d"),
                    ":num_compte" => $num_compte,
                    ":montant" => $transaction,
                    ":type_" => $type,
                    ":id_serveur" => $_SESSION["utilisateur"]["uid"]
                )
            );
        }
        

        //redirection vers profil.php
        header("Location: /pages/admin/modif_compte.php?id=$id_redirection&status=success");
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
?>
