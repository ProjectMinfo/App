<?php

//fonctions php pour tout le site
require_once("database.php");
require_once("cookies_utils.php");

function isConnected()
{
    // Cette fonction vérifie que l'user est bien connecté à son compte
    if (isset($_SESSION["utilisateur"])) {
        return true;
    } else {
        return false;
    }
}

function areSetCookies()
{
    // Cette fonction recrée une session à partir des cookies s'ils existent
    if (!isset($_SESSION["utilisateur"]) && isset($_COOKIE["mi_uid"]) && isset($_COOKIE["mi_nom"]) && isset($_COOKIE["mi_prenom"]) && isset($_COOKIE["mi_email"])) {
        $_SESSION["utilisateur"] = array(
            "uid" => decryptData($_COOKIE["mi_uid"]),
            "nom" => decryptData($_COOKIE["mi_nom"]),
            "prenom" => decryptData($_COOKIE["mi_prenom"]),
            "email" => decryptData($_COOKIE["mi_email"]),
        );
    }
}

function isAdmin($bdd, $id)
{
    // vérifie si l'utilisateur est un administrateur
    $SQL = 'SELECT acces FROM comptes WHERE id_compte = ?';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute(array($id));
    return $stmt->fetch()[0] == 2;
}

function isServeur($bdd, $id)
{
    // vérifie si l'utilisateur est un serveur
    $SQL = 'SELECT acces FROM comptes WHERE id_compte = ?';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute(array($id));
    $ret = $stmt->fetch()[0];
    return $ret == 2 || $ret == 1;
}

function sanitize($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, "UTF-8");
    return $data;
}

// Encrypt data with AES
function encryptData($data)
{
    global $key;
    $iv = random_bytes(16); // Generate a random initialization vector
    $encryptedData = openssl_encrypt(serialize($data), "AES-256-CBC", $key, 0, $iv);
    return base64_encode($iv . $encryptedData);
}

// Decrypt data with AES
function decryptData($data)
{
    global $key;
    $data = base64_decode($data);
    $iv = substr($data, 0, 16);
    $encryptedData = substr($data, 16);
    $decryptedData = openssl_decrypt($encryptedData, "AES-256-CBC", $key, 0, $iv);
    return unserialize($decryptedData);
}

function canOrder($bdd)
{
    $SQL = 'SELECT `value` FROM settings WHERE id= 1';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    if ($stmt->fetch()[0] == 1) {
        return true;
    } else {
        return false;
    }
}

function HeuresActives($bdd){
    $SQL = 'SELECT `value` FROM settings WHERE id= 4';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    if($stmt->fetch()[0] == 1){
        return true;
    }else{
        return false;
    }
}

function getAllCarte($bdd)
{
    $SQL = 'SELECT * FROM carte';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    return $stmt->fetchall();
}

