//[[Texte(Nom ou Hors-Menu), prix, prix_serveur, [Liste des ressources à retirer du stock], [(liste nom articles,BOOL : plat ou pas)]]

//===================================================================//
//            Initialisation des variables globales                  //
//===================================================================//

let Is_Serveur = 0; //0 si le client n'est pas serveur, 1 s'il est ( permet d'appliquer les prix serveurs )
let order = []; //Contient la commande du client qui sera affichée à droite du menu principal
let FinalLstIngredients = []; //Stock la liste de tous les ingrédients d'un plat lors de la sélection du plat
let data = []; //Contient toutes les informations sur un élement de la carte lors de sa sélection
somme = 0 //Prix total
path = 'https://maisonisen.fr/API/index.php'; //Chemin vers l'API
//path = 'http://localhost/API/index.php'; //Chemin vers l'API
EventIn = 0;


//===================================================================//
//                      Fonctions Génériques                         //
//===================================================================//

async function IsEventOccur() {
    let EventAsk = await fetch(`${path}?IsEvent=${"a"}`);
    let EventValue = await EventAsk.json();
    if (EventValue["value"] === '0' || EventValue["value"] === 0) {
        EventIn = 0;
    }
    else {
        EventIn = 1;
    }
}

async function DeleteOrder(i) {
    //Prend en paramétre la position i dans order de la "sous-commande" à supprimer
    order.splice(i, 1);
    UpdateCases(order);
}

function GetPosition(id) {
    //Renvoie la position de l'ingrédient d'identifiant id dans FinalLstIngredients
    for (let i = 0; i < FinalLstIngredients.length; i += 1) {
        if (FinalLstIngredients[i][0][0] == id) {
            return i;
        }
    }
}

async function ArrangeArray(arrayTab) {
    //Récupére et formate les ingrédients pour les plats et prend les 3 en compte
    //Exemple : 1,2,3;1,2,3 -> [[1,2,3],[1,2,3]]
    const rows = arrayTab.split(';'); // Divise la chaîne en lignes individuelles
    const result = rows.map(row => row.split(',')); // Divise chaque ligne en éléments individuels
    return result;
}

async function supprimerElementsCase(classeName) {
    //Supprime tous les éléments ayant la classe classeName
    const elementsCase = document.querySelectorAll(classeName);
    // Parcourir les éléments et les supprimer un par un
    elementsCase.forEach(function (element) {
        element.remove();
    });
}

async function RemoveClass(className) {

    // Retire la classe className de tous les éléments
    const elements = document.querySelectorAll('.' + className);
    // Parcourir les éléments et retirer la classe
    elements.forEach(function (element) {
        element.classList.remove(className);
    });
}

function CloseMenu(className) { //Ouvre le menu de class classname
    document.getElementById(className).style.display = 'none';
    if (className === "MenusMenu") {
        if (InMenu) {
            InMenu = false;
        }
    }

}
function OpenMenu(className) { //Ferme le menu de class classname
    document.getElementById(className).style.display = 'block';
}

async function UpdateCases(tableau) {
    //permet de mettre à jour le récap de la commande à droite

    await supprimerElementsCase('.case');
    var div = document.getElementById("PriceZone");
    div.textContent = `0€`;
    somme = 0;
    let i = 0;
    for (const element of tableau) {
        // Création de l'élément div avec la classe "case"
        const divCase = document.createElement("div");
        divCase.classList.add("case");

        // Création de l'élément span avec la classe "closebutton"
        const spanCloseButton = document.createElement("span");
        spanCloseButton.classList.add("closebutton");
        spanCloseButton.onclick = (function (index) {
            return function () {
                DeleteOrder(index);
            };
        })(i);

        // Création de l'élément i avec les classes "fa fa-times" pour l'icône
        const iconTimes = document.createElement("i");
        iconTimes.classList.add("fa", "fa-times");
        iconTimes.setAttribute("aria-hidden", "true");

        // Ajout de l'icône à l'élément span
        spanCloseButton.appendChild(iconTimes);

        // Création de l'élément div avec la classe "caseTitle"
        const divCaseTitle = document.createElement("div");
        divCaseTitle.classList.add("caseTitle");
        divCaseTitle.textContent = `${element[0]} : ${element[Is_Serveur + 1]}€`;
        somme += parseFloat(element[Is_Serveur + 1]);
        somme = parseFloat(somme.toFixed(2));

        // Création de l'élément div avec la classe "caseLst"
        const divCaseLst = document.createElement("div");
        divCaseLst.classList.add("caseLst");

        // Création des trois éléments p à l'intérieur de divCaseLst
        for (const article of element[4]) {
            const pElement = document.createElement("p");
            pElement.textContent = `${article[0]}`;
            divCaseLst.appendChild(pElement);
        }

        // Ajout des éléments créés à l'élément divCase
        divCase.appendChild(spanCloseButton);
        divCase.appendChild(divCaseTitle);
        divCase.appendChild(divCaseLst);

        // Récupération de l'élément avec l'ID "RecapLst"
        const recapLst = document.getElementById("RecapLst");

        // Ajout de l'élément divCase à l'élément avec l'ID "RecapLst"
        recapLst.appendChild(divCase);

        div.textContent = `${somme}€`;
        i = i + 1;
    }
}

function regrouperParPremierElement(tableau) {
    //const tableauExemple = [['6','2'],['6','1'],['5','3']];
    //console.log(resultat); // [['6','3'],['5','3']]
    //Voici la conversion
    const map = new Map();
    tableau.forEach((sousTableau) => {
        const premierElement = sousTableau[0];
        const elementActuel = map.get(premierElement);
        if (elementActuel) {
            elementActuel[1] = String(Number(elementActuel[1]) + Number(sousTableau[1]));
        } else {
            map.set(premierElement, sousTableau.slice());
        }
    });

    return Array.from(map.values());
}

