//===================================================================//
//      Fonctions concernant les plats qui se vendent par 1          //
//===================================================================//

async function SandwichPlatSelection(data) {
    //Affichage de la liste des possibilitées
    FinalLstIngredients = [];
    OpenMenu("SandwichMenu");
    supprimerElementsCase('.IngredientButton');
    let LstIngredients = await ArrangeArray(data[0]['ingredientsPossibles']);
    document.getElementById("SandwichText").innerHTML = data[0]['nom'];
    for (const element of LstIngredients) { //je chope les infos de chaque ingrédient dispo dans le repas
        let AskAPIAboutIngredients = await fetch(`${path}?ArticleID=${element[0]}`); //je récupére les informations sur l'ingrédient
        let Ingredientdata = await AskAPIAboutIngredients.json();
        FinalLstIngredients.push([element, Ingredientdata[0]]);
    }
    for (const elem of FinalLstIngredients) {

        var button = document.createElement("button");
        button.innerHTML = elem[1]["nom"];
        button.setAttribute("onclick", "ChooseIngredient(this)");
        button.id = elem[0][0];
        button.classList.add("IngredientButton");
        if ((parseInt(elem[1]["qte"] / elem[0][1]) > 0) && (parseInt(elem[1]["qte"] / elem[0][1]) <= 10)) {
            button.classList.add("AlertStock");
        }
        else if (parseInt(elem[1]["qte"] / elem[0][1]) <= 0) {
            button.classList.add("Out");
        }
        switch (elem[1]["TypeIngredient"]) {
            case 0: //Ingrédient
                if (elem[0][2] !== '2') {
                    var div = document.getElementById("ingredientlst");
                    if (elem[0][2] === '1') {
                        if (parseInt(elem[1]["qte"] / elem[0][1]) !== 0) {
                            button.classList.add("SelectedIngredient");
                        }

                    }
                    div.appendChild(button);
                }
                break;
            case 1: //Viande
                if (elem[0][2] !== '2') {
                    var div = document.getElementById("Viandelst");
                    if (elem[0][2] === '1') {
                        if (parseInt(elem[1]["qte"] / elem[0][1]) !== 0) {
                            button.classList.add("SelectedIngredient");
                        }
                    }
                    div.appendChild(button);
                }
                break;
            case 2: //Extra
                if (elem[0][2] !== '2') {
                    var div = document.getElementById("Extralst");
                    if (elem[0][2] === '1') {
                        if (parseInt(elem[1]["qte"] / elem[0][1]) !== 0) {
                            button.classList.add("SelectedIngredient");
                        }
                    }
                    div.appendChild(button);
                }
                break
        }
    }
}

function ChooseIngredient(elem) {
    //Fonction qui gére le choix des ingrédients et bloque quand régles sur les qté non respectées
    let compteurViande = 0;
    let compteurTotal = 0;
    elem.classList.toggle("SelectedIngredient");
    let CheckLst = document.getElementsByClassName('SelectedIngredient');
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
        elem.classList.toggle("SelectedIngredient");
        alert("Trop de viandes");
        return;
    }
    else if (compteurTotal > 2) {
        elem.classList.toggle("SelectedIngredient");
        alert("Trop d'ingrédient");
        return;
    }
}

async function SendValid() {
    //Lorsque la commande est validée, charge toutes les données dans order
    let CheckLst = document.getElementsByClassName('SelectedIngredient');
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

    let NewData = [];
    NewData.push("Hors-Menu");
    NewData.push(data[0]['prix']);
    NewData.push(data[0]['prix_serveur']);
    NewData.push(ListeIngred);
    NewData.push([[textCommand, true]]);

    if (InMenu === true) {
        PlatLst[Zone] = NewData;
    }
    else {
        order.push(NewData);
        UpdateCases(order);
    }
    CloseMenu("SandwichMenu");

}




//[[Texte(Nom ou Hors-Menu), prix, prix_serveur, [Liste des ressources à retirer du stock], [(liste nom articles,BOOL : plat ou pas)]]

