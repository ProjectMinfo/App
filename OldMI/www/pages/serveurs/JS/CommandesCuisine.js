//===================================================================//
//            Initialisation des variables globales                  //
//===================================================================//

let IdCommandInEdit = 0;
let ChaudCuisineTxt = "";
let FroidCuisineTxt = "";
let diff = false;

//===================================================================//
//                      Fonctions Génériques                         //
//===================================================================//

async function EditCommande(i) {
    //Bouton Edit une commande, Charge les données et affiche le menu d'edit de la commande
    IdCommandInEdit = i;
    OpenMenu("EditCommandeMenu");

    //Chargement de toutes les données
    let JsonCommandeData = await fetch(`${path}?CommandeInfo=${i}`);
    let CommandeData = await JsonCommandeData.json();

    //Mise à jour des différents champs
    let CommandeName = document.getElementById("NameCommandeInput");
    CommandeName.value = CommandeData["nom"];
    let CommandeOut = document.getElementById("EditCommandeOutArea");
    CommandeOut.value = CommandeData["commande_out"];
    let CommandeIn = document.getElementById("EditCommandeInArea");
    CommandeIn.value = CommandeData["commande_in"];
    let Commentaire = document.getElementById("EditCommandeCommentaire");
    Commentaire.value = CommandeData["commentaire"];
}

async function ValidButtonCommande(i, TypeCuisine) {
    //Bouton de Validation d'une commande
    if (typeof (TypeCuisine) !== 'undefined') { //Commande double ( validation partielle )
        await fetch(`${path}?EditParticularCommandeStatut=${i}&EditParticularCommandeStatutZone=${TypeCuisine}`);
        console.log(`${path}?EditParticularCommandeStatut=${i}&EditParticularCommandeStatutZone=${TypeCuisine}`);
    }
    else { //Commande unique -> Validation totale de la commande
        await fetch(`${path}?EditCommandeStatut=${i}&EditCommandeValue=${"2"}`);
    }
    ActualiseLstCommandesEnCours();
}

async function DenyButtonCommande(i) {
    //Bouton d'Annulation d'une commande

    let JsonCommandeData = await fetch(`${path}?CommandeInfo=${i}`);
    let CommandeData = await JsonCommandeData.json();

    //Edit du statut de la commande
    await fetch(`${path}?EditCommandeStatut=${i}&EditCommandeValue=${"3"}`);

    //Remise en stock des produits
    let stockLst = await ArrangeArray(CommandeData["stock"]);
    await DeleteStock(stockLst, 1);

    //Gestion du calcul du nombre de paninis / Sandwichs restants
    for (const PlatTest of CommandeData["commande_in"].split(",")) {
        if (PlatTest.includes("Sandwich")) {
            let AllData = await fetch(`${path}?UpdateSandwichAmount=${1}`);
        }
    }
    ActualiseButtonData();

    //Remise Argent sur le compte
    if (CommandeData["num_transaction"] !== 0) {
        //Si l'utilisateur a payé avec son compte

        let tmp = await fetch(`${path}?TransactionsInfo=${CommandeData["num_transaction"]}`);
        let CompteNum = await tmp.json();

        tmp = await fetch(`${path}?MoneyOnAccount=${CompteNum["num_compte"]}`);
        console.log(`${path}?MoneyOnAccount=${CompteNum["num_compte"]}`);
        let MoneyAmount = await tmp.json();
        let NewAmount = parseFloat(MoneyAmount["montant"]) + parseFloat(CommandeData["prix"]);

        await fetch(`${path}?AddTransactionNum=${CompteNum["num_compte"]}&AddTransactionMontant=${CommandeData["prix"]}&AddTransactionType=${4}&AddTransactionIdServeur=${sessionId}&NewAmount=${NewAmount}`);
        alert("Remboursement sur le compte Mi effectué");

    }

    ActualiseLstCommandesEnCours();
}

function estDateAujourdhui(dateStr) {
    // Convertir la chaîne de caractères en objet Date
    const dateFournie = new Date(dateStr);

    // Obtenir la date d'aujourd'hui
    const dateAujourdhui = new Date();

    // Comparer les années, les mois et les jours
    const memeAnnee = dateFournie.getFullYear() === dateAujourdhui.getFullYear();
    const memeMois = dateFournie.getMonth() === dateAujourdhui.getMonth();
    const memeJour = dateFournie.getDate() === dateAujourdhui.getDate();

    // Vérifier si c'est la même date (année, mois et jour)
    return memeAnnee && memeMois && memeJour;
}

