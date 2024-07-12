<?php
session_start();
require_once "../../includes/functions.php";

// Vérifie si l'utilisateur est connecté
if (!isConnected()) {
    header("Location: ../index.php");
    exit();
}

// Récupère les informations de l'utilisateur
$userData = getAllAboutAnAccount($conn, $_SESSION["utilisateur"]["uid"]);

// Récupère les transactions de l'utilisateur
$transactionsList = GetAllTransactions($conn, $userData[0]["num_compte"]);
?>

<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chti'MI | Profil</title>
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/profil.css">
</head>

<body>
    <?php require_once '../../includes/header.php'; ?>

    <div id="MainContainerProfil">
        <div id="DataProfilZone">
            <h3>Mes informations personnelles</h3>
            <span class="TraitZone">Pour modifier ces informations, merci de vous rendre au comptoir.</span>
            <br>
            <div>
                <span class="RedZone">Nom : </span><?php echo $userData[0]["nom"]; ?>
            </div>
            <div>
                <span class="RedZone">Prénom : </span><?php echo $userData[0]["prenom"]; ?>
            </div>
            <div>
                <span class="RedZone">Identifiant : </span><?php echo $userData[0]["num_compte"]; ?>
            </div>
            <div>
                <span class="RedZone">Adresse mail : </span><?php echo $userData[0]["email"]; ?>
            </div>
            <div>
                <span class="RedZone">Promo : </span><?php echo $userData[0]["promo"]; ?>
            </div>
            <div class="CenterProfil">
                <a href="../../includes/logout.php" class="ProfilButton">Me déconnecter</a>
            </div>
            <!--<div class="CenterProfil">
                <a href="../../includes/delete_account.php" class="ProfilButton">Supprimer mon compte</a>
            </div>-->
        </div>

        <div id="TransactionZone">
            <h3>Mes transactions</h3>
            <span class="TraitZone">Solde actuel : <?php echo $userData[0]["montant"]; ?>€</span>

            <?php if (!empty($transactionsList)) : ?>
                <table id="TransactionsProfilTable">
                    <tr>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>Information</th>
                    </tr>
                    <?php foreach ($transactionsList as $elem) : ?>
                        <tr>
                            <td><?php echo (new DateTime($elem["date"]))->format('d/m/Y \à H:i'); ?></td>
                            <td class="<?php echo (floatval($elem["montant"]) >= 0) ? 'PosMont' : 'NegMont'; ?>">
                                <?php echo $elem["montant"]; ?>€
                            </td>
                            <td><?php echo getTransactionTypeText($elem["type"]); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </table>
            <?php else : ?>
                <br>
                <p>Aucune transaction pour le moment !</p>
            <?php endif; ?>
        </div>
    </div>

    <?php require_once '../../includes/footer.php'; ?>
</body>

</html>

<?php
// Fonction pour obtenir le texte du type de transaction
function getTransactionTypeText($type)
{
    switch ($type) {
        case '1':
            return "Mouvement manuel";
        case '2':
            return "Commande en ligne";
        case '3':
            return "Commande au comptoir";
        case '4':
            return "Annulation commande";
        case '5':
            return "Dépôt initial";
        default:
            return "Type de transaction inconnu";
    }
}
?>