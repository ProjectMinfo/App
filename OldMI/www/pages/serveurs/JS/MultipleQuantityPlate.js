//===================================================================//
//      Initialisation des variables globales                        //
//===================================================================//
let QuantityCommande = 0; //quantité commandée
let IsSame = true; //Si 2 en quantité, sont-ils identiques ?

//===================================================================//
//                       Fonctions génériques                        //
//===================================================================//

function updateLstSelectionMultiplePlates() {
    //Permet d'actualiser le menu lors d'un changement dans la valeur des quantitées
    switch (QuantityCommande) {
        case 1:
            document.getElementById("SameDIV").style.display = 'none';
            document.getElementById("SecondChoicePlate").style.display = 'none';
            break;
        case 2:
            document.getElementById("SameDIV").style.display = 'block';
            if (IsSame) {
                document.getElementById("SecondChoicePlate").style.display = 'none';
            }
            else {
                document.getElementById("SecondChoicePlate").style.display = 'grid';
            }
            break;
    }

}

function ToogleSamePlate(elem) {
    //Permet de gérer le choix de la quantité
    if (elem.classList.contains("SamePlateSelected")) { //si l'utilisatuer clique sur case déjà verte, on ne fait rien
        return;
    }
    else { //l'utilisatuer souhaite changé la quantitée de plats
        //Actualisation de la quantité souhaitée
        RemoveClass("SamePlateSelected");
        elem.classList.toggle("SamePlateSelected");
        switch (elem.innerHTML) {
            case "Oui":
                IsSame = true;
                break;
            case "Non":
                IsSame = false;
                break;
        }
        updateLstSelectionMultiplePlates();
    }
}

function ToogleQuantity(elem) {
    //Permet de gérer le choix de la quantité
    if (elem.classList.contains("SelectedQuantity")) { //si l'utilisatuer clique sur case déjà verte, on ne fait rien
        return;
    }
    else { //l'utilisatuer souhaite changé la quantitée de plats
        //Actualisation de la quantité souhaitée
        RemoveClass("SelectedQuantity");
        elem.classList.toggle("SelectedQuantity");
        QuantityCommande = parseInt(elem.innerHTML);
        updateLstSelectionMultiplePlates();

    }
}

function AddAmoutButton(amount) {
    //Permet de faire apparaitre les boutons des quantitées en fonction de la demande
    QuantityCommande = amount; //Par Défaut, la valeur commandée est le maximum autorisé
    div = document.getElementById("Quantity");
    for (let index = 1; index <= amount; index++) {
        var button = document.createElement("button");
        button.classList.add("QuantiteButton");
        button.innerHTML = index;
        button.setAttribute("onclick", "ToogleQuantity(this)");
        if (index === amount) {
            button.classList.add("SelectedQuantity");
        }
        div.appendChild(button);
    }

}

//===================================================================//
//                       Fonctions principales                       //
//===================================================================//
async function MultiplePlatSelection(data, amount) {
    //Affichage de la liste des possibilitées

    //Mise à jour des variables globales
    FinalLstIngredients = [];
    QuantityCommande = amount;

    //Chargement des ingrédients possibles
    let LstIngredients = await ArrangeArray(data[0]['ingredientsPossibles']);
    for (const element of LstIngredients) { //je chope les infos de chaque ingrédient dispo dans le repas
        let AskAPIAboutIngredients = await fetch(`${path}?ArticleID=${element[0]}`); //je récupére les informations sur l'ingrédient
        let Ingredientdata = await AskAPIAboutIngredients.json();
        FinalLstIngredients.push([element, Ingredientdata[0]]);
    }

    OpenMenu("MultipleMenu"); //Ouverture du Menu
    supprimerElementsCase(".QuantiteButton"); //On supprime les anciens boutons de quantité
    supprimerElementsCase(".IngredientButton"); //On supprime les anciens boutons d'ingrédient
    AddAmoutButton(amount); //Ajout des boutons actuels de choix de qté
    await AddDataTotables("FirstChoicePlate", "FirstSelectedIngredient"); //Ajout des ingrédients Menu 1
    await AddDataTotables("SecondChoicePlate", "SecondSelectedIngredient"); //Ajout des ingrédients Menu 2
    updateLstSelectionMultiplePlates(); //Mise à jour des liste d'ingrédients
    document.getElementById("MultipleMenuTxt").innerHTML = data[0]['nom'];

}


