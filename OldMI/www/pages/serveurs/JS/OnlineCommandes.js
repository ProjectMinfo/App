//===================================================================//
//            Preview Pour Actualisation des Datas                   //
//===================================================================//
function OrganizeData(elem) {
    // Utilisation de la méthode split() pour séparer les éléments en utilisant ","
    const tableauElem = elem.split(",");
    // Retourner le tableau résultant
    return tableauElem;
}

async function ActualiseOnlineCommandes() {
    //Permet de mettre à jour les stocks avec les commandes en ligne
    let CommandeArrayToChange = [];

    let DataAPI = await fetch(`${path}?OnlineCommandesToActualise=${1}`);
    CommandeArrayToChange = await DataAPI.json();

    for (const elem of CommandeArrayToChange) {
        let stockLst = await ArrangeArray(elem["stock"]);
        await DeleteStock(stockLst, -1);
        await fetch(`${path}?SetOnlineCommandActualise=${elem["id_commande"]}`);

        let chaud = 0;
        let froid = 0;
        for (const plat of OrganizeData(elem["commande_in"])) {
            if (plat.includes("Panini") || plat.includes("Croque-Monsieur")) {
                chaud = 1;
            }
            if (plat.includes("Sandwich") || plat.includes("Hot-Dog")) {
                froid = 1;
            }

            if (plat.includes("Sandwich")) {
                //Traitement des baguettes avec les commandes en ligne
                let AllData = await fetch(`${path}?UpdateSandwichAmount=${-1}`);

            }

        }
        await fetch(`${path}?EditChaudFroidStatut=${chaud}&EditChaudFroidStatutId=${elem["id_commande"]}&EditStatut=${froid}`);

    }
}

ActualiseOnlineCommandes();

//===================================================================//
//            Initialisation des variables globales                  //
//===================================================================//

let OnlineMoyenPaiement = -1;
let CommandeOnlineData = [];

// TransactionNumber pour le numéro de transaction à mettre dans la BDD


//===================================================================//
//                      Fonctions Génériques                         //
//===================================================================//

async function DenyButtonOnline(i) {
    //Clic sur le bouton d'annulation de la commande, on remet les stocks et on supprime la commande
    let CommandeArrayToChange = [];
    let JsonCommandeData = await fetch(`${path}?CommandeInfo=${i}`);
    CommandeArrayToChange = await JsonCommandeData.json();
    let stockLst = await ArrangeArray(CommandeArrayToChange["stock"]);
    await fetch(`${path}?EditCommandeStatut=${i}&EditCommandeValue=${"3"}`);
    await DeleteStock(stockLst, 1);
    SynchronizeDataOnline();

    //Gestion du calcul du nombre de paninis / Sandwichs restants
    for (const PlatTest of CommandeArrayToChange["commande_in"].split(",")) {
        if (PlatTest.includes("Sandwich")) {
            let AllData = await fetch(`${path}?UpdateSandwichAmount=${1}`);
        }
    }
    ActualiseButtonData();

}

function RemoveSelectedPaiementOnline() {
    //Permet de retirer le choix précédent
    OnlineMoyenPaiement = -1;
    let Lst = document.getElementsByClassName("SelectPaiementOnline");
    for (const elem of Lst) {
        elem.classList.remove("SelectPaiementOnline");
    }
}

function SelectPaiementTypeOnline(elem, i, montant) {
    //Permet de traiter la sélection du moyen de paiement
    if ((document.getElementsByClassName("SelectPaiementOnline")).length !== 0) {
        RemoveSelectedPaiementOnline();
    }
    if (i === 2) { //Traitement du cas par compte Mi via la fonction d'affichage de la caisse
        ViewCaisse(-1 * montant, 2);
    }
    else { //Liquide et CB
        elem.classList.toggle("SelectPaiementOnline");
        OnlineMoyenPaiement = i;
    }
}

function createPaymentButton(id, iconName, buttonText, paymentType) {
    const button = document.createElement("button");
    button.className = "TypePaiementCommande";
    button.id = id;
    button.onclick = function () {
        SelectPaiementTypeOnline(this, paymentType, CommandeOnlineData["prix"]);
    };

    const icon = document.createElement("i");
    icon.className = "fa " + iconName;
    icon.setAttribute("aria-hidden", "true");

    button.appendChild(icon);
    button.appendChild(document.createTextNode(" " + buttonText));

    return button;
}

