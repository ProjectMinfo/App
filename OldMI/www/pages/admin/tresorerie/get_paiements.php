<?php
if(isset($_GET["start"]) && isset($_GET["end"])){
    try{
        require_once '../../../includes/database.php'; //connexion BDD
        //récupération des dates de paiements
        $date_debut = $_GET['start'];
        $date_fin = $_GET['end'];
        // Convertir les dates en datetime
        $date_debut_datetime = $date_debut . ' 00:00:00';
        $date_fin_datetime = $date_fin . ' 23:59:59';
        $requete = $conn->prepare("SELECT * FROM commandes WHERE date BETWEEN :date_debut AND :date_fin AND etat != 3"); //requete et préparation
        $requete->bindParam(':date_debut', $date_debut_datetime);
        $requete->bindParam(':date_fin', $date_fin_datetime);
        $requete->execute();
        $datas = $requete->fetchAll(); //recupération des données

        $cpt_cb = 0;
        $cpt_cash = 0;
        $cpt_compte = 0;
        $nb_commandes = 0;
        $tot_cb = 0;
        $tot_espece = 0;
        $tot_mi = 0;
        foreach($datas as $data){
            switch($data["typepaiement"]){
                case 0:
                    $cpt_cb++;
                    $tot_cb += $data["prix"];
                    break;
                case 1:
                    $cpt_cash++;
                    $tot_espece += $data["prix"];
                    break;
                case 2:
                    $cpt_compte++;
                    $tot_mi += $data["prix"];
                    break;
            }
            $nb_commandes++;
        }

        echo "<br>";
        echo "Du ". $_GET["start"] . " au " . $_GET["end"];
        echo "<br>";
        echo $nb_commandes . " commandes";
        echo "<br>";
        echo "Par carte: " . $cpt_cb . " Total : ".$tot_cb."€";
        echo "<br>";
        echo "Par cash: " . $cpt_cash. " Total : ".$tot_espece."€";
        echo "<br>";
        echo "Par compte: " . $cpt_compte. " Total : ".$tot_mi."€";
        echo "<br><br>";
        echo "Liste des commandes sur cette période:";
        echo "<br><br>";
        echo "<table>";
        echo "<tr class='titre-tab'>";
        echo "<td>Numéro de transaction</td>";
        echo "<td>Commande Out</td>";
        echo "<td>Commande In</td>";
        echo "<td>Montant</td>";
        echo "<td>Type du paiement</td>";
        echo "<td>Etat</td>";
        echo "</tr>";
        foreach($datas as $data2){
            if($data2["commande_out"] == null){
                $commande_out = "Non";
            }
            else{
                $commande_out = $data2["commande_out"];
            }
            if($data2["commande_in"] == null){
                $commande_in = "Non";
            }
            else{
                $commande_in = $data2["commande_in"];
            }
            echo "<tr>";
            echo "<td>" . $data2["num_transaction"] ."</td>";
            if($commande_out == "Non"){
                echo "<td style='color:red;'>" . $commande_out ."</td>";
            }
            else{
                echo "<td>" . $commande_out ."</td>";
            }
            if($commande_in == "Non"){
                echo "<td style='color:red;'>" . $commande_in ."</td>";
            }
            else{
                echo "<td>" . $commande_in ."</td>";
            }
            echo "<td>" . $data2["prix"] ."</td>";
            switch($data2["typepaiement"]){
                case 0:
                    $typepaiement = "CB";
                    break;
                case 1:
                    $typepaiement = "Liquide";
                    break;
                case 2:
                    $typepaiement = "Compte Chti'MI";
                    break;
            }
            echo "<td>" . $typepaiement ."</td>";
            switch($data2["etat"]){
                case 0:
                    $etat = "Non payée";
                    break;
                case 1:
                    $etat = "En préparation";
                    break;
                case 2:
                    $etat = "Servie";
                    break;
                case 3:
                    $etat = "Annulée";
                    break;
            }
            echo "<td>" . $etat ."</td>";
            echo "</tr>";
        }
        echo "</table>";
    }
    catch(Exception $e){ //en cas d'erreur
        die("Erreur : " . $e->getMessage());
    }
}
else{
    echo "Aucune période selectionnée";
}
?>