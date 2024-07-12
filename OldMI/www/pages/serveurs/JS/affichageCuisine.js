//===================================================================//
//            Initialisation des variables globales                  //
//===================================================================//
DataCommandes = [];

let ColorLst = ["BleuPastel", "OrangePastel", "VertPastel", "RosePastel", "VioletPastel", "CyanPastel", "JaunePastel", "VertSombrePastel", "VioletSombrePastel", "OrangeSombrePastel"];
//===================================================================//
//                      Fonctions Génériques                         //
//===================================================================//

// Fonction pour démarrer le timer
function startTimer() {
    setInterval(ActualiseData, 15000); // Exécuter la fonction toutes les 10 secondes (10000 millisecondes)
}

// Démarrer le timer lorsque la page a fini de charger
window.onload = function () {
    ActualiseData();
    startTimer();
};

async function GetInfo() {
    //Actualisation de la liste des commandes
    let DataAPI = await fetch(`${path}?CuisineLst=${1}`);
    DataCommandes = await DataAPI.json();
}

function OrganizeData(elem) {
    // Utilisation de la méthode split() pour séparer les éléments en utilisant ","
    const tableauElem = elem.split(",");
    // Retourner le tableau résultant
    return tableauElem;
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

function GetAllias(name) {
    //Gére les allias des produits lors de l'affichage
    let Allias = "";
    const tableauElem = name.split(" ");
    let Beurre = false;
    let Sld = false;
    let Tmt = false;
    let HD = false;

    for (const mot of tableauElem) {
        switch (mot) {
            case "Of":
                Allias += " Of";
                break;
            case "1":
                Allias += "1 ";
                break;
            case "2":
                Allias += "2 ";
                break;
            case "Beurre":
                Beurre = true;
                break;
            case "Salade":
                Sld = true;
                break;
            case "Tomate":
                Tmt = true;
                break;
            case "Emmental":
                Allias += "F";
                break;
            case "Hot-Dog":
                Allias += "HD";
                HD = true;
                break;
            case "Ketchup":
                Allias += " ket";
                break;
            case "Samouraï":
                Allias += " sam";
                break;
            case "Moutarde":
                Allias += " mout";
                break;
            case "Andalouse":
                if (HD) {
                    Allias += " anda";
                    break;
                }
                else {
                    Allias += "A";
                    break;
                }
            case "Mayonnaise":
                Allias += " mayo";
                break;
            case "Barbecue":
                Allias += "bar";
                break;
            default:
                Allias += mot[0];
                break;
        }
    }

    if (Sld && Tmt) {
        Allias += " crud";
    }
    else if (Sld) {
        Allias += " sld";
    }
    else if (Tmt) {
        Allias += " tom";
    }

    if (!(Beurre) && !(HD)) {
        Allias += " No Beurre";
    }
    return Allias;
}


//===================================================================//
//                      Fonctions Principales                        //
//===================================================================//

async function ActualiseData() {
    let PreviousType = -1;
    //0 : Froid
    //1 : Chaud

    await GetInfo()
    let ZoneFroid = document.getElementById("CommandeFroid");
    let ZoneChaud = document.getElementById("CommandeChaud");
    let Zones = [ZoneFroid, ZoneChaud];

    //Clear des commandes précédentes
    ZoneChaud.innerHTML = "";
    ZoneFroid.innerHTML = "";

    //Remplissage du tableau
    for (const elem of DataCommandes) {
        PreviousType = -1; //On reset la position du plat dans le tableau
        let Tab = OrganizeData(elem["commande_in"]);
        let BlocDiv = CreateBlocDiv();

        //Check de la date
        if (!(estDateAujourdhui(elem["date"]))) {
            BlocDiv.classList.add("LateCommande");
        }

        if (elem["retire_stock"]) {
            BlocDiv.classList.add("OnlineCommandeCSS");
        }

        //Affichage et Triage
        for ( commande of Tab) {
            let CurrentType = -1;

            //Triage du type de plat
            if ((commande.includes("Croque")) || (commande.includes("Panini")) || (commande.includes("Buritos"))) {
                if(commande.includes("Buritos")){
                    commande = verifierBurger(commande);
                }
                CurrentType = 1;
            }
            else {
                CurrentType = 0;
            }

            console.log(elem);
            if (((CurrentType === 1) && (elem["chaud"] === 1)) || ((CurrentType === 0) && (elem["froid"] === 1))) {
                if ((PreviousType === -1) || (PreviousType === CurrentType)) { //Même type que le précédent
                    BlocDiv.appendChild(CreateLigneCommande(elem["nom"], commande, GetAllias(commande)));
                    PreviousType = CurrentType;
                }
                else { //Type différent
                    if (elem["commentaire"] !== '') {
                        BlocDiv.appendChild(CreateCommentaireCommande(elem["commentaire"]));
                    }
                    BlocDiv.classList.add(ColorLst[elem["id_commande"] % 7]);
                    Zones[PreviousType].appendChild(BlocDiv);

                    BlocDiv = CreateBlocDiv();
                    BlocDiv.appendChild(CreateLigneCommande(elem["nom"], commande, GetAllias(commande)));
                    BlocDiv.classList.add(ColorLst[elem["id_commande"] % 7]);
                    PreviousType = CurrentType;
                    if (!(estDateAujourdhui(elem["date"]))) {
                        BlocDiv.classList.add("LateCommande");
                    }
                }
            }
        }

        if (elem["commentaire"] !== '') {
            BlocDiv.appendChild(CreateCommentaireCommande(elem["commentaire"]));
        }
        try {
            Zones[PreviousType].appendChild(BlocDiv);
        } catch (error) {
            console.error(error);
            try {
                BlocDiv.appendChild(CreateLigneCommande(elem["nom"], commande, GetAllias(commande)));
                Zones[0].appendChild(BlocDiv);
            } catch (errorr) {
                console.error(errorr);
            }
        }

    }
}

function CreateLigneCommande(name, plat, allias) {
    //Permet de créer et renvoyer une ligne de commande

    // Création de la div parent avec la classe "ligne"
    const divLigne = document.createElement('div');
    divLigne.classList.add('ligne');

    // Création des div enfants avec leurs classes et contenu respectifs
    const divName = document.createElement('div');
    divName.classList.add('colonne', 'NameZone');
    divName.textContent = name;

    const divNourriture = document.createElement('div');
    divNourriture.classList.add('colonne', 'NourritureZone');
    divNourriture.textContent = plat;

    const divAlias = document.createElement('div');
    divAlias.classList.add('colonne', 'AlliasZone');
    divAlias.textContent = allias;

    divLigne.appendChild(divName);
    divLigne.appendChild(divNourriture);
    divLigne.appendChild(divAlias);

    return divLigne;
}

function CreateCommentaireCommande(commentaire) {
    //Permet de créer et renvoyer une ligne de commentaire

    const divLigne = document.createElement('div');
    divLigne.classList.add('ligne');

    // Création de la div enfant avec sa classe et son contenu
    const divCommentaire = document.createElement('div');
    divCommentaire.classList.add('colonne', 'CommentaireZone');
    divCommentaire.textContent = commentaire;

    // Ajout de la div enfant à la div parent
    divLigne.appendChild(divCommentaire);

    return divLigne;
}

function CreateBlocDiv() {
    //Création du bloc principal
    const divLigne = document.createElement('div');
    divLigne.classList.add('bloc');

    return divLigne;
}

function verifierBurger(texte) {
    // Liste des ingrédients nécessaires dans le burger
    const ingredientsNecessaires = ["Buritos", "Poulet", "Cheddar", "Sauce", "Salade", "Crème", "Oignons", "fraîche", "Chips","Poivrons"];

    // Diviser le texte en mots
    const mots = texte.split(" ");

    // Vérifier la présence de chaque ingrédient nécessaire
    const ingredientsManquants = ingredientsNecessaires.filter(ingredient => !mots.includes(ingredient));

    // Générer le message en fonction des ingrédients manquants
    if (ingredientsManquants.length === 0) {
        return "Buritos";
    } else if (ingredientsManquants.length === 1) {
        return "Buritos sans " + ingredientsManquants[0];
    } else {
        const derniersIngredientsManquants = ingredientsManquants.splice(-1);
        return "Buritos sans " + ingredientsManquants.join(", ") + " et " + derniersIngredientsManquants;
    }
}
