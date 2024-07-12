<?php

session_start(); //démarrage de la session
require_once("../../includes/functions.php");
areSetCookies(); //création de la session si cookies existent

if (!isConnected()) {
    header("Location: ../index.php");
    die();
} elseif (!isServeur($conn, $_SESSION["utilisateur"]["uid"])) {
    header("Location: ../index.php");
    die();
}

?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <title>Chti'MI | Commandes serveurs</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha512-SfTiTlX6kk+qitfevl/7LibUOeJWlt9rbyDn92a1DqWOw9vWG2MFoays0sgObmWazO5BQPiFucnnEAjpAB+/Sw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/commandeServeur.css">
    <script src="JS/commandes.js"></script>
    <script src="JS/UniqueQuantityPlate.js"></script>
    <script src="JS/MultipleQuantityPlate.js"></script>
    <script src="JS/Menu.js"></script>
    <script src="JS/Caisse.js"></script>
    <script src="JS/paiement.js"></script>
    <script src="JS/CommandesCuisine.js"></script>
    <script src="JS/OnlineCommandes.js"></script>
    <script>
        var sessionId = <?php echo $_SESSION["utilisateur"]["uid"]; ?>;
    </script>
</head>

<body>
    <?php require_once '../../includes/header.php'; ?>

    <div class="modal" id="BaguetteAmountMenu">
        <div class="modal-back"></div>
        <div class="modal-container" id="BaguetteAmountContainer">
            <span id="closebuttonDwich" onclick="CloseMenu('BaguetteAmountMenu')"><i class="fa fa-times" aria-hidden="true"></i></span>
            <div id="BaguetteAmountTxt">Gestion des baguettes</div>
            <div id=WarningTextBaguettes class="DivBaguetteAmount">Attention, les compteurs peuvent comporter des erreurs</div>
            <div class="DivBaguetteAmount">Le nombre de paninis potentiels correspond au nombre de demi-baguettes disponibles</div>
            <div class="DivBaguetteAmount">
                <label for="SandwichAmountInput">Nombre de Sandwichs potentiels (en demi-baguettes) : </label>
                <input type="number" class="InputBaguette" id="SandwichAmountInput" required autocomplete="off" placeholder="Nombre">
            </div>
            <div class="DivBaguetteAmount">
                <label for="PaniniAmountInput">Nombre de Paninis potentiels (en demi-baguettes) : </label>
                <input type="number" class="InputBaguette" id="PaniniAmountInput" required autocomplete="off" placeholder="Nombre">
            </div>
            <div class="DivBaguetteAmount">
                <button id="BaguetteValideButton" onclick="ChangeBaguetteAmount()">Valider</button>
            </div>
        </div>
    </div>

    <div class="modal" id="OnlineCommandeMenu">
        <div class="modal-back"></div>
        <div class="modal-container" id="OnlineCommandeContainer">
            <span id="closebuttonDwich" onclick="CloseMenu('OnlineCommandeMenu')"><i class="fa fa-times" aria-hidden="true"></i></span>
            <div id="OnlineCommandeTxt">Commandes en ligne</div>
            <div id="OnlineCommandeRecherche">
                <input id="OnlineCommandeRechercheBar" type="text" placeholder="Entez un nom/une commande" autocomplete="off">
            </div>
            <div id="OnlineCommandeContenu">
                <div class="BlocCommandeOnline">
                    <div class="ligneCommande">
                        <div class="colonneCommande CommandeLeftZone">William B</div>
                        <div class="colonneCommande CommandeZoneText">Sandwitch Poulet Curry Maroilles tomate salade beurre</div>
                    </div>
                    <div class="ligneCommande">
                        <div class="colonneCommande CommandeLeftZone">
                            <i class="fa fa-times DenyCommandeButton ChangeButtonCommande" onclick="DenyButtonReservation()" aria-hidden="true"></i>
                            <i class="fa fa-check ValidCommandeButton ChangeButtonCommande" onclick="ValidButtonReservation()" aria-hidden="true"></i>
                        </div>
                        <div class="colonneCommande CommandeZoneText">Sandwitch Poulet Curry Maroilles tomate salade beurre</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    </div>

    <div class="modal" id="ValidOnlineCommandeMenu">
        <div class="modal-back"></div>
        <div class="modal-container" id="ValidOnlineCommandeContainer">
            <span id="closebuttonDwich" onclick="CloseMenu('ValidOnlineCommandeMenu')"><i class="fa fa-times" aria-hidden="true"></i></span>
            <div id="ValidOnlineCommandTxt">Commande en Ligne</div>
            <div id="ValidOnlineCommandeNameDiv">
                <label for="NameCommandeOnlineInput">Nom :</label>
                <input type="text" id="NameCommandeOnlineInput" required autocomplete="off" placeholder="Nom">
            </div>
            <div class="EditCommandeOnlineOutDiv">
                <div class="CenterDivZone DivAreaTexte">
                    Commande non affichée en cuisine :
                </div>
                <div class="CenterDivZone" class="DivAreaCommande">
                    <textarea id="EditCommandeOnlineOutArea" placeholder="Commande non affichée en cuisine"></textarea>
                </div>
            </div>
            <div class="EditCommandeOnlineOutDiv">
                <div class="CenterDivZone DivAreaTexte">
                    Commande affichée en cuisine :
                </div>
                <div class="CenterDivZone" class="DivAreaCommande">
                    <textarea id="EditCommandeOnlineInArea" placeholder="Commande affichée en cuisine"></textarea>
                </div>
            </div>
            <div class="EditCommandeOnlineOutDiv">
                <div class="CenterDivZone DivAreaTexte">
                    Commentaire :
                </div>
                <div class="CenterDivZone" class="DivAreaCommande">
                    <textarea id="EditCommandeOnlineCommentaire" placeholder="Commentaire"></textarea>
                </div>
            </div>
            <div class="EditCommandeOnlineOutDiv">
                <div class="CenterDivZone DivAreaTexte" id="PrixZoneOnline">
                    Paiement : 4€50
                </div>
                <div class="CenterDivZone" class="DivAreaCommande" id="OnlinePaiementZone">
                    <button class="TypePaiementCommande" id="CBOnline" onclick="SelectPaiementTypeOnline(this,0,2)" class="">
                        <i class="fa fa-credit-card" aria-hidden="true"></i>
                        CB
                    </button>
                    <button class="TypePaiementCommande" id="CashOnline" onclick="SelectPaiementTypeOnline(this,1,2)" class="">
                        <i class="fa fa-money" aria-hidden="true"></i>
                        Liquide
                    </button>
                    <button class="TypePaiementCommande" id="CompteOnline" onclick="SelectPaiementTypeOnline(this, 2,2)" class="">
                        <i class="fa fa-paypal" aria-hidden="true"></i>
                        Compte
                    </button>
                </div>
            </div>
            <div class="EditCommandeOnlineOutDiv">
                <button id="ValidCommandOnlineEdit" onclick="ValidCommandOnlineEditButton()">Valider</button>
            </div>

        </div>
    </div>
    </div>

    <div class="modal" id="CurrentCommandesMenu">
        <div class="modal-back"></div>
        <div class="modal-container" id="CurrentCommandesContainer">
            <span id="closebuttonDwich" onclick="CloseMenu('CurrentCommandesMenu')"><i class="fa fa-times" aria-hidden="true"></i></span>
            <div id="CurrentCommandeTxt">Commandes</div>
            <div id="CurrentCommandeRecherche">
                <div id="CurrentCommandeSearchBarZone">
                    <input id="CurrentCommandeSearchBar" type="text" placeholder="Entez un nom/une commande" autocomplete="off">
                </div>
                <div id="CurrentCommandeCheckZone">
                    <input type="checkbox" id="OnCuisineZone" name="OnCuisineZone" checked />
                    <label for="OnCuisineZone">Cuisine seulement</label>
                </div>
            </div>

            <div id="CurrentCommandeContenu">
                <div class="BlocCommande">
                    <div class="ligneCommande">
                        <div class="colonneCommande CommandeLeftZone">William B</div>
                        <div class="colonneCommande CommandeZoneText">Sandwitch Poulet Curry Maroilles tomate salade beurre</div>
                    </div>
                    <div class="ligneCommande">
                        <div class="colonneCommande CommandeLeftZone">
                            <i class="fa fa-pencil-square-o EditCommandeButton ChangeButtonCommande" onclick="EditCommande()" aria-hidden="true"></i>
                            <i class="fa fa-times DenyCommandeButton ChangeButtonCommande" onclick="DenyButtonCommande()" aria-hidden="true"></i>
                            <i class="fa fa-check ValidCommandeButton ChangeButtonCommande" onclick="ValidButtonCommande()" aria-hidden="true"></i>
                        </div>
                        <div class="colonneCommande CommandeZoneText">Sandwitch Poulet Curry Maroilles tomate salade beurre</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    </div>

    <div class="modal" id="EditCommandeMenu">
        <div class="modal-back"></div>
        <div class="modal-container" id="EditCommandeContainer">
            <span id="closebuttonDwich" onclick="CloseMenu('EditCommandeMenu')"><i class="fa fa-times" aria-hidden="true"></i></span>
            <div id="EditCommandeTxt">Modifier une commande</div>
            <div id="EditCommandeNameDiv">
                <label for="NameCommandeInput">Nom :</label>
                <input type="text" id="NameCommandeInput" required autocomplete="off" placeholder="Nom">
            </div>
            <div class="EditCommandeOutDiv">
                <div class="CenterDivZone DivAreaTexte">
                    Commande non affichée en cuisine :
                </div>
                <div class="CenterDivZone" class="DivAreaCommande">
                    <textarea id="EditCommandeOutArea" placeholder="Commande non affichée en cuisine"></textarea>
                </div>
            </div>
            <div class="EditCommandeOutDiv">
                <div class="CenterDivZone DivAreaTexte">
                    Commande affichée en cuisine :
                </div>
                <div class="CenterDivZone" class="DivAreaCommande">
                    <textarea id="EditCommandeInArea" placeholder="Commande affichée en cuisine"></textarea>
                </div>
            </div>
            <div class="EditCommandeOutDiv">
                <div class="CenterDivZone DivAreaTexte">
                    Commentaire :
                </div>
                <div class="CenterDivZone" class="DivAreaCommande">
                    <textarea id="EditCommandeCommentaire" placeholder="Commentaire"></textarea>
                </div>
            </div>
            <div class="EditCommandeOutDiv">
                <button id="ValidCommandEdit" onclick="ValidCommandEditButton()">Valider</button>
            </div>

        </div>
    </div>
    </div>

    <div class="modal" id="PaiementMenu">
        <div class="modal-back"></div>
        <div class="modal-container" id="PaiementContainer">
            <span id="closebuttonDwich" onclick="CloseMenu('PaiementMenu')"><i class="fa fa-times" aria-hidden="true"></i></span>
            <div id="PaiementTxt">Récap</div>
            <div id="PaiementMainDiv">
                <div id=totalPaiement>Total : 13€40</div>
                <div id="MoyenPaiement">
                    <button class="TypePaiementCommande" id="CB" onclick="SelectPaiementType(this,0)" class="">
                        <i class="fa fa-credit-card" aria-hidden="true"></i>
                        CB
                    </button>
                    <button class="TypePaiementCommande" id="Cash" onclick="SelectPaiementType(this,1)" class="">
                        <i class="fa fa-money" aria-hidden="true"></i>
                        Liquide
                    </button>
                    <button class="TypePaiementCommande" id="Compte" onclick="SelectPaiementType(this, 2)" class="">
                        <i class="fa fa-paypal" aria-hidden="true"></i>
                        Compte
                    </button>
                </div>

                <div id="CommZonePaiement">
                    <textarea id="CommentaireArea" placeholder="Commentaire"></textarea>
                </div>
                <div id="ValidZonePaiement">
                    <button id="ValidationPaiement" onclick="LastValidation()">Valider</button>
                </div>
            </div>
        </div>
    </div>
    </div>

    <div class="modal" id="CompteAccess">
        <div class="modal-back"></div>
        <div class="modal-container" id="CompteAccessContainer">
            <span id="closebuttonDwich" onclick="CloseMenu('CompteAccess')"><i class="fa fa-times" aria-hidden="true"></i></span>
            <div id="CompteTxt">Accès comptes</div>

            <div class="ResearchZone">
                <div class="ResearchByNum">
                    <div class="ReseachByNumBar">
                        <label for="searchByNum">
                            <i class="fa fa-search" aria-hidden="true"></i>
                        </label>
                        <input type="number" id="searchByNum" placeholder="Entrez le numéro" onkeydown="KeyDownNum(this)">
                    </div>
                    <div class="SearchNumButtonDiv">
                        <button id="SearchByNumButton" onclick="SearchByNum()">Rechercher</button>
                    </div>
                </div>
                <div class="ResearchByName">
                    <div class="ReseachByNameBar">
                        <label for="searchByName">
                            <i class="fa fa-search" aria-hidden="true"></i>
                        </label>
                        <input type="text" id="searchByName" placeholder="Entrez le nom/prénom" autocomplete="off">
                    </div>
                    <div id="BackZone">
                    </div>
                </div>
            </div>

            <div class="MainCZone">
                <div class="NameCZone">
                    169 - LONGATTE Marc-Antoine - Promo 67
                </div>
                <div class="TableauCZone">
                    <table class="TableauC" id="MonTableauCaisse">
                        <tr>
                            <th>Date</th>
                            <th>Montant</th>
                            <th>Information</th>
                        </tr>
                        <tr>
                            <td>2023-09-01 00:00:00</td>
                            <td>12</td>
                            <td>Modification Manuelle</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                </div>
                <div class="SoldeCZone">
                    Solde : 4€50
                </div>
                <div class="EditCZone">
                    <input type="number" name="EditMontant" id="EditMontant" placeholder="Montant" onkeydown="KeyDownMoney(this)">
                    <button id="EditMontantButton" onclick="ButtonMoney()">Ok</button>
                </div>
            </div>

        </div>
    </div>
    </div>

    <div class="modal" id="MenusMenu">
        <div class="modal-back"></div>
        <div class="modal-container" id="MenuContainer">
            <span id="closebuttonDwich" onclick="CloseMenu('MenusMenu')"><i class="fa fa-times" aria-hidden="true"></i></span>
            <div id="MenuTxt">Sandwich</div>

            <div id="CompositionMenulst">

                <div id="FirstLstDiv">
                    <div id="FirstLstTxt">a</div>
                    <div id="FirstLst">
                        <button onclick="Select_Menu('3')" class="InMenuButton">Sandwich</button>

                    </div>
                </div>

                <div id="SecondLstDiv">
                    <div id="SecondLstTxt">Plat n°2</div>
                    <div id="SecondLst">
                        <button onclick="Select_Menu('3')" class="InMenuButton">Sandwich</button>
                    </div>
                </div>

                <div id="ThirdLstDiv">
                    <div id="ThirdLstTxt">Snacks</div>
                    <div id="ThirdLst">
                        <button onclick="Select_Menu('3')" class="InMenuButton">Sandwich</button>
                    </div>
                </div>

                <div id="FourthLstDiv">
                    <div id="FourthLstTxt">Boissons</div>
                    <div id="FourthLst">
                        <button onclick="Select_Menu('3')" class="InMenuButton">Sandwich</button>
                    </div>
                </div>


            </div>

            <div id="SandwichFooter">
                <div id="ValidButtonSandwich" onclick="SendValidMenu()">Valider</div>
            </div>

        </div>
    </div>
    </div>

    <div class="modal" id="SandwichMenu">
        <div class="modal-back"></div>
        <div class="modal-container" id="SandwichContainer">
            <span id="closebuttonDwich" onclick="CloseMenu('SandwichMenu')"><i class="fa fa-times" aria-hidden="true"></i></span>
            <div id="SandwichText">Sandwich</div>
            <div id="Contenu">
                <div id="SandwichLst">
                    <div class="viande">
                        <div class="Txtmenu">Viandes (1 max)</div>
                        <div id="Viandelst">
                            <button onclick="Select_Object('16')" class="IngredientButton">Granola</button>

                        </div>
                    </div>
                    <div class="ingredient">
                        <div class="Txtmenu">Ingrédients</div>
                        <div id="ingredientlst">

                        </div>
                    </div>
                    <div class="extra">
                        <div class="Txtmenu">Extras</div>
                        <div id="Extralst">

                        </div>
                    </div>
                </div>
                <div id="SandwichFooter">
                    <div id="ValidButtonSandwich" onclick="SendValid()">Valider</div>
                </div>
            </div>

        </div>
    </div>

    <div class="modal" id="MultipleMenu">
        <div class="modal-back"></div>
        <div class="modal-container" id="MultipleContainer">
            <span id="closebuttonDwich" onclick="CloseMenu('MultipleMenu')"><i class="fa fa-times" aria-hidden="true"></i></span>
            <div id="MultipleMenuTxt">Croque Monsieur</div>
            <div id="Content">
                <div id="QuantityDIV">
                    <div class="Txtmenu">Quantité</div>
                    <div id="Quantity">
                    </div>
                </div>

                <div id="SameDIV">
                    <div class="Txtmenu">Identiques</div>
                    <div id="Same">
                        <button class="SamePlate SamePlateSelected" onclick="ToogleSamePlate(this)">Oui</button>
                        <button class="SamePlate" onclick="ToogleSamePlate(this)">Non</button>

                    </div>
                </div>

                <div id="ValidationMultiple" onclick="ValidationMultiple()">Valider</div>

                <div id="FirstChoicePlate">
                    <div class="viande">
                        <div class="Txtmenu">Viandes (1 max)</div>
                        <div id="Viandelst" class="Viandelst">

                        </div>
                    </div>
                    <div class="ingredient">
                        <div class="Txtmenu">Ingrédients</div>
                        <div id="ingredientlst" class="ingredientlst">

                        </div>
                    </div>
                    <div class="extra">
                        <div class="Txtmenu">Extras</div>
                        <div id="Extralst" class="Extralst">

                        </div>
                    </div>
                </div>
                <div id="SecondChoicePlate">
                    <div class="viande">
                        <div class="Txtmenu">Viandes (1 max)</div>
                        <div id="Viandelst" class="Viandelst">

                        </div>
                    </div>
                    <div class="ingredient">
                        <div class="Txtmenu">Ingrédients</div>
                        <div id="ingredientlst" class="ingredientlst">

                        </div>
                    </div>
                    <div class="extra">
                        <div class="Txtmenu">Extras</div>
                        <div id="Extralst" class="Extralst">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>



    <div id="MainContainer">
        <div id="NameInputDiv">
            <label for="NameInput">Nom :</label>
            <input type="text" id="NameInput" required autocomplete="off">
        </div>

        <button onclick="Swap_Serveur_Button(this)" id="BontonServeur">Serveur : NON</script></button>

        <div id="MenuLstMain">
            <div id="MenuTxt">Menus</div>
            <div id="Menulst">
                <?php
                foreach (getAllMenus($conn) as $menu) {
                    if ($menu["ref"] == "EVENT") {
                        echo '<button onclick="Select_Menu(\'' . $menu[0] . '\')" class="MenuButton EVENTCSS">' . $menu[1] . '</button>';
                    } else {
                        echo '<button onclick="Select_Menu(\'' . $menu[0] . '\')" class="MenuButton">' . $menu[1] . '</button>';
                    }
                }

                ?>
            </div>
        </div>

        <div id="PlatLstMain">
            <div id="PlatTxt">Plats</div>
            <div id="Platlst">
                <?php
                foreach (getAllPlats($conn) as $menu) {
                    if ($menu["ref"] == "EVENT") {
                        echo '<button onclick="Select_Plat(\'' . $menu["id_carte"] . '\')" class="PlatButton EVENTCSS">' . $menu["nom"] . '</button>';
                    } else {
                        if ($menu["Qty"] > 10) {
                            echo '<button onclick="Select_Plat(\'' . $menu["id_carte"] . '\')" class="PlatButton">' . $menu["nom"] . '</button>';
                        } elseif (($menu["Qty"] <= 10) && ($menu["Qty"] > 0)) {
                            echo '<button onclick="Select_Plat(\'' . $menu["id_carte"] . '\')" class="PlatButton AlertStock">' . $menu["nom"] . '</button>';
                        } else {
                            echo '<button onclick="Select_Plat(\'' . $menu["id_carte"] . '\')" class="PlatButton Out">' . $menu["nom"] . '</button>';
                        }
                    }
                }

                ?>
            </div>
        </div>

        <div id="AutreLstMain">
            <div id="AutreTxt">Autre</div>
            <div id="Autrelst">
                <button class="PlatButton" id="BaguetteZone" onclick="DisplayBaguetteMenu()"></button>
                <button class="PlatButton" onclick="ShowCommandesInCuisine()">Commandes en cours</script></button>
                <button class="PlatButton" onclick="DisplayOnlineCommandes()">Commandes en ligne</script></button>
                <button class="PlatButton" onclick="ViewCaisse()">Accès Compte</button>
                <script>
                    ActualiseButtonData()
                </script>

            </div>
        </div>

        <div id="SnackLstMain">
            <div id="SnackTxt">Snacks</div>
            <div id="Snacklst">
                <?php
                foreach (getAllSnacks($conn) as $menu) {
                    if ($menu["Qty"] > 10) {
                        echo '<button onclick="Select_Object(\'' . $menu["id_carte"] . '\')" class="PlatButton">' . $menu["nom"] . '</button>';
                    } elseif (($menu["Qty"] <= 10) && ($menu["Qty"] > 0)) {
                        echo '<button onclick="Select_Object(\'' . $menu["id_carte"] . '\')" class="PlatButton AlertStock">' . $menu["nom"] . '</button>';
                    } else {
                        echo '<button onclick="Select_Object(\'' . $menu["id_carte"] . '\')" class="PlatButton Out">' . $menu["nom"] . '</button>';
                    }
                }

                ?>
            </div>
        </div>

        <div id="BoissonLstMain">
            <div id="BoissonTxt">Boissons</div>
            <div id="Boissonlst">
                <?php
                foreach (getAllBoissons($conn) as $menu) {
                    if ($menu["Qty"] > 10) {
                        echo '<button onclick="Select_Object(\'' . $menu["id_carte"] . '\')" class="PlatButton">' . $menu["nom"] . '</button>';
                    } elseif (($menu["Qty"] <= 10) && ($menu["Qty"] > 0)) {
                        echo '<button onclick="Select_Object(\'' . $menu["id_carte"] . '\')" class="PlatButton AlertStock">' . $menu["nom"] . '</button>';
                    } else {
                        echo '<button onclick="Select_Object(\'' . $menu["id_carte"] . '\')" class="PlatButton Out">' . $menu["nom"] . '</button>';
                    }
                }

                ?>
            </div>
        </div>

        <div id="RecapMain">
            <div id="RecapTxt">Récap</div>
            <div id="RecapLst">

            </div>
            <div id="RecapFooter">
                <div id="ValidButton" onclick="FinalValidation()">Valider</div>
                <div id="PriceZone">0€</div>
            </div>

        </div>
    </div>

</body>

</html>