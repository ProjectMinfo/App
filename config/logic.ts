import { postCommande, getPlats } from "@/config/api";
import { Boissons, Menus, NewCommandes, Plats, Snacks, Viandes } from "@/types";
import { useEffect, useState } from "react";
import crypto from "crypto";

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

function getPrice(repas: NewRepas) {
    let price = 0;

    repas.menu.forEach((menu) => {
        price += menu.menu.prix;
    });

    repas.plat.forEach((plat) => {
        price += plat.plat.prix;
    });

    repas.boisson.forEach((boisson) => {
        price += boisson.boisson.prix;
    });

    repas.snack.forEach((snack) => {
        price += snack.snack.prix;
    });

    return parseFloat(price.toFixed(3));;
}


function encryptCommande(commande: any) {

    try {
        const ENC_KEY = "vuAoN8t3jAmrrUpkjgpY6YgRc4hyjQ8p";
        const IV = "D2H*wUKNwwii#CH!";

        let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
        let encrypted = cipher.update(commande, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (e) {
        console.log(e);
    }
}



export function prepareCommande(repas: NewRepas, allViandes: Viandes[]) {
    const [commandeEnvoyee, setCommandeEnvoyee] = useState(false);
    const [allPlats, setAllPlats] = useState<Plats[]>([]);

    getPlats().then((data) => {
        setAllPlats(data);
    });

    if (!commandeEnvoyee) {
        const dataPrepared = aggregateQuantities(repas, allViandes, allPlats);
        const dataContenu = getAllNom(repas, allViandes);
        const dataPrix = getPrice(repas);

        var inputDate = new Date().toISOString();
        const numCompte = parseInt(window.localStorage.getItem("numCompte") || "0");

        const commande: NewCommandes = {
            "id": -1,
            "contenu": dataContenu,
            "numCompte": numCompte,
            "date": { "$date": inputDate },
            "distribuee": false,
            "prix": dataPrix,
            "typePaiement": 1,
            "commentaire": "",
            "ingredients": dataPrepared.ingredients,
            "viandes": dataPrepared.viandes,
            "boissons": dataPrepared.boissons,
            "snacks": dataPrepared.snacks,
            "payee": true
        };

        const encryptedCommande = encryptCommande(JSON.stringify(commande));

        // console.log("Commande envoyée", encryptCommande.length);
        postCommande(encryptedCommande);
        setCommandeEnvoyee(true);
    }

    return;
}
