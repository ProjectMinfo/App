<?php //script pour la deconnexion
session_start();

//on supprime les cookies
require_once 'delete_cookies.php';

//supprime la session
session_unset();
session_destroy();
header("Location: /pages/general/connexion.php");
exit();