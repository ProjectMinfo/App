<?php

header("Access-Control-Allow-Origin: https://maisonisen.fr");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

session_start();

require_once("functions.php");
require_once("database.php");

if (isset($_SESSION["utilisateur"])) {
    if (isServeur($conn, $_SESSION["utilisateur"]["uid"]) || isAdmin($conn, $_SESSION["utilisateur"]["uid"])) {
        try {
            if (isset($_GET["PlateID"])) {
                $id = $_GET["PlateID"];
                GetAllAboutAPlate($conn, $id);
            } elseif (isset($_GET["ArticleID"])) {
                $id = $_GET["ArticleID"];
                GetAllAboutAnArticle($conn, $id);
            } elseif (isset($_GET["PlateType"])) {
                $id = $_GET["PlateType"];
                GetAllAboutPlateType($conn, $id);
            } elseif (isset($_GET["UserID"])) {
                $id = $_GET["UserID"];
                GetAllAboutAUser($conn, $id);
            } elseif (isset($_GET["UserIDTransactions"])) {
                $id = $_GET["UserIDTransactions"];
                GetLastTransactions($conn, $id);
            } elseif (isset($_GET["GetUsersLst"])) {
                GetFullUserLst($conn);
            } elseif (isset($_GET["AddTransactionNum"])) {
                $num_compte = $_GET["AddTransactionNum"];
                $montant = $_GET["AddTransactionMontant"];
                $typeTransaction = $_GET["AddTransactionType"];
                $id_serveur = $_GET["AddTransactionIdServeur"];
                $NewAmount = $_GET["NewAmount"];
                AddTransactionToBDD($conn, $num_compte, $montant, $typeTransaction, $id_serveur);
                UpdateMoneyAmount($conn, $num_compte, $NewAmount);
            } elseif (isset($_GET["AddCommandeTransNum"])) {
                $num_transaction = $_GET["AddCommandeTransNum"];
                $nom = $_GET["AddCommandeNom"];
                $commande_out = $_GET["AddCommandeOut"];
                $commande_in = $_GET["AddCommandeIn"];
                $prix = $_GET["AddCommandePrix"];
                $typepaiement = $_GET["AddCommandeTypePaiement"];
                $etat = $_GET["AddCommandeEtat"];
                $stock = $_GET["AddCommandeStock"];
                $menu = $_GET["AddCommandeMenu"];
                $commentaire = $_GET["AddCommandeComm"];
                $chaud = $_GET["chaud"];
                $froid = $_GET["froid"];
                AddCommandToBDD($conn, $num_transaction, $nom, $commande_out, $commande_in, $prix, $typepaiement, $etat, $stock, $menu, $commentaire, $chaud, $froid);
            } elseif (isset($_GET["DeleteStockQtyID"])) {
                $id = $_GET["DeleteStockQtyID"];
                $qty = $_GET["DeleteStockQty"];
                UpdateStockRemove($conn, $id, $qty);
            } elseif (isset($_GET["CuisineLst"])) {
                GetCuisineLst($conn);
            } elseif (isset($_GET["CommandesEnCours"])) {
                GetCommandesCuisineLst($conn);
            } elseif (isset($_GET["EditCommandeStatut"])) {
                $id = $_GET["EditCommandeStatut"];
                $value = $_GET["EditCommandeValue"];
                ChangeCommandeStatut($conn, $id, $value);
            } elseif (isset($_GET["CommandeInfo"])) {
                $id = $_GET["CommandeInfo"];
                GetCommandeInfo($conn, $id);
            } elseif (isset($_GET["TransactionsInfo"])) {
                $id = $_GET["TransactionsInfo"];
                GetTransactionsInfo($conn, $id);
            } elseif (isset($_GET["MoneyOnAccount"])) {
                $id = $_GET["MoneyOnAccount"];
                GetMoneyOnAccount($conn, $id);
            } elseif (isset($_GET["UpdateCommandeId"])) {
                $id = $_GET["UpdateCommandeId"];
                $name = $_GET["UpdateCommandeName"];
                $out = $_GET["UpdateCommandeOut"];
                $in = $_GET["UpdateCommandeIn"];
                $commentaire = $_GET["UpdateCommandeComm"];
                UpdateCommande($conn, $id, $name, $out, $in, $commentaire);
            } elseif (isset($_GET["OnlineCommandes"])) {
                GetAllOnlinesCommandes($conn);
            } elseif (isset($_GET["OnlineCommandesToActualise"])) {
                GetAllOnlinesCommandesToActualise($conn);
            } elseif (isset($_GET["SetOnlineCommandActualise"])) {
                $id = $_GET["SetOnlineCommandActualise"];
                ActualiseOnlineCommande($conn, $id);
            } elseif (isset($_GET["OnlineCommandeValidation"])) {
                $id = $_GET["OnlineCommandeValidation"];
                $in = $_GET["OnlineCommandeValidationIn"];
                $out = $_GET["OnlineCommandeValidationOut"];
                $comm = $_GET["OnlineCommandeValidationComm"];
                $name = $_GET["OnlineCommandeValidationName"];
                $transactionNum = $_GET["OnlineCommandeValidationTransaction"];
                $typePaiement = $_GET["OnlineCommandeValidationType"];
                UpdateOnlineCommande($conn, $id, $name, $out, $in, $comm, $transactionNum, $typePaiement);
            } elseif (isset($_GET["GetBaguetteInfo"])) {
                //Renvoie un tableau avec le nb de sandwich puis de Paninis possibles
                GetBaguetteInfoFromBDD($conn);
            } elseif (isset($_GET["ChangePaniniAmount"])) {
                //Permet de mettre à jour le nombre de paninis et de sandwichs
                $Panini = $_GET["ChangePaniniAmount"];
                $Sandwich = $_GET["ChangeSandwichAmount"];
                UpdateBaguetteAmount($conn, $Panini, $Sandwich);
            } elseif (isset($_GET["UpdateSandwichAmount"])) {
                //Permet de mettre à jour le nombre de Sandwich dans la BDD
                $Sandwich = $_GET["UpdateSandwichAmount"];
                UpdateSandwichAmountToBDD($conn, $Sandwich);
            } elseif (isset($_GET["EditParticularCommandeStatut"])) {
                //Permet de mettre à jour le nombre de Sandwich dans la BDD
                $idCommande = $_GET["EditParticularCommandeStatut"];
                $Zone = $_GET["EditParticularCommandeStatutZone"];
                UpdateParticularCommande($conn, $idCommande, $Zone);
            } elseif (isset($_GET["EditChaudFroidStatut"])) {
                //Permet de mettre à jour le nombre de Sandwich dans la BDD
                $id = $_GET["EditChaudFroidStatutId"];
                $chaud = $_GET["EditChaudFroidStatut"];
                $froid = $_GET["EditStatut"];
                EditChaudFroid($conn, $id, $chaud, $froid);
            } elseif (isset($_GET["IsEvent"])) {
                //Permet de vérifier si un évent est en cours ou pas
                IsInEvent($conn);
            } else {
                throw new Exception("Problème de récupération de données");
            }
        } catch (Exception $e) {
            $erreur = [
                "message" => $e->getMessage(),
                "code" => $e->getCode()
            ];
            print_r($erreur);
        }
    } else {
        echo "bien tenté";
        die();
    }
}
