<?php
require_once "key.php";

// Prefix for your cookies
$prefix = "mi_";

// Clear user-specific cookies
setcookie($prefix . "uid", "", time() - 3600, '/', '', false, true);
setcookie($prefix . "nom", "", time() - 3600, '/', '', false, true);
setcookie($prefix . "prenom", "", time() - 3600, '/', '', false, true);
setcookie($prefix . "email", "", time() - 3600, '/', '', false, true);

// Unset the corresponding $_COOKIE values
unset($_COOKIE[$prefix . "id"]);
unset($_COOKIE[$prefix . "nom"]);
unset($_COOKIE[$prefix . "prenom"]);
unset($_COOKIE[$prefix . "email"]);

// Destroy the user's session
session_destroy();
