<?php
session_start(); //démarrage de la session
require_once "../../includes/functions.php"; //importation des fonctions
areSetCookies(); //création de la session si cookies existent
if (!isConnected()){
    header("Location: ../index.php");
    exit();
} elseif (!isAdmin($conn,$_SESSION["utilisateur"]["uid"])) {
    header("Location: ../index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-witdh, initial-scale=1, maximum-scale=1">
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico">
    <title>Chti'MI | Modifier le compte n°<?php echo $_GET['id']; ?></title>
    <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="/assets/css/global.css">
    <link rel="stylesheet" href="/assets/css/forms.css">
</head>
<body>
    <?php
    require_once '../../includes/header.php';

    if(isset($_GET["id"])){
        try{
            require_once '../../includes/database.php'; //connexion BDD

            //récupération dans la BDD
            $requete = $conn->prepare("SELECT * FROM comptes WHERE id_compte = :id_compte"); //requete et préparation
            $requete->execute(
                array(":id_compte" => $_GET["id"])
            ); //execution de la requete
            $user = $requete->fetch(); //recupération des données
        }
        catch(Exception $e){ //en cas d'erreur
            die("Erreur : " . $e->getMessage());
        }
    }
    ?>
    <br>
    <a href="consultation_comptes.php" class="retour">< Retour</a>
    <div class="form-container">
        <div class="form">
            <section class="title-form"><strong>Modifier le compte n°<?php echo $_GET['id']; ?></strong></section><br>
            <form action="update_compte.php" method="post">
                <div>
                    Nom :
                    <input type="text" name="nom" id="nom" value="<?php echo $user["nom"]; ?>">
                </div>
                <div>
                    Prénom : 
                    <input type="text" name="prenom" id="prenom" value="<?php echo $user["prenom"]; ?>">
                </div>
                <div>
                    Mail : 
                    <input type="email" name="email" id="email" value="<?php echo $user["email"]; ?>">
                </div>
                <input type="hidden" name="email_old" id="email_old" value="<?php echo $user["email"]; ?>">
                <div>
                    Solde : 
                    <input type="number" name="montant" id="montant" value="<?php echo $user["montant"]; ?>" step="0.01">€
                </div>
                <input type="hidden" name="montant_old" id="montant_old" value="<?php echo $user["montant"]; ?>">
                <div>
                    Numéro de compte : 
                    <input type="number" name="num_compte" id="num_compte" min="1" max="999" value="<?php echo $user["num_compte"]; ?>">
                </div>
                <input type="hidden" name="num_compte_old" id="num_compte_old" min="1" max="999" value="<?php echo $user["num_compte"]; ?>">
                <input type="hidden" name="id" id="id" value="<?php echo $_GET["id"]; ?>">
                <div>
                    <?php
                        $Usr = "";
                        $Srv = "";
                        $Adm = "";
                        switch($user["acces"]){
                            case "0":
                                $Usr = "selected";
                                break;
                            case "1":
                                $Srv = "selected";
                                break;
                            case "2":
                                $Adm = "selected";
                                break;
                        }
                    ?>
                    Accès :
                    <select id="acces" required name="acces">
                        <option value="0" <?php echo $Usr; ?>>Utilisateur</option>
                        <option value="1" <?php echo $Srv; ?>>Serveur</option>
                        <option value="2" <?php echo $Adm; ?>>Administrateur</option>
                    </select>
                </div>
                <input type="submit" name="Modifier" value="Modifier" class="conn">
            </form>
            <?php
            if(isset($_GET["error"])){ //si on a un message d'erreur à afficher
                echo "<div class='error'>";
                if($_GET["error"] == "invalid_mail"){
                    echo "Vous devez utiliser votre adresse mail Junia";
                }
                else if($_GET["error"] == "mail_already_used"){
                    echo "Cette adresse mail est déjà utilisée";
                }
                else if($_GET["error"] == "invalid_account_number"){
                    echo "Le numéro de compte doit être compris entre 1 et 999";
                }
                else if($_GET["error"] == "num_account_already_used"){
                    echo "Ce numéro de compte est déjà utilisé, veuillez en choisir un autre";
                }
                else if($_GET["error"] == "wrong_access_code"){
                    echo "L'accès de l'utilisateur est invalide";
                }
                echo "</div>";
            }
            else if(isset($_GET["status"])){ //si on a un message d'erreur à afficher
                echo "<div class='success'>";
                if($_GET["status"] == "success"){
                    echo "Informations modifiées avec succès";
                }
                echo "</div>";
            }
            ?>
        </div>
    </div>
    <?php
    require_once '../../includes/footer.php';
    ?>
</body>
</html>