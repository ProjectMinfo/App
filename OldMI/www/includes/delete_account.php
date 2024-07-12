<?php

session_start();

require_once "functions.php";
require_once "cookies_utils.php";

if (isset($_SESSION['utilisateur'])) {
    try {
        require_once "database.php";
        global $key;

        $num_compte = decryptData($_COOKIE['mi_uid']);

        // Delete the user's account from the database
        $delete_query = $conn->prepare("DELETE FROM comptes WHERE num_compte = :num_compte");
        $delete_query->bindParam(':num_compte', $num_compte);

        if ($delete_query->execute()) {
            foreach ($_COOKIE as $cookieName => $cookieValue) {
                setcookie($cookieName, '', time() - 3600, '/');
            }
            
            session_unset();
            session_destroy();

            header("Location: /pages/general/connexion.php?success=account_deleted");
            exit();
        } else {
            header("Location: /index.php");
            exit();
        }
    } catch (Exception $e) {
        die("Erreur : " . $e->getMessage());
    }
} else {
    // User is not logged in
    header("Location: /pages/general/connexion.php");
    exit();
}
