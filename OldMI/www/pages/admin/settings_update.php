<?php 

require_once "../../includes/functions.php"; //importation des fonctions
try{
    require_once '../../includes/database.php'; //connexion BDD
}catch(Exception $e){ //en cas d'erreur
    die("Erreur : " . $e->getMessage());
}
$allOk = true;

//--------------HEURES-----------------
if(isset($_POST["activerHeures"])){
    $activerHeures = 1;
}else{
    $activerHeures = 0;
}

try{
$SQL = 'UPDATE settings SET `value` = ? WHERE id= 4';
$stmt= $conn->prepare($SQL);
if(!$stmt->execute(array($activerHeures))){
    $allOk = false;
}
}catch(e){
    $allOk = false;
}

//---------Event------------

if(isset($_POST["activerEvent"])){
    $activerEvent = 1;
}else{
    $activerEvent = 0;
}

try{
$SQL = 'UPDATE settings SET `value` = ? WHERE id= 3';
$stmt= $conn->prepare($SQL);
if(!$stmt->execute(array($activerEvent))){
    $allOk = false;
}
}catch(e){
    $allOk = false;
}



//---------Commandes--------------------
if(isset($_POST["activerCommandes"])){
    $activerCommandes = 1;
}else{
    $activerCommandes = 0;
}

try{
$SQL = 'UPDATE settings SET `value` = ? WHERE id= 1';
$stmt = $conn->prepare($SQL);
if(!$stmt->execute(array($activerCommandes))){
    $allOk = false;
}
}catch(e){
    $allOk = false;
}

if(!$allOk){
    $_SESSION['error']="Une erreur s'est produite. Vérifiez que les changements ont bien été effectués.";
}

header("Location: settings.php");
?>