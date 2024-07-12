<?php

function isAdmin($bdd, $id)
{
    //vérifie si l'utilisateur est un administrateur
    $SQL = 'SELECT acces FROM comptes WHERE id_compte = ?';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute(array($id));
    return $stmt->fetch()[0] == 2;
}

function isServeur($bdd, $id)
{
    //vérifie si l'utilisateur est un serveur
    $SQL = 'SELECT acces FROM comptes WHERE id_compte = ?';
    $stmt = $bdd->prepare($SQL);
    $stmt->execute(array($id));
    $ret = $stmt->fetch()[0];
    return $ret == 2 || $ret == 1;
}

function GetAllAboutAPlate($bdd, $id)
{
    $SQL = "SELECT * FROM carte WHERE id_carte = :id";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt->closeCursor();
    sendJson($info);
}

function GetAllAboutAnArticle($bdd, $id)
{
    $SQL = "SELECT * FROM articles WHERE id_article = :id";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt->closeCursor();
    sendJson($info);
}

function GetAllAboutPlateType($bdd, $id)
{
    $SQL = "SELECT *, 0 as Qty FROM carte WHERE typePlat = :id ORDER by nom";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //Récupération et affichage des quantitées disponibles

    $stmt->closeCursor();
    sendJson($info);
}

function GetAllAboutAUser($bdd, $id)
{
    $SQL = "SELECT * FROM comptes WHERE num_compte = :id";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //Récupération et affichage des quantitées disponibles

    $stmt->closeCursor();
    sendJson($info);
}

function GetLastTransactions($bdd, $id)
{
    $SQL = "SELECT * FROM (SELECT * FROM transactions WHERE num_compte = :id ORDER BY id_transaction DESC LIMIT 5) AS subquery ORDER BY id_transaction";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //Récupération et affichage des quantitées disponibles

    $stmt->closeCursor();
    sendJson($info);
}

function AddTransactionToBDD($bdd, $num_compte, $montant, $typeTransaction, $id_serveur)
{
    $SQL = "INSERT INTO `transactions`(`num_compte`, `montant`, `type`, `id_serveur`) VALUES (:num_compte,:montant,:typeTransaction,:id_serveur)";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':num_compte', $num_compte);
    $stmt->bindParam(':montant', $montant);
    $stmt->bindParam(':typeTransaction', $typeTransaction);
    $stmt->bindParam(':id_serveur', $id_serveur);
    $stmt->execute();

    $SQL = "SELECT id_transaction FROM transactions WHERE num_compte = :num_compte ORDER BY id_transaction DESC LIMIT 1";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':num_compte', $num_compte);
    $stmt->execute();
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt->closeCursor();
    sendJson($info);
}

function AddCommandToBDD($bdd, $num_transaction, $nom, $commande_out, $commande_in, $prix, $typepaiement, $etat, $stock, $menu, $commentaire, $chaud, $froid)
{
    try {
        $SQL = "INSERT INTO `commandes`(`num_transaction`, `nom`, `commande_out`, `commande_in`, `prix`, `typepaiement`, `etat`, `stock`, `menu`, `commentaire`,`chaud`, `froid`) VALUES (:num_transaction, :nom, :commande_out, :commande_in, :prix, :typepaiement, :etat, :stock, :menu, :commentaire, :chaud, :froid)";
        $stmt = $bdd->prepare($SQL);
        $stmt->bindParam(':num_transaction', $num_transaction);
        $stmt->bindParam(':nom', $nom);
        $stmt->bindParam(':commande_out', $commande_out);
        $stmt->bindParam(':commande_in', $commande_in);
        $stmt->bindParam(':prix', $prix);
        $stmt->bindParam(':typepaiement', $typepaiement);
        $stmt->bindParam(':etat', $etat);
        $stmt->bindParam(':stock', $stock);
        $stmt->bindParam(':menu', $menu);
        $stmt->bindParam(':commentaire', $commentaire);
        $stmt->bindParam(':chaud', $chaud);
        $stmt->bindParam(':froid', $froid);
        $stmt->execute();

        $stmt->closeCursor();
        sendJson(1); // Envoyer un signal de succès
    } catch (PDOException $e) {
        sendJson($e); // Envoyer un signal d'erreur
    }
}

