import { postCommande, getPlats } from "@/config/api";
import { Boissons, Comptes, Menus, NewCommandes, Plats, Snacks, Viandes } from "@/types";

type NewMenus = {
    id: number;
    type: "menu";
    menu: Menus;
    menuId: number;
};

type NewPlats = {
    id: number;
    type: "plat";
    plat: Plats;
    menuId?: number;
};

type NewSnacks = {
    id: number;
    type: "snack";
    snack: Snacks;
    menuId?: number;
};

type NewBoissons = {
    id: number;
    type: "boisson";
    boisson: Boissons;
    menuId?: number;
};

type NewRepas = {
    menu: NewMenus[];
    plat: NewPlats[];
    snack: NewSnacks[];
    boisson: NewBoissons[];
    complete: boolean;
    remainingPlats: number;
    remainingBoissons: number;
    remainingSnacks: number;
    currentMenu?: NewMenus;
};


type item = [number, number];


function aggregateQuantities(repas: NewRepas, allViandes: Viandes[], allPlats: Plats[]) {
    const listIngredients: item = [];
    const listViandes: item = [];
    const listBoissons: item = [];
    const listSnacks: item = [];

    repas.plat.forEach((plat) => {
        plat.plat.ingredients.forEach((ingredient) => {
            if (listIngredients.some(currentIngredient => currentIngredient[0] === ingredient.id)) {
                listIngredients.find(currentIngredient => currentIngredient[0] === ingredient.id)[1] += 1;
            }
            else {
                listIngredients.push([ingredient.id, 1]);
            }
        });

        // récupérer les ingrédients du plats de allPlats qui ont le meme id que plat.plat.id
        const currentPlat = allPlats.find(currentPlat => currentPlat.id === plat.plat.id);
        if (currentPlat) {
            // console.log(currentPlat.ingredients);
            currentPlat.ingredients.forEach((ingredient) => {
                const quantity = ingredient.qmax === ingredient.qmin ? ingredient.qmax : ingredient.qmin;
                listIngredients.push([ingredient.ingredient.id, quantity]);
            });
        }
    });

    allViandes.forEach((viande) => {
        if (listViandes.some(currentViande => currentViande[0] === viande.id)) {
            listViandes.find(currentViande => currentViande[0] === viande.id)[1] += 1;
        }
        else {
            listViandes.push([viande.id, 1]);
        }
    });

    repas.boisson.forEach((boisson) => {
        if (listBoissons.some(currentBoisson => currentBoisson[0] === boisson.boisson.id)) {
            listBoissons.find(currentBoisson => currentBoisson[0] === boisson.boisson.id)[1] += 1;
        }
        else {
            listBoissons.push([boisson.boisson.id, 1]);
        }

    });

    repas.snack.forEach((snack) => {
        if (listSnacks.some(currentSnack => currentSnack[0] === snack.id)) {
            listSnacks.find(currentSnack => currentSnack[0] === snack.id)[1] += 1;
        }
        else {
            listSnacks.push([snack.snack.id, 1]);
        }
    });


    return {
        "ingredients": listIngredients,
        "viandes": listViandes,
        "boissons": listBoissons,
        "snacks": listSnacks
    };

}

function getAllNom(repas: NewRepas, allViandes: Viandes[]) {
    const listAllNom: string[] = [];


    repas.plat.forEach((plat) => {
        const currentPlat: string[] = [];
        currentPlat.push(plat.plat.nom);
        currentPlat.push(" : ");
        plat.plat.ingredients.forEach((ingredient) => {
            currentPlat.push(ingredient.nom);
            currentPlat.push(", ");
        });
        currentPlat.push("//");
        listAllNom.push(currentPlat.join(""));
    });

    return listAllNom.join(", ");
}



export async function prepareCommande(repas: NewRepas, allViandes: Viandes[], payer: boolean, prix: number, comment : string, userCompte : Comptes, typePaiement : number) {

    const dataPrepared = aggregateQuantities(repas, allViandes, await getPlats().then((data) => data));
    const dataContenu = getAllNom(repas, allViandes);

    var inputDate = new Date().toISOString();
    // const numCompte = parseInt(window.localStorage.getItem("numCompte") || "0");

    const numCompte = userCompte.numCompte;
    const commentaire = (numCompte == -1 ? userCompte.nom + ":: " + comment : comment) ;

    const commande: NewCommandes = {
        "id": -1,
        "contenu": dataContenu,
        "numCompte": numCompte,
        "date": { "$date": inputDate },
        "distribuee": false,
        "prix": prix,
        "typePaiement": typePaiement,
        "commentaire": commentaire,
        "ingredients": dataPrepared.ingredients,
        "viandes": dataPrepared.viandes,
        "boissons": dataPrepared.boissons,
        "snacks": dataPrepared.snacks,
        "payee": payer,
        "periphDonne": false
    };

    // console.log("Commande envoyée", encryptCommande.length);
    postCommande(commande);
}