function OrganizeData(elem) {
    // Utilisation de la méthode split() pour séparer les éléments en utilisant ","
    const tableauElem = elem.split(",");
    // Retourner le tableau résultant
    return tableauElem;
}

function CreateBloc(Lst) {
    //Utilisé : nom, commande_out, commande_in, id_commande, etat, date, chaud, froid
    //Permet de créer le bloc de la commande
    const container = document.getElementById("CurrentCommandeContenu");
    container.innerHTML = "";

    for (const dataCommande of Lst) {

        diff = false;
        if (dataCommande["chaud"] && dataCommande["froid"]) {
            diff = true;
            let CommandeCuisineTxt = OrganizeData(dataCommande["commande_in"]);
        
            for (const plat of CommandeCuisineTxt) {
                if (plat.includes("Panini") || plat.includes("Croque-Monsieur")) {
                    ChaudCuisineTxt += ChaudCuisineTxt ? `,${'\n'}${plat}` : plat;
                }
                if (plat.includes("Sandwich") || plat.includes("Hot-Dog")) {
                    FroidCuisineTxt += FroidCuisineTxt ? `,${'\n'}${plat}` : plat;
                }
            }
        }
        

        const divBlocCommande = document.createElement("div");
        divBlocCommande.className = "BlocCommande";

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

        const editIcon = document.createElement("i");
        editIcon.className = "fa fa-pencil-square-o EditCommandeButton ChangeButtonCommande";
        editIcon.setAttribute("aria-hidden", "true");
        editIcon.onclick = () => EditCommande(dataCommande["id_commande"]);

        const denyIcon = document.createElement("i");
        denyIcon.className = "fa fa-times DenyCommandeButton ChangeButtonCommande";
        denyIcon.setAttribute("aria-hidden", "true");
        denyIcon.onclick = () => DenyButtonCommande(dataCommande["id_commande"]);

        const validIcon = document.createElement("i");
        validIcon.className = "fa fa-check ValidCommandeButton ChangeButtonCommande";

        if (diff === true) {

            if (dataCommande["chaud"] == "2") {
                divLigneCommande2.classList.add("VertPastel");
            }
            else {
                validIcon.setAttribute("aria-hidden", "true");
                validIcon.onclick = () => ValidButtonCommande(dataCommande["id_commande"], 'chaud');
            }
        }
        else {

            validIcon.setAttribute("aria-hidden", "true");
            validIcon.onclick = () => ValidButtonCommande(dataCommande["id_commande"]);
        }


        //Setup des couleurs et cases en conséquences
        if (dataCommande["etat"] == '1') { //En cuisine
            divBlocCommande.classList.add("BleuPastel");
            divColonneCommande3.appendChild(editIcon);
            divColonneCommande3.appendChild(denyIcon);
            if (dataCommande["chaud"] !== "2") {
                divColonneCommande3.appendChild(validIcon);
            }
        }
        else if (dataCommande["etat"] == '2') { //Validé
            divBlocCommande.classList.add("VertPastel");
            divColonneCommande3.innerHTML = "Servie";
        }
        else if (dataCommande["etat"] == '3') { //Annulé
            divBlocCommande.classList.add("RosePastel");
            divColonneCommande3.innerHTML = "Annulée";
        }




        const divColonneCommande4 = document.createElement("div");
        divColonneCommande4.className = "colonneCommande CommandeZoneText";
        if (diff === true) {
            divColonneCommande4.textContent = ChaudCuisineTxt;
        }
        else {
            divColonneCommande4.textContent = dataCommande["commande_in"].replace(/,/g, ',\n');
        }


        if (!(estDateAujourdhui(dataCommande["date"]))) {
            divColonneCommande4.classList.add("LateCommande");
        }

        divLigneCommande2.appendChild(divColonneCommande3);
        divLigneCommande2.appendChild(divColonneCommande4);


        // Ajouter les lignes au bloc de commande
        divBlocCommande.appendChild(divLigneCommande1);
        divBlocCommande.appendChild(divLigneCommande2);

        if (diff === true) {
            // Troisième ligne
            const divLigneCommande3 = document.createElement("div");
            divLigneCommande3.className = "ligneCommande";

            const divColonneCommande3 = document.createElement("div");
            divColonneCommande3.className = "colonneCommande CommandeLeftZone";


            if (dataCommande["froid"] == "2") {
                divLigneCommande3.classList.add("VertPastel");
            }
            else {
                const validIcon = document.createElement("i");
                validIcon.className = "fa fa-check ValidCommandeButton ChangeButtonCommande";
                validIcon.setAttribute("aria-hidden", "true");
                validIcon.onclick = () => ValidButtonCommande(dataCommande["id_commande"], 'froid');

                divColonneCommande3.appendChild(validIcon);
            }


            const divColonneCommande4 = document.createElement("div");
            divColonneCommande4.className = "colonneCommande CommandeZoneText";
            divColonneCommande4.textContent = FroidCuisineTxt;



            if (!(estDateAujourdhui(dataCommande["date"]))) {
                divColonneCommande4.classList.add("LateCommande");
            }

            divLigneCommande3.appendChild(divColonneCommande3);
            divLigneCommande3.appendChild(divColonneCommande4);
            divBlocCommande.appendChild(divLigneCommande3);
        }


        // Ajouter les éléments générés au DOM (par exemple, à un conteneur existant avec l'ID "container")
        const container = document.getElementById("CurrentCommandeContenu");
        container.appendChild(divBlocCommande);

        ChaudCuisineTxt = "";
        FroidCuisineTxt = "";
    }

}

