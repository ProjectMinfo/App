//===================================================================//
//               Initialisation des variables globales               //
//===================================================================//

SnackAmount = 0;
InMenu = false;

//Forme -> [[Lst Ressources à retirer du stock],NomArticle,BOOL:Plat ou pas]
PlatLst = [[], []];


Zone = 0 // 0 pour le PlateOne et 1 pour le PlateTwo

dataMenu = [];

//Assemblage final sera fait lors de la validation

//===================================================================//
//                       Fonctions génériques                        //
//===================================================================//


async function Select_Plat_In_Menu(bouton, value, quantity, InfoZone) {
    //Gestion des menus lorsque le serveur clique sur un plat
    Zone = InfoZone; //Setup de la Zone du repas

    if (bouton.classList.contains("SelectedPlate")) { //Permet de désélectionner le plat
        bouton.classList.toggle("SelectedPlate");
        PlatLst[Zone] = [];
    }
    else {
        if (PlatLst[Zone].length === 0) { //Sélection du plat

            const ParentDiv = bouton.parentNode;
            const enfants = ParentDiv.children;

            //Permet de supprimer les erreurs de sélection
            for (const enfant of enfants) {
                if (enfant.classList.contains("SelectedPlate")) {
                    enfant.classList.toggle("SelectedPlate");
                    break; // Sortir de la boucle dès qu'on trouve un élément avec la classe recherchée
                }
            }

            bouton.classList.toggle("SelectedPlate");
            let AllData = await fetch(`${path}?PlateID=${value}`); //Récupération des données de ce plat
            data = await AllData.json();
            quantity = parseInt(quantity);
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
                    MultiplePlatSelection(data, quantity);
                    break;
                case "Hot-Dog":
                    MultiplePlatSelection(data, quantity);
                    break;
                default: //Burger
                    SandwichPlatSelection(data);
                    break;
            }
        }
        else { //un autre plat est déjà sélectionné
            alert("Un Seul plat");
        }
    }


}

//===================================================================//
//                       Fonctions Affichages                        //
//===================================================================//

async function RemplissageCaseFirstMenu() { //permet de remplir la case en haut à gauche avec la liste des plats
    let AskAPIAboutIngredients = await fetch(`${path}?PlateType=0`); //je récupére les informations sur l'ingrédient
    let PlatsLst = await AskAPIAboutIngredients.json();
    document.createElement("button");
    document.getElementById("FirstLstTxt").innerHTML = "Plat n°1";

    //Gestion des stocks
    for (const elem of PlatsLst) {
        if (elem["ref"] !== "EVENT") {
            var button = document.createElement("button");

            for (const article of await ArrangeArray(elem["ingredientsPossibles"])) {

                if (article[2] === '2') {
                    let AskAboutQuantity = await fetch(`${path}?ArticleID=${article[0]}`);
                    let RequestResult = await AskAboutQuantity.json();

                    console.log(parseInt(RequestResult[0]["qte"] / article[1]));
                    if ((parseInt(RequestResult[0]["qte"] / article[1]) > 0) && (parseInt(RequestResult[0]["qte"] / article[1]) <= 10)) {
                        button.classList.add("AlertStock");
                    }
                    else if (parseInt(RequestResult[0]["qte"] / article[1]) <= 0) {
                        button.classList.remove("AlertStock");
                        button.classList.add("Out");
                    }
                }
            }

            button.innerHTML = elem["nom"];
            button.id = elem["id_carte"];
            button.classList.add("InMenuButton");
            button.setAttribute("onclick", `Select_Plat_In_Menu(this,${elem["id_carte"]},2,0)`);
            var div = document.getElementById("FirstLst");
            div.appendChild(button);
        }

    }
}

