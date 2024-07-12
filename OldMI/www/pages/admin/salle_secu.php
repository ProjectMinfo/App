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
        <title>Chti'MI | Salle et sécurité</title>
        <link rel="stylesheet" href="/assets/css/bootstrap-reboot.min.css">
        <link rel="stylesheet" href="/assets/css/global.css">
        <link rel="stylesheet" href="/assets/css/salle_secu.css">
    </head>
    <body>
        <?php
        require_once '../../includes/header.php';
        require_once '../../includes/admin_panel.php';
        require_once '../../includes/database.php';
        ?>
        <?php if(isset($_SESSION['error'])){
                    ?>
                    <p><?=$_SESSION['error']?></p>
                    <?php
                    unset($_SESSION['error']);
                }?>
                <?php if(isset($_SESSION['succes'])){
                    ?>
                    <p><?=$_SESSION['succes']?></p>
                    <?php
                    unset($_SESSION['succes']);
                }?>
        <div class="row">
            <div id="temp-side" class="col-mid">
                
                <h2>Relevés des températures</h2>
                <input type="text" id="rechercher-temp" class="search-bar" placeholder="Rechercher un relevé de température">
                <br>
                <button onclick="add_temperature()" class="btn add-btn">Ajouter un relevé</button>
                
                <?php $releveList = getRelevesTemp($conn);?>
                <table>
                    <thead>
                        <tr>
                            <th>Date et heure</th>
                            <th>Température frigo 1</th>
                            <th>Température frigo 2</th>
                            <th>Membre ayant effectué le relevé</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $previous = 1;
                        foreach($releveList as $releve){
                            $DateTime = new DateTime($releve["date"]);
                            if($previous == 1){
                                echo "<tr class='ligne-temp odd'>";
                                $previous = 0;
                            }
                            else{
                                echo "<tr class='ligne-temp'>";
                                $previous = 1;
                            }
                            ?>
                                <td class="date"><?=$DateTime->format('d/m/Y \à H:i')?></td>
                                <td><?=$releve['tmp1']?></td>
                                <td><?=$releve['tmp2']?></td>
                                <td><?=$releve['NomMembre']?></td>
                            </tr>
                            <?php
                        }?>
                    </tbody>
                </table>
            </div>
            <div class="col-mid">
                <h2>Nettoyages</h2>
                <input type="text" id="rechercher-nettoyage" class="search-bar" placeholder="Rechercher un nettoyage">
                <br>
                <button onclick="add_nettoyage()" class="btn add-btn">Ajouter un nettoyage</button>
                
                <?php $nettoyageList = getNettoyages($conn);?>
                <table>
                    <thead>
                        <tr>
                            <th>Date et heure</th>
                            <th>Commentaire</th>
                            <th>Membre ayant effectué le relevé</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        $previous = 1;
                        foreach($nettoyageList as $nettoyage){
                            $DateTime = new DateTime($nettoyage["date"]);
                            if($previous == 1){
                                echo "<tr class='ligne-nettoyage odd'>";
                                $previous = 0;
                            }
                            else{
                                echo "<tr class='ligne-nettoyage'>";
                                $previous = 1;
                            }
                            ?>
                                <td class="date"><?=$DateTime->format('d/m/Y \à H:i')?></td>
                                <td><?=$nettoyage['explication']?></td>
                                <td><?=$nettoyage['nom_membre']?></td>
                            </tr>
                            <?php
                        }?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php require_once '../../includes/footer.php'; ?>
        <script src="/assets/js/jquery.min.js"></script>
        <script src="salle_secu.js"></script>
        <script src="chercher-ss.js"></script>
    </body>
</html>