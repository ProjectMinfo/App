//===================================================================//
//            Initialisation des variables globales                  //
//===================================================================//

let UserData = []; //Data de compte en cours
let TypeData = 1;
let ComptesLstData = [];
let searchInputC = "";
let searchResultC = "";

//===================================================================//
//                      Fonctions Génériques                         //
//===================================================================//

function KeyDownMoney(elem) {
    //Détection du clic enter lors de l'écriture dans l'input
    if (event.key === 'Enter') {
        ChangeAmoutOnAccount(elem.value);
    }
}
function ButtonMoney() {
    //Permet de lancer la fonction DisplayCaisse lors du clic sur le bouton ou du press enter event
    ChangeAmoutOnAccount(document.getElementById("EditMontant").value);
}

function KeyDownNum(elem) {
    //Détection du clic enter lors de l'écriture dans l'input
    if (event.key === 'Enter') {
        DisplayCaisse(elem.value);
    }
}
function SearchByNum() {
    //Permet de lancer la fonction DisplayCaisse lors du clic sur le bouton ou du press enter event
    DisplayCaisse(document.getElementById("searchByNum").value);
}

function convertirFormatDate(dateString) {
    const [annee, mois, jour, heures, minutes] = dateString.match(/\d+/g);
    return `${jour}/${mois}/${annee} à ${heures}:${minutes}`;
}

async function SeeLastTransactions(num) {
    //Permet de charger et afficher la liste des 5 dernières transactions dans le tableau
    let DataJson = await fetch(`${path}?UserIDTransactions=${num}`); //Récupération des données de ce plat
    let TransactionsData = await DataJson.json();

    //Ajout des en-têtes du tableau
    var tableauC = document.getElementById("MonTableauCaisse");
    var newRow = document.createElement("tr");

    var dateCell = document.createElement("th");
    dateCell.textContent = "Date";

    var montantCell = document.createElement("th");
    montantCell.textContent = "Montant";

    var infoCell = document.createElement("th");
    infoCell.textContent = "Information";
    newRow.appendChild(dateCell);
    newRow.appendChild(montantCell);
    newRow.appendChild(infoCell);

    tableauC.appendChild(newRow);

    for (const elem of TransactionsData) {
        var newRow = document.createElement("tr");

        var dateCell = document.createElement("td");
        dateCell.textContent = convertirFormatDate(elem["date"]);

        var montantCell = document.createElement("td");
        montantCell.textContent = elem["montant"] + "€";

        var infoCell = document.createElement("td");

        switch (elem["type"]) {
            case 5:
                infoCell.textContent = "Dépôt Initial";
                break;
            case 1:
                infoCell.textContent = "Mouvement manuel";
                break;
            case 2:
                infoCell.textContent = "Commande en ligne";
                break;
            case 3:
                infoCell.textContent = "Commande au comptoir";
                break;
            case 4:
                infoCell.textContent = "Annulation Commande";
                break;
        }

        newRow.appendChild(dateCell);
        newRow.appendChild(montantCell);
        newRow.appendChild(infoCell);

        tableauC.appendChild(newRow);
    }
}

function CreateOptions(lst) {
    var Zone = document.getElementById("BackZone");
    lst.forEach(element => {
        var NewOption = document.createElement("div");
        NewOption.classList.add("proposition");
        NewOption.onclick = function () {
            DisplayCaisse(parseInt(element.num_compte));
        };
        NewOption.innerHTML = element.num_compte + " - " + element.nom + " " + element.prenom;
        Zone.appendChild(NewOption);
    });

}

function filterData(e) {
    searchResultC.innerHTML = "";
    const SearchString = e.target.value.toLowerCase();
    if (SearchString !== "") {
        const FilterDatArray = ComptesLstData.filter(el => el.nom.toLowerCase().includes(SearchString) || el.prenom.toLowerCase().includes(SearchString));
        CreateOptions(FilterDatArray);
    }

}

//===================================================================//
//                      Fonctions Principales                        //
//===================================================================//

async function ViewCaisse(i, t) {
    //Fonction d'ouverture de la page d'accès aux comtpes
    OpenMenu('CompteAccess');
    searchInputC = document.getElementById("searchByName");
    searchResultC = document.getElementById("BackZone");
    searchInputC.addEventListener("input", filterData);
    document.getElementsByClassName('TableauC')[0].innerHTML = "";
    document.getElementsByClassName('NameCZone')[0].innerHTML = "";
    document.getElementsByClassName('SoldeCZone')[0].innerHTML = "";
    document.getElementById("EditMontant").value = i;
    document.getElementById("BackZone").innerHTML = "";

    //Reset des anciennes recherches
    searchInputC.value = "";
    document.getElementById("searchByNum").value = "";

    //Chargement de tous les comtpes pour la recherche dynamique
    let DataJson = await fetch(`${path}?GetUsersLst=1`);
    ComptesLstData = await DataJson.json();

    if (i) {
        TypeData = t;
    }
    else {
        TypeData = 1;
    }
}

async function DisplayCaisse(num) {
    //Affichage de la caisse du client
    document.getElementsByClassName('TableauC')[0].innerHTML = "";
    document.getElementById("BackZone").innerHTML = "";
    let DataJson = await fetch(`${path}?UserID=${num}`); //Récupération des données de ce plat
    UserData = await DataJson.json();
    UserData = UserData[0];

    if (UserData === undefined) { //Le compte n'existe pas
        alert("Ce compte n'existe pas.");
    }
    else { //Le compte existe
        CompteAccount = num
        document.getElementsByClassName('NameCZone')[0].innerHTML = num + " - " + UserData["nom"] + " " + UserData["prenom"] + " - Promo " + UserData["promo"];
        document.getElementsByClassName('SoldeCZone')[0].innerHTML = "Solde : " + UserData["montant"] + "€";

        //Partie Affichage des 5 dernières transactions
        await SeeLastTransactions(num);
    }
}

async function ChangeAmoutOnAccount(money) {
    //Permet de changer la quantité d'argent sur le compte

    if (!money || money === 0.0) { //Vérification de sécurtié
        alert("Valeur incorrecte");
        return;
    }
    money = Math.round(parseFloat(money) * 100) / 100 //On met au format float

    if (money < 0) {
        if (parseFloat(UserData["montant"]) < 0) { //Check que le montant est suffisant
            alert("Montant insuffisant sur le compte");
            return
        }
    }

    let NewAmount = parseFloat(UserData["montant"]) + money;
    let NumTransaction = await fetch(`${path}?AddTransactionNum=${UserData["num_compte"]}&AddTransactionMontant=${money}&AddTransactionType=${TypeData}&AddTransactionIdServeur=${sessionId}&NewAmount=${NewAmount}`);
    DisplayCaisse(UserData["num_compte"]);

    if (TypeData !== 1) { //Permet d'accélérer la prise de commande ( partie paiement de la commande côté serveurs )
        MoyenPaiementClient = 2;
        OnlineMoyenPaiement = 2;
        if (document.getElementById("Compte")) {
            document.getElementById("Compte").classList.toggle("SelectPaiement");
        }
        if (document.getElementById("CompteOnline")) {
            document.getElementById("CompteOnline").classList.toggle("SelectPaiementOnline");
        }
        AccountNumber = UserData["num_compte"];
        TransactionNumber = await NumTransaction.json();
        TransactionNumber = TransactionNumber["id_transaction"];
        CloseMenu("CompteAccess");
    }

}