async function RemplissageCaseSecondMenu() { //permet de remplir la case en haut à droite avec la liste des plats
    let AskAPIAboutIngredients = await fetch(`${path}?PlateType=0`); //je récupére les informations sur l'ingrédient
    let PlatsLst = await AskAPIAboutIngredients.json();
    document.createElement("button");
    document.getElementById("SecondLstTxt").innerHTML = "Plat n°2";
    for (const elem of PlatsLst) {
        if (elem["ref"] !== "EVENT") {
            var button = document.createElement("button");

            for (const article of await ArrangeArray(elem["ingredientsPossibles"])) {

                if (article[2] === '2') {
                    let AskAboutQuantity = await fetch(`${path}?ArticleID=${article[0]}`);
                    let RequestResult = await AskAboutQuantity.json();


                    if ((parseInt(RequestResult[0]["qte"] / article[1]) > 0) && (parseInt(RequestResult[0]["qte"] / article[1]) <= 10)) {
                        button.classList.add("AlertStock");
                    }
                    else if (parseInt(RequestResult[0]["qte"] / article[1]) <= 0) {
                        button.classList.add("Out");
                        button.classList.remove("AlertStock");
                    }
                }
            }
        

            button.innerHTML = elem["nom"];
            button.id = elem["id_carte"];
            button.classList.add("InMenuButton");
            button.setAttribute("onclick", `Select_Plat_In_Menu(this,${elem["id_carte"]},2,1)`);
            var div = document.getElementById("SecondLst");
            div.appendChild(button);
        }
    }
}

async function SelectEventPlate(elem, value) {
    //Sélection des 2 CJF
    //Menu Event

    if (elem.classList.contains("SelectedPlate")) { //Permet de désélectionner le plat
        elem.classList.toggle("SelectedPlate");
        PlatLst[Zone] = [];
    }
    else {
        if (PlatLst[Zone].length === 0) { //Sélection du plat

            const ParentDiv = elem.parentNode;
            const enfants = ParentDiv.children;

            //Permet de supprimer les erreurs de sélection
            for (const enfant of enfants) {
                if (enfant.classList.contains("SelectedPlate")) {
                    enfant.classList.toggle("SelectedPlate");
                    break; // Sortir de la boucle dès qu'on trouve un élément avec la classe recherchée
                }
            }

            elem.classList.toggle("SelectedPlate");
            let NewData = [];
            NewData.push("MenuEvent");
            let AllData = await fetch(`${path}?PlateID=${value}`); //Récupération des données de ce plat
            dataGet = await AllData.json();
            console.log(dataGet);
            NewData.push(dataGet[0]['prix']);
            NewData.push(dataGet[0]['prix_serveur']);
            NewData.push([["58", "2"], ["2", "2"], ["3", "2"], ["6", "2"]]);
            let textCommand = [["2 Croque-Monsieur Jambon Emmental Beurre"]];
            NewData.push(textCommand);

            if (InMenu === true) {
                PlatLst[Zone] = NewData;
            }
            else {
                order.push(NewData);
                UpdateCases(order);
            }
        }
        else { //un autre plat est déjà sélectionné
            alert("Un Seul plat");
        }
    }

}

async function RemplissageEvent() { //Remplissage Event
    document.createElement("button");
    document.getElementById("FirstLstTxt").innerHTML = "Plat n°1";

    var button = document.createElement("button");
    button.innerHTML = "Buritos";
    button.id = "82";
    button.classList.add("InMenuButton");
    button.setAttribute("onclick", `Select_Plat_In_Menu(this,82,1,1)`);
    var div = document.getElementById("FirstLst");
    div.appendChild(button);

    //Fonction spéciale lors du clic
    var div = document.getElementById("FirstLst");
    div.appendChild(button);



}