//===================================================================//
//                     Actions sur Page Principale                   //
//===================================================================//

function Swap_Serveur_Button(elem) {
    //Permet de changer l'état du bouton et d'enregistrer ça dans Is_Serveur
    elem.classList.toggle("GreenToogle");
    if (!elem.classList.contains("GreenToogle")) {
        elem.innerHTML = 'Serveur : NON';
        Is_Serveur = 0;
        UpdateCases(order); //update les Prix
        return;
    }
    else {
        elem.innerHTML = 'Serveur : OUI';
        Is_Serveur = 1;
        UpdateCases(order); //Update les prix
        return;

    }
}

async function Select_Plat(value) {
    //Gestion des menus lorsque le serveur clique sur un plat
    let AllData = await fetch(`${path}?PlateID=${value}`); //Récupération des données de ce plat
    data = await AllData.json();

    if (value === 6 || value === '6') { //Gestion des évents
        let NewData = [];
        NewData.push("Hors-Menu EVENT");
        NewData.push(data[0]['prix']);
        NewData.push(data[0]['prix_serveur']);
        NewData.push([["58", "1"], ["2", "1"], ["3", "1"], ["6", "1"]]);
        NewData.push([["1 Croque-Monsieur Jambon Emmental Beurre", true]]);
        order.push(NewData);
        UpdateCases(order);

    }
    else if (value === 7 || value === '7') {
        let NewData = [];
        NewData.push("Hors-Menu EVENT");
        NewData.push(data[0]['prix']);
        NewData.push(data[0]['prix_serveur']);
        NewData.push([["58", "2"], ["2", "2"], ["3", "2"], ["6", "2"]]);
        NewData.push([["2 Croque-Monsieur Jambon Emmental Beurre", true]]);
        order.push(NewData);
        UpdateCases(order);
    }
    else {
        switch (data[0]["nom"]) {
            case "Sandwich":
                SandwichPlatSelection(data); //Fonction qui traite et Affiche les plats ui se vendent par quantité unique ( Sandwitch, Panini et Ramens )
                break;
            case "Panini":
                SandwichPlatSelection(data); //Fonction qui traite et Affiche les plats ui se vendent par quantité unique ( Sandwitch, Panini et Ramens )
                break;
            case "Ramens":
                SandwichPlatSelection(data); //Fonction qui traite et Affiche les plats ui se vendent par quantité unique ( Sandwitch, Panini et Ramens )
                break;
            case "Croque-Monsieur":
                MultiplePlatSelection(data, 2);
                break;
            case "Hot-Dog":
                MultiplePlatSelection(data, 2);
                break;
            default:
                SandwichPlatSelection(data);
                break;
        }
    }

}

async function Select_Object(value) {
    //Ajout à la commandes des boissons et plats hors menu
    let AllData = await fetch(`${path}?PlateID=${value}`);
    data = await AllData.json();
    let NewData = [];
    NewData.push("Hors-Menu");
    NewData.push(data[0]['prix']);
    NewData.push(data[0]['prix_serveur']);
    NewData.push(await ArrangeArray(data[0]['ingredientsPossibles']));
    NewData.push([[data[0]['nom'], false]]);
    order.push(NewData);
    UpdateCases(order);
}



//===================================================================//
//                     Zone d'edit des baguettes                     //
//===================================================================//

async function ActualiseButtonData() {
    //Permet d'actualiser les infos présentes sur le bouton
    let AllData = await fetch(`${path}?GetBaguetteInfo=${1}`);
    let BaguetteData = await AllData.json();
    document.getElementById("BaguetteZone").innerHTML = "Sandwichs : " + BaguetteData[0] + " | Paninis : " + BaguetteData[1];

    //Sécurité, il ne peut pas y avoir + de sandwichs que de paninis
    if (parseInt(BaguetteData[0]) > parseInt(BaguetteData[1])) {
        let AllData = await fetch(`${path}?ChangePaniniAmount=${BaguetteData[1]}&ChangeSandwichAmount=${BaguetteData[1]}`);
        ActualiseButtonData();
    }

    //Event en cours ?
    await IsEventOccur();

}
async function DisplayBaguetteMenu() {
    //Clic sur le bouton de gestion du nb de paninis et de sandwichs
    OpenMenu("BaguetteAmountMenu");

    let AllData = await fetch(`${path}?GetBaguetteInfo=${1}`);
    let BaguetteData = await AllData.json();
    document.getElementById("SandwichAmountInput").value = BaguetteData[0];
    document.getElementById("PaniniAmountInput").value = BaguetteData[1];

}

async function ChangeBaguetteAmount() {
    //Action lors du clic sur bouton valider changement du nombre de baguettes
    if (document.getElementById("SandwichAmountInput").value && document.getElementById("PaniniAmountInput").value) {
        let SandwichAmount = document.getElementById("SandwichAmountInput").value;
        let PaniniAmount = document.getElementById("PaniniAmountInput").value;
        if (parseInt(SandwichAmount) > parseInt(PaniniAmount)) {
            alert("Trop de sandwichs, impossible");
            return;
        }
        let AllData = await fetch(`${path}?ChangePaniniAmount=${PaniniAmount}&ChangeSandwichAmount=${SandwichAmount}`);
        CloseMenu("BaguetteAmountMenu");
        ActualiseButtonData();
    }
    else {
        alert("Il manque des valeurs");
        return;
    }
}