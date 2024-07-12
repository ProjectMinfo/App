<?php
if (isset($_GET["email"])) {
    try {
        require_once '../../../includes/database.php'; //connexion BDD
        $email = $_GET["email"];
        $requete = $conn->prepare("SELECT * FROM comptes WHERE email = :email"); //requete et préparation
        $requete->bindParam(':email', $email);
        $requete->execute();
        if ($requete->rowCount() != 0) {
            echo "Cet email est déjà utilisé";
        }
    } catch (Exception $e) { //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