async function RemplissageExtra() { //permet de remplir la case en haut à gauche avec la liste des plats
    document.createElement("button");
    document.getElementById("SecondLstTxt").innerHTML = "Plat n°2";

    //Bouton Croque Monsieur
    var button = document.createElement("button");
    button.innerHTML = "Croque-Monsieur";
    button.id = "27";
    button.classList.add("InMenuButton");
    button.setAttribute("onclick", `Select_Plat_In_Menu(this,27,1,1)`);

    //Vérif Stock
    let AskAPIAboutIngredientsPlate = await fetch(`${path}?PlateID=27`); //je récupére les informations sur l'ingrédient
    let ListeIngredients = await AskAPIAboutIngredientsPlate.json();

    for (const article of await ArrangeArray(ListeIngredients[0]["ingredientsPossibles"])) {

        if (article[2] === '2') {
            let AskAboutQuantity = await fetch(`${path}?ArticleID=${article[0]}`);
            let RequestResult = await AskAboutQuantity.json();


            if ((parseInt(RequestResult[0]["qte"] / article[1]) > 0) && (parseInt(RequestResult[0]["qte"] / article[1]) <= 10)) {
                button.classList.add("AlertStock");
            }
            else if (parseInt(RequestResult[0]["qte"] / article[1]) <= 0) {
                button.classList.add("Out");
                button.classList.remove("AlertStock");
            }
        }
    }

    //Ajout
    var div = document.getElementById("SecondLst");
    div.appendChild(button);

    //Hot Dog
    var boutonCopie = button.cloneNode(true);
    boutonCopie.innerHTML = "Hot-Dog";
    boutonCopie.id = "28";
    boutonCopie.classList.remove("AlertStock");
    boutonCopie.classList.remove("Out");
    boutonCopie.setAttribute("onclick", `Select_Plat_In_Menu(this,28,1,1)`);

    //Vérif Stock
    AskAPIAboutIngredientsPlate = await fetch(`${path}?PlateID=28`); //je récupére les informations sur l'ingrédient
    ListeIngredients = await AskAPIAboutIngredientsPlate.json();

    for (const article of await ArrangeArray(ListeIngredients[0]["ingredientsPossibles"])) {

        if (article[2] === '2') {
            let AskAboutQuantity = await fetch(`${path}?ArticleID=${article[0]}`);
            let RequestResult = await AskAboutQuantity.json();


            if ((parseInt(RequestResult[0]["qte"] / article[1]) > 0) && (parseInt(RequestResult[0]["qte"] / article[1]) <= 10)) {
                boutonCopie.classList.add("AlertStock");
            }
            else if (parseInt(RequestResult[0]["qte"] / article[1]) <= 0) {
                boutonCopie.classList.add("Out");
                boutonCopie.classList.remove("AlertStock");
            }
        }
    }


    
    div.appendChild(boutonCopie);

}

async function RemplissageSnacks() {
    let AskAPIAboutIngredients = await fetch(`${path}?PlateType=1`); //je récupére les informations sur l'ingrédient
    let PlatsLst = await AskAPIAboutIngredients.json();
    document.createElement("button");
    for (const elem of PlatsLst) {
        var button = document.createElement("button");

        for (const article of await ArrangeArray(elem["ingredientsPossibles"])) {

            if (article[2] === '2') {
                let AskAboutQuantity = await fetch(`${path}?ArticleID=${article[0]}`);
                let RequestResult = await AskAboutQuantity.json();


                if ((parseInt(RequestResult[0]["qte"] / article[1]) > 0) && (parseInt(RequestResult[0]["qte"] / article[1]) <= 10)) {
                    button.classList.add("AlertStock");
                }
                else if (parseInt(RequestResult[0]["qte"] / article[1]) <= 0) {
                    button.classList.add("Out");
                    button.classList.remove("AlertStock");
                }
            }
        }

        button.innerHTML = elem["nom"];
        button.id = elem["id_carte"];
        button.classList.add("InMenuButton");
        button.setAttribute("onclick", `ToogleElemInMenu(this,${elem["id_carte"]})`);
        var div = document.getElementById("ThirdLst");
        div.appendChild(button);
    }
}