function getMoneyOnAccount($bdd, $id)
{
    $SQL = 'SELECT montant FROM comptes WHERE id_compte = :id';
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllPlats($bdd)
{
    $SQL = 'SELECT * FROM carte WHERE typePlat = 0 ORDER BY nom';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $SQL = 'SELECT * FROM settings WHERE id = 3';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $etat = $stmt->fetchall();
    $etat = $etat[0]["value"];


    $LstToShow = [];

    for ($i = 0; $i < sizeof($info); $i++) {
        if ($info[$i]["ref"] == "EVENT" && $etat == 0) {
            //Blocage
            $a = 1;
        } else {
            $min = 99;
            $Formatage = SeparateLstIngredients($info[$i]["ingredientsPossibles"]);

            for ($StockI=0; $StockI < 2 ; $StockI++) {
                if (isset($Formatage[$StockI][2])) {
                    if ($Formatage[$StockI][2] == 2) { //L'ingrédient est nécéssaire
    
                        //On récupére la Quantité d'articles restants
                        $SQL = "SELECT * FROM articles WHERE id_article = :id";
                        $stmt = $bdd->prepare($SQL);
                        $stmt->bindParam(':id', $Formatage[$StockI][0]);
                        $stmt->execute();
                        $Secinfo = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
                        if ($Formatage[$StockI][1] != 0) {
                            $min = strval(min($min, intval(intval($Secinfo[0]["qte"]) / $Formatage[$StockI][1])));
                        }
                    }
                    $info[$i]["Qty"] = $min;
                }
            }
            array_push($LstToShow, $info[$i]);
        }
    }
    return $LstToShow;
}

function getAllMenus($bdd)
{
    $SQL = 'SELECT id_carte,nom,ref FROM carte WHERE typePlat = 3';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $lst = $stmt->fetchall();

    $SQL = 'SELECT * FROM settings WHERE id = 3';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $etat = $stmt->fetchall();
    $etat = $etat[0]["value"];

    $lstToSend = [];
    foreach ($lst as $elem) {
        if ($elem["ref"] == "EVENT" && $etat == 0) {
            //Blocage
            break;
        } else {
            array_push($lstToSend, $elem);
        }
    }
    return $lstToSend;
}

function getAllAboutAnAccount($bdd, $id)
{
    //Permet de renvoyer toutes les infos d'un compte à partir de son numéro
    $SQL = 'SELECT * FROM comptes WHERE id_compte = :id';
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function GetAllTransactions($bdd, $id)
{
    //Permet de renvoyer toutes les infos d'un compte à partir de son numéro
    $SQL = 'SELECT * FROM transactions WHERE num_compte = :id';
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllSnacks($bdd)
{
    $SQL = 'SELECT * FROM carte WHERE typePlat = 1 ORDER BY nom';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    for ($i = 0; $i < sizeof($info); $i++) {
        $min = 99;
        $Formatage = SeparateLstIngredients($info[$i]["ingredientsPossibles"]);
        if (isset($Formatage[0][2])) {
            if ($Formatage[0][2] == 2) { //L'ingrédient est nécéssaire

                //On récupére la Quantité d'articles restants
                $SQL = "SELECT * FROM articles WHERE id_article = :id";
                $stmt = $bdd->prepare($SQL);
                $stmt->bindParam(':id', $Formatage[0][0]);
                $stmt->execute();
                $Secinfo = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($Formatage[0][1] != 0) {
                    $min = strval(min($min, intval(intval($Secinfo[0]["qte"]) / $Formatage[0][1])));
                }
            }
            $info[$i]["Qty"] = $min;
        }
    }

    return $info;
}

function getAllPeriph($bdd)
{
    $SQL = 'SELECT * FROM carte WHERE typePlat = 1 OR typePlat = 2 ORDER BY nom';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    for ($i = 0; $i < sizeof($info); $i++) {
        $min = 99;
        $Formatage = SeparateLstIngredients($info[$i]["ingredientsPossibles"]);
        if (isset($Formatage[0][2])) {
            if ($Formatage[0][2] == 2) { //L'ingrédient est nécéssaire

                //On récupére la Quantité d'articles restants
                $SQL = "SELECT * FROM articles WHERE id_article = :id";
                $stmt = $bdd->prepare($SQL);
                $stmt->bindParam(':id', $Formatage[0][0]);
                $stmt->execute();
                $Secinfo = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($Formatage[0][1] != 0) {
                    $min = strval(min($min, intval(intval($Secinfo[0]["qte"]) / $Formatage[0][1])));
                }
            }
            $info[$i]["Qty"] = $min;
        }
    }

    return $info;
}

function getAllBoissons($bdd)
{
    $SQL = 'SELECT * FROM carte WHERE typePlat = 2 ORDER BY nom';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    for ($i = 0; $i < sizeof($info); $i++) {
        $min = 99;
        $Formatage = SeparateLstIngredients($info[$i]["ingredientsPossibles"]);
        if (isset($Formatage[0][2])) {
            if ($Formatage[0][2] == 2) { //L'ingrédient est nécéssaire

                //On récupére la Quantité d'articles restants
                $SQL = "SELECT * FROM articles WHERE id_article = :id";
                $stmt = $bdd->prepare($SQL);
                $stmt->bindParam(':id', $Formatage[0][0]);
                $stmt->execute();
                $Secinfo = $stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($Formatage[0][1] != 0) {
                    $min = strval(min($min, intval(intval($Secinfo[0]["qte"]) / $Formatage[0][1])));
                }
            }
            $info[$i]["Qty"] = $min;
        }
    }

    return $info;
}

function getIngredientById($bdd, $id)
{
    $SQL = 'SELECT * FROM articles WHERE id_article = ? AND (TypeIngredient =0 OR TypeIngredient = 1 OR TypeIngredient = 2)';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute(array($id));
    return $stmt->fetch();
}

function getPlatById($bdd, $id)
{
    $SQL = 'SELECT * FROM carte WHERE id_carte = ?';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute(array($id));
    return $stmt->fetch();
}

function getIngredientSnackById($bdd, $id)
{
    $SQL = 'SELECT * FROM articles WHERE id_article = ? AND TypeIngredient =3 ';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute(array($id));
    return $stmt->fetch();
}

function getIngredientByName($bdd, $name)
{

    $SQL = 'SELECT * FROM articles WHERE nom = ?';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute(array($name));

    return $stmt->fetchall()[0];
}

function getSnacksByName($bdd, $name)
{
    $SQL = 'SELECT * FROM articles WHERE nom = ?';
    $stmt = $bdd->prepare($SQL);

    $stmt->execute(array($name));

    return $stmt->fetchall();
}

function plusToSpace($text)
{
    return (str_replace('+', ' ', $text));
}

function listInTabIngredient($list)
{
    $returnList = [];
    $newList = explode(";", $list);
    foreach ($newList as $elt) {
        $returnList[] = explode(",", $elt);
    }
    return $returnList;
}

function TabIngredientInList($tab)
{
    $Text = "";
    foreach ($tab as $elt) {
        $Text .= implode(",", $elt);
        $Text .= ';';
    }
    return $Text;
}


function getAllBonus($bdd)
{
    $SQL = 'SELECT * FROM carte WHERE typePlat = 2';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    return $stmt->fetchall();
}

function SeparateLstIngredients($data)
{
    //Permet de formater la liste des ingrédients au bon format
    $MyLst = [];
    foreach (preg_split("/;/", $data) as $Lst) {
        array_push($MyLst, preg_split("/,/", $Lst));
    }
    return $MyLst;
}

function estPerime($date)
{
    $date_compare = strtotime($date);
    $actuel = time();
    if ($date_compare < $actuel) {
        return true; //produit périmé
    } else {
        return false; //produit encore valable
    }
}

function refresh_achat()
{
    header("Location: achats.php");
}

function getPrixMenu($bdd, $menuId, $isServeur)
{
    if ($isServeur) {
        $SQL = 'SELECT prix_serveur FROM carte WHERE id_carte=?';
    } else {
        $SQL = 'SELECT prix FROM carte WHERE id_carte=?';
    }
    $stmt = $bdd->prepare($SQL);
    $stmt->execute(array($menuId));
    return $stmt->fetch();
}

function getRelevesTemp($bdd)
{
    $SQL = 'SELECT * FROM temperatures ORDER BY date DESC';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    return ($stmt->fetchall());
}

function getNettoyages($bdd)
{
    $SQL = 'SELECT * FROM nettoyage ORDER BY date DESC';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    return ($stmt->fetchall());
}

function getAllSettings($bdd){
    $SQL = 'SELECT * FROM settings';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    return $stmt->fetchall();

}