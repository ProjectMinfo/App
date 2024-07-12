<?php

require_once "functions.php";
require_once "cookies_utils.php";

$_SESSION["utilisateur"] = array(
    "uid" => $id,
    "nom" => $nom,
    "prenom" => $prenom,
    "email" => $email,
);

setcookie($prefix . "uid", encryptData($_SESSION["utilisateur"]["uid"]), time() + (7 * 24 * 3600), "/", "", false, true);
setcookie($prefix . "nom", encryptData($_SESSION["utilisateur"]["nom"]), time() + (7 * 24 * 3600), "/", "", false, true);
setcookie($prefix . "prenom", encryptData($_SESSION["utilisateur"]["prenom"]), time() + (7 * 24 * 3600), "/", "", false, true);
setcookie($prefix . "email", encryptData($_SESSION["utilisateur"]["email"]), time() + (7 * 24 * 3600), "/", "", false, true);