async function RemplissageBoissons() {
    let AskAPIAboutIngredients = await fetch(`${path}?PlateType=2`); //je récupére les informations sur l'ingrédient
    let PlatsLst = await AskAPIAboutIngredients.json();
    document.createElement("button");
    for (const elem of PlatsLst) {
        var button = document.createElement("button");

        for (const article of await ArrangeArray(elem["ingredientsPossibles"])) {

            if (article[2] === '2') {
                let AskAboutQuantity = await fetch(`${path}?ArticleID=${article[0]}`);
                let RequestResult = await AskAboutQuantity.json();


                if ((parseInt(RequestResult[0]["qte"] / article[1]) > 0) && (parseInt(RequestResult[0]["qte"] / article[1]) <= 10)) {
                    button.classList.add("AlertStock");
                }
                else if (parseInt(RequestResult[0]["qte"] / article[1]) <= 0) {
                    button.classList.add("Out");
                    button.classList.remove("AlertStock");
                }
            }
        }

        button.innerHTML = elem["nom"];
        button.id = elem["id_carte"];
        button.classList.add("InMenuButton");
        button.setAttribute("onclick", `ToogleElemInMenu(this,${elem["id_carte"]})`);
        var div = document.getElementById("FourthLst");
        div.appendChild(button);
    }
}

//===================================================================//
//                      Fonctions Selection Snacks                   //
//===================================================================//

function ToogleElemInMenu(elem, id) { //Gére la sélection des snacks et boissons
    if (elem.classList.contains("SelectedSnack")) { //Décocher un snack
        elem.classList.toggle("SelectedSnack");

        //On retire les doublons pour éviter le spam
        const NextButton = elem.nextSibling;
        const PreviousButton = elem.previousSibling;
        if (NextButton) {
            if (NextButton.textContent === elem.textContent) {
                NextButton.remove();
            }
        }
        else {
            if (PreviousButton) {
                if (PreviousButton.textContent === elem.textContent) {
                    PreviousButton.remove();
                }
            }
        }
    }
    else if ((document.getElementsByClassName("SelectedSnack")).length >= SnackAmount) { //Check que la quantité n'est pas dépassé
        alert("Limite de Snacks atteinte");
    }
    else { //Sélection du snack

        //Doublage du bouton
        const nextButton = elem.nextSibling;
        const parentDesBoutons = elem.parentNode;
        const boutonCopie = elem.cloneNode(true);
        if (nextButton) {
            parentDesBoutons.insertBefore(boutonCopie, nextButton);
        } else { // Sinon, insérer le bouton à la fin du parent
            parentDesBoutons.appendChild(boutonCopie);
        }
        //Changement couleur
        elem.classList.toggle("SelectedSnack");

    }
}

//===================================================================//
//                       Fonctions principales                       //
//===================================================================//

async function Select_Menu(MenuID) {
    //Remise à 0 de la valeur des variables
    FinalLstIngredients = [];
    PlatLst = [[], []];
    SnackAmount = 0;
    InMenu = true;

    let AllData = await fetch(`${path}?PlateID=${MenuID}`); //Récupération des données de ce plat
    dataMenu = await AllData.json();

    OpenMenu("MenusMenu");
    supprimerElementsCase('.InMenuButton');
    await RemplissageCaseFirstMenu();

    switch (MenuID) {
        case '1': //Ch'tite Faim
            document.getElementById("MenuTxt").innerHTML = "Ch'tite Faim";
            RemplissageSnacks();
            RemplissageBoissons();
            SnackAmount = 2;
            break;
        case '2': //p'tit QuinQuin
            document.getElementById("MenuTxt").innerHTML = "P'tit QuinQuin";
            RemplissageExtra();
            RemplissageSnacks();
            RemplissageBoissons();
            SnackAmount = 1;
            break;
        case '3': //T"Cho Biloute
            document.getElementById("MenuTxt").innerHTML = "T'Cho Biloute";
            RemplissageCaseSecondMenu();
            SnackAmount = 0;
            break;
        case '4': //Event (Changer la config au fur et à mesure)

            document.getElementById("MenuTxt").innerHTML = "Menu Event";
            supprimerElementsCase('.InMenuButton');
            RemplissageSnacks();
            RemplissageBoissons();
            RemplissageEvent();
            SnackAmount = 1;
            break;
    }
}

