//Type de Paiemment : 
//      0 : CB
//      1 : Liquide
//      2 : Compte MI   

//===================================================================//
//            Initialisation des variables globales                  //
//===================================================================//

let NameClient = ""; //Nom du client
//somme pour le total de la commande
let MoyenPaiementClient = -1; //0 : CB ; 1 : Liquide ; 2 : Compte Mi
let TransactionNumber = 0; //Permet d'enregistrer le numéro de la transaction
let AccountNumber = 0; //Je pense que ça sert à rien mais osef

let LstToShow = [];
let LstNotToShow = [];

//===================================================================//
//                      Fonctions Génériques                         //
//===================================================================//

function GetElementsToDisplay() {
    //Permet de séparer en 2 tableaux les éléments à afficher en cuisine et ceux à ne pas afficher en cuisine
    LstToShow = [];
    LstNotToShow = [];
    for (const commande of order) {
        for (const elem of commande[4]) {
            if (elem[1] === false) {
                LstNotToShow.push(elem[0]);
            }
            else {
                LstToShow.push(elem[0]);
            }
        }
    }
    return [LstToShow, LstNotToShow];
}

function RemoveSelectedPaiement() {
    //Permet de retirer le choix précédent
    MoyenPaiementClient = -1;
    let Lst = document.getElementsByClassName("SelectPaiement");
    for (const elem of Lst) {
        elem.classList.remove("SelectPaiement");
    }
}

function SelectPaiementType(elem, i) {
    //Permet de traiter la sélection du moyen de paiement
    if ((document.getElementsByClassName("SelectPaiement")).length !== 0) {
        RemoveSelectedPaiement();
    }
    if (i === 2) { //Traitement du cas par compte Mi via la fonction d'affichage de la caisse
        ViewCaisse(-1 * somme, 3);
    }
    else { //Liquide et CB
        elem.classList.toggle("SelectPaiement");
        MoyenPaiementClient = i;
    }
}

function PrepareLstToPushToDB(lst) {
    //Permet de convertir la liste des stocks en un string pour pouvoir être ajouté à la base de données
    let FinalLst = "";
    for (const elem of lst) {
        FinalLst += elem[0] + "," + elem[1] + ";";
    }
    return FinalLst.substring(0, FinalLst.length - 1);;
}

async function DeleteStock(lst, signe) {
    for (const elem of lst) {
        await fetch(`${path}?DeleteStockQtyID=${elem[0]}&DeleteStockQty=${signe * elem[1]}`);
    }
}

//===================================================================//
//                      Fonctions Principales                        //
//===================================================================//

function FinalValidation() {
    //Fonction lors du clic sur le bouton valider
    if (order.length === 0) {
        alert("Aucune commande");
    }
    else if ((document.getElementById("NameInput").value === "") && (GetElementsToDisplay()[0].length > 0)) {
        alert("Merci d'indiquer un nom");
    }
    else {
        OpenMenu('PaiementMenu');
        NameClient = document.getElementById("NameInput").value;
        document.getElementById("PaiementTxt").innerHTML = "Récap - " + NameClient;
        document.getElementById("totalPaiement").innerHTML = "Total : " + somme + "€";
        RemoveSelectedPaiement(); //Suprresion du moyen de paiement précédent
    }
}

async function LastValidation() {
    //Validation finale du paiement et lancement de la commande.
    if (MoyenPaiementClient === -1) {
        alert("Merci de sélectionner un Moyen de Paiement");
        return;
    }
    else {
        GetElementsToDisplay();

        if (MoyenPaiementClient !== 2) { //Si la commande n'est pas payée par CompteMi
            TransactionNumber = 0;
        }

        let TotalStockLst = [];
        let MenuCode = 0;
        for (const elem of order) {

            //Liste des produits à retirer des stocks
            for (const stock of elem[3]) {
                TotalStockLst.push([stock[0], stock[1]]);
            }

            //Check si la commande est un menu ou pas
            if (elem[0] === "Ch'tite Faim") {
                MenuCode = 1;
            }
            else if (elem[1] === "P'tit QuinQuin") {
                MenuCode = 2;
            }
            else if (elem[1] === "T'Cho Biloute") {
                MenuCode = 3;
            }
        }

        //Gestion du calcul du nombre de paninis / Sandwichs restants
        for (const PlatTest of LstToShow) {
            if (PlatTest.includes("Sandwich")) {
                let AllData = await fetch(`${path}?UpdateSandwichAmount=${-1}`);
            }
        }

        TotalStockLst = regrouperParPremierElement(TotalStockLst); //Réarangement de la liste des stocks à retirer
        let Commentaire = document.getElementById("CommentaireArea").value;
        await DeleteStock(TotalStockLst, -1);

        //Triage pour les commandes chaudes & froides
        //0 : RAS
        //1 : A cuisiner
        //2 : Servie
        let chaud = 0;
        let froid = 0;
        for (const plat of LstToShow) {
            if (plat.includes("Panini") || plat.includes("Croque-Monsieur") || plat.includes("Buritos")) {
                chaud = 1;
            }
            if (plat.includes("Sandwich") || plat.includes("Hot-Dog")) {
                froid = 1;
            }

        }

        let result = -1;
        let v;
        if (LstToShow.length === 0) {
            v = await fetch(`${path}?AddCommandeTransNum=${TransactionNumber}&AddCommandeNom=${NameClient}&AddCommandeOut=${LstNotToShow}&AddCommandeIn=${LstToShow}&AddCommandePrix=${somme}&AddCommandeTypePaiement=${MoyenPaiementClient}&AddCommandeEtat=${2}&AddCommandeStock=${PrepareLstToPushToDB(TotalStockLst)}&AddCommandeMenu=${MenuCode}&AddCommandeComm=${Commentaire}&chaud=${chaud}&froid=${froid}`);
            result = await v.json();
        }
        else {
            v = await fetch(`${path}?AddCommandeTransNum=${TransactionNumber}&AddCommandeNom=${NameClient}&AddCommandeOut=${LstNotToShow}&AddCommandeIn=${LstToShow}&AddCommandePrix=${somme}&AddCommandeTypePaiement=${MoyenPaiementClient}&AddCommandeEtat=${1}&AddCommandeStock=${PrepareLstToPushToDB(TotalStockLst)}&AddCommandeMenu=${MenuCode}&AddCommandeComm=${Commentaire}&chaud=${chaud}&froid=${froid}`);
            result = await v.json();
        }

        if (result != 1) {
            console.log(result);
            alert("Erreur Site");
        }
        else {
            window.location.reload();
        }


    }
}