function UpdateMoneyAmount($bdd, $num_compte, $newAmount)
{
    $SQL = "UPDATE `comptes` SET `montant`= :montant WHERE num_compte = :num_compte";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':num_compte', $num_compte);
    $stmt->bindParam(':montant', $newAmount);
    $stmt->execute();

    $stmt->closeCursor();
}

function GetFullUserLst($bdd)
{
    //Renvoie la liste des comptes pour la recherche par nom
    $SQL = "SELECT num_compte, nom, prenom FROM comptes";
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt->closeCursor();
    sendJson($info);
}

function UpdateStockRemove($bdd, $id_produit, $qty)
{
    $SQL = "UPDATE `articles` SET `qte`= `qte` + :qty WHERE id_article = :id_produit";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id_produit', $id_produit);
    $stmt->bindParam(':qty', $qty);
    $stmt->execute();

    $stmt->closeCursor();
    sendJson(1);
}

function GetCuisineLst($bdd)
{
    //Renvoie la liste des plats à préparer en cuisine
    $SQL = "SELECT id_commande, nom, commande_in, date, commentaire, retire_stock, chaud, froid FROM commandes WHERE etat = 1 ORDER BY date";
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt->closeCursor();
    sendJson($info);
}

function GetCommandesCuisineLst($bdd)
{
    //Renvoie la liste des plats affichés en cuisine et des plats du jour
    $dateAujourdhui = date('Y-m-d');

    $SQL = "SELECT * FROM commandes WHERE (etat != 0 AND DATE(date) = '$dateAujourdhui') OR etat = 1";
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt->closeCursor();
    sendJson($info);
}

function ChangeCommandeStatut($bdd, $id, $NewValue)
{
    //Permet de changer le statut d'une commande
    $SQL = "UPDATE `commandes` SET `etat`= :NewValue WHERE id_commande = :id";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':NewValue', $NewValue);
    $stmt->execute();

    $stmt->closeCursor();
    sendJson(1);
}

function UpdateParticularCommande($bdd, $idCommande, $Zone)
{
    //Permet de changer le statut des commandes partielles
    if ($Zone == "chaud") {
        $SQL = "UPDATE `commandes` SET chaud  = 2 WHERE id_commande = :id";
    } elseif ($Zone == "froid") {
        $SQL = "UPDATE `commandes` SET froid  = 2 WHERE id_commande = :id";
    } else {
        return;
    }
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $idCommande);
    $stmt->execute();

    $SQL = "SELECT chaud,froid FROM commandes WHERE id_commande = :id";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $idCommande);
    $stmt->execute();
    $info = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($info["froid"] == 2 && $info["chaud"] == 2) {
        $SQL = "UPDATE `commandes` SET `etat`= 2 WHERE id_commande = :id";
        $stmt = $bdd->prepare($SQL);
        $stmt->bindParam(':id', $idCommande);
        $stmt->execute();
    }

    $stmt->closeCursor();
    sendJson(1);
}

function GetCommandeInfo($bdd, $id)
{
    //Renvoie toutes les informations concernant une commande
    $SQL = "SELECT * FROM commandes WHERE id_commande = :id";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt->closeCursor();
    sendJson($info);
}

function GetTransactionsInfo($bdd, $id)
{
    //Renvoie le numéro de compte associé à une transaction
    $SQL = "SELECT num_compte FROM transactions WHERE id_transaction = :id";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt->closeCursor();
    sendJson($info);
}

function GetMoneyOnAccount($bdd, $id)
{
    //Renvoie l'argent sur un compte
    $SQL = "SELECT montant FROM comptes WHERE num_compte = :id";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    $stmt->closeCursor();
    sendJson($info);
}

function UpdateCommande($bdd, $id, $nameCommandeur, $out, $in, $commentaire)
{
    //Permet de changer le statut d'une commande
    $SQL = "UPDATE `commandes` SET nom = :nameCommandeur, commande_out = :commande_out, commande_in = :commande_in, commentaire = :commentaire WHERE id_commande = :id";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':commande_out', $out);
    $stmt->bindParam(':commande_in', $in);
    $stmt->bindParam(':commentaire', $commentaire);
    $stmt->bindParam(':nameCommandeur', $nameCommandeur);
    $stmt->execute();

    $stmt->closeCursor();
    sendJson(1);
}