async function SendValidMenu() {
    let NewData = [];

    NewData.push(dataMenu[0]["nom"]);
    NewData.push(dataMenu[0]['prix']);
    NewData.push(dataMenu[0]['prix_serveur']);

    elemLst = [];
    stockLst = [];



    if (PlatLst[0].length !== 0) {
        for (const elem of PlatLst[0][3]) {
            stockLst.push(elem);
        }
        for (const elem of PlatLst[0][4]) {
            elemLst.push(elem);
        }
    }
    if (PlatLst[1].length !== 0) {
        for (const elem of PlatLst[1][3]) {
            stockLst.push(elem);
        }
        for (const elem of PlatLst[1][4]) {
            elemLst.push(elem);
        }
    }

    let TmpElemLst = simplifierCommandes(elemLst); //Permet de regrouper si même commande
    elemLst = TmpElemLst.map(nombre => [nombre, true]);

    const LstSnacks = document.getElementsByClassName("SelectedSnack");
    if (LstSnacks !== 0) {
        for (const elem of LstSnacks) {
            let DataSnackJSON = await fetch(`${path}?PlateID=${parseInt(elem.id)}`);
            let DataSnack = await DataSnackJSON.json();

            if (DataSnack[0]["nom"].includes("Redbull")) {
                NewData[1] = (parseFloat(NewData[1]) + 0.5).toString();
                NewData[2] = (parseFloat(NewData[2]) + 0.5).toString();
            }

            let Ingreds = await ArrangeArray(DataSnack[0]["ingredientsPossibles"]);
            stockLst.push([Ingreds[0][0], Ingreds[0][1]]);
            elemLst.push([DataSnack[0]["nom"], false]);
        }
    }

    stockLst = regrouperParPremierElement(stockLst);
    NewData.push(stockLst);
    NewData.push(elemLst);
    order.push(NewData);
    UpdateCases(order);
    CloseMenu("MenusMenu");
}

//[[Texte(Nom ou Hors-Menu), prix, prix_serveur, [Liste des ressources à retirer du stock], [(liste nom articles,BOOL : plat ou pas)]]

function simplifierCommandes(commandes) {
    // Créer un objet pour stocker le nombre d'occurrences de chaque commande
    const occurrences = {};

    // Parcourir le tableau de commandes
    commandes.forEach(commande => {
        // Utiliser une expression régulière pour vérifier le format attendu
        const match = /^(\d+) (.+)$/.exec(commande[0]);
        
        if (match) {
            // Extraire le nombre et le nom de la commande
            const nombre = parseInt(match[1]);
            const nomCommande = match[2];

            // Utiliser le nom de la commande comme clé dans l'objet occurrences
            // Incrémenter le compteur si la commande existe, sinon initialiser à nombre
            occurrences[nomCommande] = (occurrences[nomCommande] || 0) + nombre;
        } else {
            // Si le format n'est pas valide, simplement ajouter la commande au résultat
            occurrences[commande[0]] = (occurrences[commande] || 0) + 1;
        }
    });

    // Convertir l'objet occurrences en un tableau de chaînes simplifiées
    const result = Object.entries(occurrences).map(([nomCommande, nombre]) => {
        // Si le nombre est égal à 1, simplement retourner la commande
        // Sinon, concaténer le nombre avec le nom de la commande
        return nombre === 1 ? nomCommande : `${nombre} ${nomCommande}`;
    });

    return result;
}