async function AddDataTotables(IdZonename, SelectedClasseName) {
    //Permet d'ajouter les données des ingrédients dans le div d'id #IdZonename et de mettre la classe sur SelectedClassName dans les param de la fonction onclick
    let Zone = document.getElementById(IdZonename);
    for (const elem of FinalLstIngredients) {
        var button = document.createElement("button");
        button.innerHTML = elem[1]["nom"];
        button.id = elem[0][0];
        button.classList.add("IngredientButton");
        if ((parseInt(elem[1]["qte"] / elem[0][1]) > 0) && (parseInt(elem[1]["qte"] / elem[0][1]) <= 10)) {
            button.classList.add("AlertStock");
        }
        else if (parseInt(elem[1]["qte"] / elem[0][1]) <= 0) {
            button.classList.add("Out");
        }
        switch (elem[1]["TypeIngredient"]) {
            case 0: //Ingrédient LOCAL
                if (elem[0][2] !== '2') {
                    var div = Zone.getElementsByClassName("ingredientlst");
                    if (elem[0][2] === '1') { //ingrédient par défaut
                        if (parseInt(elem[1]["qte"] / elem[0][1]) !== 0) {
                            button.classList.add(SelectedClasseName);
                        }
                    }
                    button.setAttribute("onclick", `ChooseIngredientMultiple(this, "${SelectedClasseName}")`);
                    div[0].appendChild(button);
                }
                break;
            case 1: //Viande LOCAL
                if (elem[0][2] !== '2') {
                    var div = Zone.getElementsByClassName("Viandelst");
                    if (elem[0][2] === '1') { //ingrédient par défaut
                        if (parseInt(elem[1]["qte"] / elem[0][1]) !== 0) {
                            button.classList.add(SelectedClasseName);
                        }
                    }
                    button.setAttribute("onclick", `ChooseIngredientMultiple(this, "${SelectedClasseName}")`);
                    div[0].appendChild(button);
                }
                break;
            case 2: //Extra LOCAL
                if (elem[0][2] !== '2') {
                    var div = Zone.getElementsByClassName("Extralst");
                    if (elem[0][2] === '1') { //ingrédient par défaut
                        if (parseInt(elem[1]["qte"] / elem[0][1]) !== 0) {
                            button.classList.add(SelectedClasseName);
                        }
                    }
                    button.setAttribute("onclick", `ChooseIngredientMultiple(this, "${SelectedClasseName}")`);
                    div[0].appendChild(button);
                }
                break
        }
    }
}

function ChooseIngredientMultiple(elem, className) {
    //Fonction qui gére le choix des ingrédients et bloque quand régles sur les qté non respectées
    let compteurViande = 0;
    let compteurTotal = 0;
    elem.classList.toggle(className);
    let CheckLst = document.getElementsByClassName(className);
    for (const choice of CheckLst) {
        switch (FinalLstIngredients[GetPosition(parseInt(choice.id))][1]["TypeIngredient"]) {
            case 1:
                compteurTotal += 1;
                compteurViande += 1;
                break;
            case 0:
                compteurTotal += 1;
                break;
        }
    }
    if (compteurViande > 1) {
        elem.classList.toggle(className);
        alert("Trop de viandes");
        return;
    }
    else if (compteurTotal > 2) {
        elem.classList.toggle(className);
        alert("Trop d'ingrédient");
        return;
    }
}

function GetIngredientsLst(className) {
    //Lorsque la commande est validée, charge toutes les données dans order
    let CheckLst = document.getElementsByClassName(className);
    let textCommand = data[0]['nom'];
    let ListeIngred = []

    for (const elem of FinalLstIngredients) {
        //Ajout des ingrédients obligatoires
        if (elem[0][2] === '2') {
            ListeIngred.push([elem[0][0], elem[0][1]]);
        }
    }
    for (const choice of CheckLst) {
        textCommand = textCommand + " " + FinalLstIngredients[GetPosition(parseInt(choice.id))][1]["nom"];
        ListeIngred.push([FinalLstIngredients[GetPosition(parseInt(choice.id))][0][0], FinalLstIngredients[GetPosition(parseInt(choice.id))][0][1]]);
    }
    return [ListeIngred, textCommand]
}

async function ValidationMultiple() {
    //Permet de valider le repas et de l'ajouter à la liste
    let ListeIngredientUsed = [];
    let txt = [];
    let MaListe = []; //Sert de liste tampon
    switch (QuantityCommande) {
        case 1: //L'utilisateur commande par 1
            MaListe = GetIngredientsLst("FirstSelectedIngredient");
            txt.push("1 " + MaListe[1]);
            ListeIngredientUsed = MaListe[0];
            break;
        case 2: //L'utilisateur commande par 2
            MaListe = GetIngredientsLst("FirstSelectedIngredient");
            txt.push(MaListe[1]);
            ListeIngredientUsed = MaListe[0];
            if (!IsSame) { //Si la composition des 2 plats est différente
                MaListe = GetIngredientsLst("SecondSelectedIngredient");
                txt.push(MaListe[1]);
                for (const elem of MaListe[0]) {
                    ListeIngredientUsed.push(elem);
                }
                ListeIngredientUsed = regrouperParPremierElement(ListeIngredientUsed);
            }
            else {
                txt[0] = "2 " + txt[0];
                for (const elem of ListeIngredientUsed) {
                    elem[1] = (parseInt(elem[1]) * 2).toString();
                }
            }
            break;
    }

    let NewData = [];
    NewData.push("Hors-Menu");
    NewData.push(data[0]['prix']);
    NewData.push(data[0]['prix_serveur']);
    NewData.push(ListeIngredientUsed);
    let textCommand = [];
    for (const elem of txt) {
        textCommand.push([elem, true])
    }
    NewData.push(textCommand);
    if (QuantityCommande === 2) {
        NewData[1] = (parseFloat(NewData[1]) + 1).toString();
        NewData[2] = (parseFloat(NewData[2]) + 1).toString();
    }

    if (InMenu === true) {
        PlatLst[Zone] = NewData;
    }
    else {
        order.push(NewData);
        UpdateCases(order);
    }

    CloseMenu("MultipleMenu");

}