async function ValidButtonOnline(i) {
    //Bouton pour valider afficher le menu de validation d'une commande en ligne
    OpenMenu("ValidOnlineCommandeMenu");
    let JsonCommandeData = await fetch(`${path}?CommandeInfo=${i}`);
    CommandeOnlineData = await JsonCommandeData.json();
    document.getElementById("OnlinePaiementZone").innerHTML = "";

    document.getElementById("NameCommandeOnlineInput").value = CommandeOnlineData["nom"];
    document.getElementById("EditCommandeOnlineOutArea").value = CommandeOnlineData["commande_out"];
    document.getElementById("EditCommandeOnlineInArea").value = CommandeOnlineData["commande_in"];
    document.getElementById("EditCommandeOnlineCommentaire").value = CommandeOnlineData["commentaire"];
    document.getElementById("PrixZoneOnline").innerHTML = "Paiement : " + CommandeOnlineData["prix"] + "€";

    if (CommandeOnlineData["num_compte"]) {
        document.getElementById("OnlinePaiementZone").innerHTML = "Paiement via compte n°" + CommandeOnlineData["num_compte"];
    }
    else {
        const paymentZone = document.getElementById("OnlinePaiementZone");

        // Créer et ajouter les boutons
        const cbButton = createPaymentButton("CBOnline", "fa-credit-card", "CB", 0);
        const cashButton = createPaymentButton("CashOnline", "fa-money", "Liquide", 1);
        const compteButton = createPaymentButton("CompteOnline", "fa-paypal", "Compte", 2);

        paymentZone.appendChild(cbButton);
        paymentZone.appendChild(cashButton);
        paymentZone.appendChild(compteButton);
    }
}

//===================================================================//
//                      Fonctions Principales                        //
//===================================================================//

async function DisplayOnlineCommandes() {
    //Affichage du menu des commandes en ligne
    OpenMenu("OnlineCommandeMenu");

    document.getElementById("OnlineCommandeRechercheBar").value = "";
    document.getElementById("OnlineCommandeRechercheBar").addEventListener("input", SynchronizeDataOnline);

    SynchronizeDataOnline();
}

async function SynchronizeDataOnline() {
    //Synchronisation des commandes en ligne à afficher
    let DataCommandesOnline = [];

    let ResearchTxt = document.getElementById("OnlineCommandeRechercheBar");
    let DataAPI = await fetch(`${path}?OnlineCommandes=${1}`);
    DataCommandesOnline = await DataAPI.json();

    if (ResearchTxt.value !== "") {
        let Research = ResearchTxt.value.toLowerCase()
        let DataWithResearch = DataCommandesOnline.filter(el => el.nom.toLowerCase().includes(Research) || el.commande_in.toLowerCase().includes(Research) || el.commande_out.toLowerCase().includes(Research));
        CreateBlocForCommand(DataWithResearch);
    }
    else {
        CreateBlocForCommand(DataCommandesOnline);
    }

}

function CreateBlocForCommand(Lst) {
    //Utilisé : nom, commande_out, commande_in, id_commande, etat, date
    //Permet de créer le bloc de la commande
    const container = document.getElementById("OnlineCommandeContenu");
    container.innerHTML = "";

    for (const dataCommande of Lst) {

        const divBlocCommande = document.createElement("div");
        divBlocCommande.className = "BlocCommandeOnline";

        // Première ligne
        const divLigneCommande1 = document.createElement("div");
        divLigneCommande1.className = "ligneCommande";

        const divColonneCommande1 = document.createElement("div");
        divColonneCommande1.className = "colonneCommande CommandeLeftZone";
        divColonneCommande1.textContent = dataCommande["nom"];

        const divColonneCommande2 = document.createElement("div");
        divColonneCommande2.className = "colonneCommande CommandeZoneText";
        divColonneCommande2.textContent = dataCommande["commande_out"];

        if (!(estDateAujourdhui(dataCommande["date"]))) {
            divColonneCommande1.classList.add("LateCommande");
            divColonneCommande2.classList.add("LateCommande");
        }

        divLigneCommande1.appendChild(divColonneCommande1);
        divLigneCommande1.appendChild(divColonneCommande2);

        // Deuxième ligne
        const divLigneCommande2 = document.createElement("div");
        divLigneCommande2.className = "ligneCommande";

        const divColonneCommande3 = document.createElement("div");
        divColonneCommande3.className = "colonneCommande CommandeLeftZone";

        const denyIcon = document.createElement("i");
        denyIcon.className = "fa fa-times DenyCommandeButton ChangeButtonCommande";
        denyIcon.setAttribute("aria-hidden", "true");
        denyIcon.onclick = () => DenyButtonOnline(dataCommande["id_commande"]);

        const validIcon = document.createElement("i");
        validIcon.className = "fa fa-check ValidCommandeButton ChangeButtonCommande";
        validIcon.setAttribute("aria-hidden", "true");
        validIcon.onclick = () => ValidButtonOnline(dataCommande["id_commande"]);

        divColonneCommande3.appendChild(denyIcon);
        divColonneCommande3.appendChild(validIcon);

        const divColonneCommande4 = document.createElement("div");
        divColonneCommande4.className = "colonneCommande CommandeZoneText";
        divColonneCommande4.textContent = dataCommande["commande_in"];

        if (!(estDateAujourdhui(dataCommande["date"]))) {
            divColonneCommande4.classList.add("LateCommande");
        }

        divLigneCommande2.appendChild(divColonneCommande3);
        divLigneCommande2.appendChild(divColonneCommande4);

        // Ajouter les lignes au bloc de commande
        divBlocCommande.appendChild(divLigneCommande1);
        divBlocCommande.appendChild(divLigneCommande2);


        // Ajouter les éléments générés au DOM (par exemple, à un conteneur existant avec l'ID "container")
        const container = document.getElementById("OnlineCommandeContenu");
        container.appendChild(divBlocCommande);
    }

}

