<?php
if (isset($_GET["num"])) {
    try {
        require_once '../../../includes/database.php'; //connexion BDD
        $number = $_GET["num"];
        $requete = $conn->prepare("SELECT * FROM comptes WHERE num_compte = :num_compte"); //requete et préparation
        $requete->bindParam(':num_compte', $number);
        $requete->execute();
        if ($requete->rowCount() != 0) {
            echo "$number est déjà utilisé";
        }
    } catch (Exception $e) { //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