function UpdateOnlineCommande($bdd, $id, $name, $out, $in, $commentaire, $transactionNum, $typepaiement)
{
    try {
        // Récupérer le dernier ID existant dans la table de commandes
        $SQL = "UPDATE `commandes` SET nom = :nameCommandeur, commande_out = :commande_out, commande_in = :commande_in, commentaire = :commentaire, etat= 1, num_transaction = :num_transaction, typepaiement = :typepaiement, date=:date WHERE id_commande = :id";
        $stmt = $bdd->prepare($SQL);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':commande_out', $out);
        $stmt->bindParam(':commande_in', $in);
        $stmt->bindParam(':commentaire', $commentaire);
        $stmt->bindParam(':nameCommandeur', $name);
        $stmt->bindParam(':num_transaction', $transactionNum);
        $stmt->bindParam(':typepaiement', $typepaiement);
        $stmt->bindParam(':date', date('Y-m-d H:i:s'));
        $stmt->execute();

        $stmt->closeCursor();
        sendJson(1); // Envoyer un signal de succès
    } catch (PDOException $e) {
        sendJson($e); // Envoyer un signal d'erreur
    }
}


function EditChaudFroid($bdd, $id, $chaud, $froid)
{
    $SQL = "UPDATE `commandes` SET chaud = :chaud, froid = :froid WHERE id_commande = :id";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':chaud', $chaud);
    $stmt->bindParam(':froid', $froid);
    $stmt->execute();
}

function GetAllOnlinesCommandes($bdd)
{
    //Renvoie les commandes Onlines

    $SQL = "SELECT * FROM commandes WHERE etat = 0";
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt->closeCursor();
    sendJson($info);
}

function GetAllOnlinesCommandesToActualise($bdd)
{
    //Renvoie les commandes Onlines qui doivent être traitées dans les stocks
    $SQL = "SELECT * FROM commandes WHERE etat = 0 AND (retire_stock != 1 OR retire_stock IS NULL)";
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt->closeCursor();
    sendJson($info);
}

function ActualiseOnlineCommande($bdd, $id)
{
    //Permet de changer le statut d'une commande
    $SQL = "UPDATE `commandes` SET retire_stock = 1 WHERE id_commande = :id";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':id', $id);
    $stmt->execute();

    $stmt->closeCursor();
    sendJson(1);
}

function GetBaguetteInfoFromBDD($bdd)
{
    //Renvoie un tableau avec le nombre de Sandwich possible et le nombre de Paninis possibles
    $tab = [];
    $SQL = "SELECT value FROM settings WHERE param = 'nbSandwich'";
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);
    array_push($tab, $info[0]["value"]);

    $SQL = "SELECT qte FROM articles WHERE id_article = '1' ";
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);
    array_push($tab, $info[0]["qte"]);

    $stmt->closeCursor();
    sendJson($tab);
}

function UpdateBaguetteAmount($bdd, $Panini, $Sandwich)
{
    //Permet de mettre à jour le nombre de Sandwichs et de Paninis
    $SQL = "UPDATE settings SET value = :Sandwich WHERE param = 'nbSandwich'";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':Sandwich', $Sandwich);
    $stmt->execute();

    $SQL = "UPDATE articles SET qte = :Panini WHERE id_article = '1' ";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':Panini', $Panini);
    $stmt->execute();

    $stmt->closeCursor();
    sendJson(1);
}

function UpdateSandwichAmountToBDD($bdd, $Sandwich)
{
    //Permet de mettre à jour le nombre de Sandwichs
    $SQL = "UPDATE settings SET value = value + :Sandwich WHERE param = 'nbSandwich'";
    $stmt = $bdd->prepare($SQL);
    $stmt->bindParam(':Sandwich', $Sandwich);
    $stmt->execute();

    $stmt->closeCursor();
    sendJson(1);
}

function IsInEvent($bdd)
{
    //Permet de savoir si un évent est en cours ou non.
    $SQL = "SELECT * FROM settings WHERE id = 3";
    $stmt = $bdd->prepare($SQL);
    $stmt->execute();
    $info = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt->closeCursor();
    sendJson($info);
}

function sendJson($elem)
{
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    echo json_encode($elem, JSON_UNESCAPED_UNICODE);
}
