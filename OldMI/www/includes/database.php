<?php

// Connexion à la base de données
if ($_SERVER["SERVER_NAME"] != "localhost" && strpos($_SERVER["SERVER_NAME"], "localhost") === false) {
    // Environnement de production
    $servername = "maisoseminitel.mysql.db";
    $username = "maisoseminitel";
    $password = "96c9nSQ48QiQgs";
    $database = "maisoseminitel";
} else {
    // Environnement local
    $servername = "localhost";
    $username = "root";
    $password = "root";
    $database = "chtimi";
}

$options = array(
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
);

try {
    $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password, $options);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();
}