async function ValidCommandOnlineEditButton() {
    //Fonction de validation finale
    let TransNum = 0;
    if (CommandeOnlineData["num_compte"]) { //Paiement via compte Mi

        let Name = encodeURIComponent(document.getElementById("NameCommandeOnlineInput").value);
        let Out = encodeURIComponent(document.getElementById("EditCommandeOnlineOutArea").value);
        let In = encodeURIComponent(document.getElementById("EditCommandeOnlineInArea").value);
        let comm = encodeURIComponent(document.getElementById("EditCommandeOnlineCommentaire").value);

        let MoneyOnAccountJSON = await fetch(`${path}?MoneyOnAccount=${CommandeOnlineData["num_compte"]}`);
        let MoneyOnAccount = await MoneyOnAccountJSON.json();
        let NewAmount = parseFloat(MoneyOnAccount["montant"]) - parseFloat(CommandeOnlineData["prix"]);

        let NumTransaction = await fetch(`${path}?AddTransactionNum=${CommandeOnlineData["num_compte"]}&AddTransactionMontant=${-1 * CommandeOnlineData["prix"]}&AddTransactionType=${2}&AddTransactionIdServeur=${sessionId}&NewAmount=${NewAmount.toFixed(2)}`);
        TransNum = await NumTransaction.json();

        await fetch(`${path}?OnlineCommandeValidation=${parseInt(CommandeOnlineData["id_commande"])}&OnlineCommandeValidationIn=${In}&OnlineCommandeValidationOut=${Out}&OnlineCommandeValidationComm=${comm}&OnlineCommandeValidationName=${Name}&OnlineCommandeValidationTransaction=${parseInt(TransNum["id_transaction"])}&OnlineCommandeValidationType=${2}`);
        CloseMenu("ValidOnlineCommandeMenu");
        SynchronizeDataOnline();

    }
    else {
        if (document.getElementsByClassName("SelectPaiementOnline").length === 0) {
            alert("Merci de choisir un moyen de paiement");
            return;
        }
        else { //Paiement OK
            let Name = encodeURIComponent(document.getElementById("NameCommandeOnlineInput").value);
            let Out = encodeURIComponent(document.getElementById("EditCommandeOnlineOutArea").value);
            let In = encodeURIComponent(document.getElementById("EditCommandeOnlineInArea").value);
            let comm = encodeURIComponent(document.getElementById("EditCommandeOnlineCommentaire").value);
            if (OnlineMoyenPaiement === 2) {
                TransNum = TransactionNumber
            }
            await fetch(`${path}?OnlineCommandeValidation=${parseInt(CommandeOnlineData["id_commande"])}&OnlineCommandeValidationIn=${In}&OnlineCommandeValidationOut=${Out}&OnlineCommandeValidationComm=${comm}&OnlineCommandeValidationName=${Name}&OnlineCommandeValidationTransaction=${TransNum}&OnlineCommandeValidationType=${OnlineMoyenPaiement}`);
            CloseMenu("ValidOnlineCommandeMenu");
            SynchronizeDataOnline();
        }
    }
}