function maFonctionClickCheckBox() {
    ActualiseLstCommandesEnCours();
}



//===================================================================//
//                      Fonctions Principales                        //
//===================================================================//

async function ActualiseLstCommandesEnCours() {
    //Permet de mettre à jour les données affichées
    let FilterDatArray = [];

    let TxtZone = document.getElementById("CurrentCommandeSearchBar");

    //Chargement de tous les comtpes pour la recherche dynamique
    let DataJson = await fetch(`${path}?CommandesEnCours=1`);
    let DataCommandesEnCours = await DataJson.json();


    const OnlyCuisine = document.getElementById("OnCuisineZone").checked;
    if (OnlyCuisine) {
        FilterDatArray = DataCommandesEnCours.filter(el => el.etat === 1);
    }
    else {
        FilterDatArray = DataCommandesEnCours
    }

    if (TxtZone.value !== "") {
        let Research = TxtZone.value.toLowerCase()
        let DataWithResearch = FilterDatArray.filter(el => el.nom.toLowerCase().includes(Research) || el.commande_in.toLowerCase().includes(Research) || el.commande_out.toLowerCase().includes(Research));
        CreateBloc(DataWithResearch);
    }
    else {
        CreateBloc(FilterDatArray);
    }
}

async function ShowCommandesInCuisine() {
    //Clic bouton pour ouverture de la page
    OpenMenu("CurrentCommandesMenu");
    document.getElementById("OnCuisineZone").addEventListener("click", maFonctionClickCheckBox);
    document.getElementById("CurrentCommandeSearchBar").addEventListener("input", ActualiseLstCommandesEnCours);
    ActualiseLstCommandesEnCours();

    let TxtZoneBox = document.getElementById("CurrentCommandeSearchBar");
    let CuisineBox = document.getElementById("OnCuisineZone");
    TxtZoneBox.value = "";
    CuisineBox.checked = true;
}

async function ValidCommandEditButton() {
    let CommandeName = document.getElementById("NameCommandeInput");
    let CommandeOut = document.getElementById("EditCommandeOutArea");
    let CommandeIn = document.getElementById("EditCommandeInArea");
    let Commentaire = document.getElementById("EditCommandeCommentaire");
    console.log(Commentaire.value);

    let DataJson = await fetch(`${path}?UpdateCommandeId=${IdCommandInEdit}&UpdateCommandeName=${encodeURIComponent(CommandeName.value)}&UpdateCommandeOut=${encodeURIComponent(CommandeOut.value)}&UpdateCommandeIn=${encodeURIComponent(CommandeIn.value)}&UpdateCommandeComm=${encodeURIComponent(Commentaire.value)}`);
    CloseMenu("EditCommandeMenu");
}
