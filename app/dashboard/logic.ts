import {getBoissonById, getIngredientById, getSnackById, getViandeById} from "@/config/api";
import {Boissons, Ingredients, NewCommandes, Snacks, Temperatures, Viandes,} from "@/types";

export enum TimeFrame {
    Jour,
    Semaine,
    Mois,
    Annee,
    Toujours,
}

export enum CollectionType {
    Ingredients,
    Snacks,
    Boissons,
    Viandes,
}

export function getDate(NewCommandes: NewCommandes): Date {
    return new Date(parseInt(NewCommandes.date.$date.$numberLong));
}

export function convertToDate(dateStr: string): Date {
    //  Convert a "dd/MM/yyyy" string into a Date object
    let d = dateStr.split("/");
    return new Date(d[2] + "/" + d[1] + "/" + d[0]);
}

/*export function getWeekDay(date: Date): string {
    // Array of weekday names
    const weekDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    // Get the day of the week as a number (0-6)
    const dayIndex = date.getDay();

    // Return the corresponding weekday name
    return weekDays[dayIndex];
}*/

export function getDatasetFromCollection(
    collection: Ingredients[] | Snacks[] | Boissons[] | Viandes[]
): Object {
    const sortedCollection = collection.sort((a, b) => b.quantite - a.quantite);
    return {
        labels: sortedCollection.map((item) => item.nom),
        datasets: [
            {
                label: "Quantité",
                data: sortedCollection.map((item) => item.quantite),
                fill: false,
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgba(255, 99, 132, 0.2)",
            },
        ],
    };
}

export function getDatasetFromCollectionType(
    collectionType: CollectionType,
    ingredients: Ingredients[],
    snacks: Snacks[],
    boissons: Boissons[],
    viandes: Viandes[]
): Object {
    switch (collectionType) {
        case CollectionType.Ingredients:
            return getDatasetFromCollection(ingredients);
        case CollectionType.Snacks:
            return getDatasetFromCollection(snacks);
        case CollectionType.Boissons:
            return getDatasetFromCollection(boissons);
        case CollectionType.Viandes:
            return getDatasetFromCollection(viandes);
    }
}

export function getChiffreAffaire(
    commandes: NewCommandes[]
): Map<string, number> {
    const result = new Map<string, number>();
    commandes.forEach((commande) => {
        const date = getDate(commande);
        let key = date.toLocaleDateString();
        if (result.has(key)) {
            result.set(key, result.get(key) + commande.prix);
            // console.log(key, ":", result.get(key) + commande.prix);
        } else {
            result.set(key, commande.prix);
            // console.log(key, ":", result.get(key));
        }
    });

    // Sort the map by key
    let mapArray = Array.from(result.entries());
    mapArray.sort((a, b) => {
        return convertToDate(a[0]).getTime() - convertToDate(b[0]).getTime();
    });
    return new Map<string, number>(mapArray);
}

export function aggregateByTimeFrame(
    commandes: NewCommandes[],
    timeFrame: TimeFrame
): Map<string, number> {
    const result = new Map<string, number>();
    const currDate = new Date();
    commandes.forEach((commande) => {
        let date = getDate(commande);
        let key: string;
        switch (timeFrame) {
            case TimeFrame.Jour:
                if (date.toLocaleDateString() != currDate.toLocaleDateString()) break;
                key = `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:00`;
                break;
            case TimeFrame.Semaine:
                if (currDate.getTime() - date.getTime() > 7 * 24 * 60 * 60 * 1000)
                    break;

                key = date.toLocaleDateString();
                break;
            case TimeFrame.Mois:
                if (
                    date.getMonth() != currDate.getMonth() &&
                    date.getFullYear() != currDate.getFullYear()
                )
                    break;
                key = date.toLocaleDateString();
                break;
            case TimeFrame.Annee:
                if (date.getFullYear() != currDate.getFullYear()) break;
                key = date.toLocaleDateString();
                break;
            case TimeFrame.Toujours:
                key = date.toLocaleDateString();
                break;
        }
        if (result.has(key)) {
            result.set(key, result.get(key) + 1);
        } else {
            result.set(key, 1);
        }
    });

    // Sort the map by key
    let mapArray = Array.from(result.entries());
    mapArray.sort((a, b) => {
        if (timeFrame === TimeFrame.Jour) {
            return parseInt(a[0]) - parseInt(b[0]);
        } else {
            if (!a[0] || !b[0]) return 0;
            return convertToDate(a[0]).getTime() - convertToDate(b[0]).getTime();
        }
    });
    return new Map<string, number>(mapArray);
}

export type Temp = {
    tmp1: number;
    tmp2: number;
    tmp3: number | null;
};

export function getTemperaturesByTimeFrame(
    temperatures: Temperatures[],
    timeFrame: TimeFrame
): Map<string, Temp> {
    let result = new Map<string, Temperatures[]>();
    // Regroupe toutes les températures qui ont la même date
    temperatures.forEach((temperature) => {
        const date = new Date(temperature.date).toLocaleDateString();
        if (result.has(date)) {
            result.get(date).push(temperature);
        } else {
            result.set(date, [temperature]);
        }
    });
    // console.log(result);

    // Calcule la moyenne en fonction du timeFrame
    let meanTemp = new Map<string, Temp>();
    const currDate = new Date();
    switch (timeFrame) {
        case TimeFrame.Jour:
            result.forEach((temp, date) => {
                const _date = convertToDate(date);
                if (
                    _date.toLocaleDateString() === currDate.toLocaleDateString()
                ) {
                    // Calcule la moyenne des températures
                    let tmp: Temp = {tmp1: 0, tmp2: 0, tmp3: 0 || null};
                    temp.forEach((temperature) => {
                        tmp.tmp1 += temperature.tmp1;
                        tmp.tmp2 += temperature.tmp2;
                        tmp.tmp3 += temperature.tmp3;
                    });
                    tmp.tmp1 /= temp.length;
                    tmp.tmp2 /= temp.length;
                    tmp.tmp3 /= temp.length;
                    let key = _date.toLocaleDateString();

                    meanTemp.set(key, tmp);
                }
            });
            break;
        case TimeFrame.Semaine:
            // Calcule la moyenne de chaque semaine
            result.forEach((temp, date) => {
                const _date = convertToDate(date); /*new Date(date);*/
                if (currDate.getTime() - _date.getTime() < 7 * 24 * 60 * 60 * 1000) {
                    // console.log(currDate.getTime() - _date.getTime(), 7 * 24 * 60 * 60 * 1000)
                    // Calcule la moyenne des températures
                    let tmp: Temp = {tmp1: 0, tmp2: 0, tmp3: 0 || null};
                    temp.forEach((temperature) => {
                        tmp.tmp1 += temperature.tmp1;
                        tmp.tmp2 += temperature.tmp2;
                        tmp.tmp3 += temperature.tmp3;
                    });
                    tmp.tmp1 /= temp.length;
                    tmp.tmp2 /= temp.length;
                    tmp.tmp3 /= temp.length;
                    meanTemp.set(date, tmp);
                }
            });
            break;
        case TimeFrame.Mois:
            result.forEach((temp, date) => {
                const _date = convertToDate(date); /*new Date(date);*/
                if (
                    currDate.getMonth() === _date.getMonth()
                    && currDate.getFullYear() === _date.getFullYear()
                ) {
                    // Calcule la moyenne des températures
                    let tmp: Temp = {tmp1: 0, tmp2: 0, tmp3: 0 || null};
                    temp.forEach((temperature) => {
                        tmp.tmp1 += temperature.tmp1;
                        tmp.tmp2 += temperature.tmp2;
                        tmp.tmp3 += temperature.tmp3;
                    });
                    tmp.tmp1 /= temp.length;
                    tmp.tmp2 /= temp.length;
                    tmp.tmp3 /= temp.length;
                    meanTemp.set(date, tmp);
                }
            });
            break;
        case TimeFrame.Annee:
            result.forEach((temp, date) => {
                const _date = convertToDate(date); /*new Date(date);*/
                if (_date.getFullYear() === currDate.getFullYear()) {
                    // Calcule la moyenne des températures
                    let tmp: Temp = {tmp1: 0, tmp2: 0, tmp3: 0 || null};
                    temp.forEach((temperature) => {
                        tmp.tmp1 += temperature.tmp1;
                        tmp.tmp2 += temperature.tmp2;
                        tmp.tmp3 += temperature.tmp3;
                    });
                    tmp.tmp1 /= temp.length;
                    tmp.tmp2 /= temp.length;
                    tmp.tmp3 /= temp.length;
                    meanTemp.set(date, tmp);
                }
            });
            break;
        case TimeFrame.Toujours:
            // Calcule la moyenne de chaque jour
            result.forEach((temp, date) => {
                // Calcule la moyenne des températures
                let tmp: Temp = {tmp1: 0, tmp2: 0, tmp3: 0 || null};
                temp.forEach((temperature) => {
                    tmp.tmp1 += temperature.tmp1;
                    tmp.tmp2 += temperature.tmp2;
                    tmp.tmp3 += temperature.tmp3;
                });
                tmp.tmp1 /= temp.length;
                tmp.tmp2 /= temp.length;
                tmp.tmp3 /= temp.length;
                meanTemp.set(date, tmp);
            });
            break;
    }
    // Trier la map par date
    let mapArray = Array.from(meanTemp.entries());
    mapArray.sort((a, b) => {
        /*        console.log(
                    "Date a:", a[0],
                    "\nDate b:", b[0],
                    "\nDate a as Date:", convertToDate(a[0]),
                    "\nDate b as Date:", convertToDate(b[0]),
                    "\nDate a as Date getTime:", convertToDate(a[0]).getTime() / 1000,
                    "\nDate b as Date getTime:", convertToDate(b[0]).getTime() / 1000,
                    "\nOldest:", convertToDate(a[0]).getTime() < convertToDate(b[0]).getTime() ? a[0] : b[0],
                )*/
        return convertToDate(a[0]).getTime() < convertToDate(b[0]).getTime() ? -1 : 1;
    });
    return new Map<string, Temp>(mapArray);
    // return meanTemp;
}

export const getNameById = async (
    id: number, collectionType: CollectionType
): Promise<string | null> => {
    try {
        let name = "";
        switch (collectionType) {
            case CollectionType.Ingredients:
                const ingredient = await getIngredientById(id);
                name = ingredient.nom;
                break;
            case CollectionType.Snacks:
                const snack = await getSnackById(id);
                name = snack.nom;
                break;
            case CollectionType.Boissons:
                const boisson = await getBoissonById(id);
                name = boisson.nom;
                break;
            case CollectionType.Viandes:
                const viande = await getViandeById(id);
                name = viande.nom;
                break;
        }
        return name;
    } catch (error) {
        //console.error("Error fetching name:", error);
        return null;
    }
};

export async function getCollectionTendance(
    commandes: NewCommandes[],
    collectionType: CollectionType
): Promise<Map<string, Map<string, number>>> {
    const result = new Map<string, Map<string, number>>();
    const currDate = new Date();

    for (const commande of commandes) {
        const date = getDate(commande);
        if (
            date.getMonth() === currDate.getMonth() &&
            date.getFullYear() === currDate.getFullYear()
        ) {
            switch (collectionType) {
                case CollectionType.Ingredients:
                    for (const ingredient of commande.ingredients) {
                        const ingredientId = ingredient[0];
                        const ingredientQuantity = ingredient[1];
                        const ingredientName = await getNameById(ingredientId, CollectionType.Ingredients);

                        if (ingredientName === null) {
                            continue;
                        }

                        if (!result.has(date.toLocaleDateString())) {
                            result.set(date.toLocaleDateString(), new Map<string, number>());
                        }

                        const dailyIngredients = result.get(date.toLocaleDateString());
                        if (dailyIngredients.has(ingredientName)) {
                            dailyIngredients.set(
                                ingredientName,
                                dailyIngredients.get(ingredientName) + ingredientQuantity
                            );
                        } else {
                            dailyIngredients.set(ingredientName, ingredientQuantity);
                        }
                    }
                    break;
                case CollectionType.Snacks:
                    for (const snack of commande.snacks) {
                        const snackId = snack[0];
                        const snackQuantity = snack[1];
                        const snackName = await getNameById(snackId, CollectionType.Snacks);

                        if (snackName === null) {
                            continue;
                        }

                        if (!result.has(date.toLocaleDateString())) {
                            result.set(date.toLocaleDateString(), new Map<string, number>());
                        }

                        const dailySnacks = result.get(date.toLocaleDateString());
                        if (dailySnacks.has(snackName)) {
                            dailySnacks.set(
                                snackName,
                                dailySnacks.get(snackName) + snackQuantity
                            );
                        } else {
                            dailySnacks.set(snackName, snackQuantity);
                        }
                    }
                    break;

                case CollectionType.Boissons:
                    for (const boisson of commande.boissons) {
                        const boissonId = boisson[0];
                        const boissonQuantity = boisson[1];
                        const boissonName = await getNameById(boissonId, CollectionType.Boissons);

                        if (boissonName === null) {
                            continue;
                        }

                        if (!result.has(date.toLocaleDateString())) {
                            result.set(date.toLocaleDateString(), new Map<string, number>());
                        }

                        const dailyBoissons = result.get(date.toLocaleDateString());
                        if (dailyBoissons.has(boissonName)) {
                            dailyBoissons.set(
                                boissonName,
                                dailyBoissons.get(boissonName) + boissonQuantity
                            );
                        } else {
                            dailyBoissons.set(boissonName, boissonQuantity);
                        }
                    }
                    break;

                case CollectionType.Viandes:
                    for (const viande of commande.viandes) {
                        const viandeId = viande[0];
                        const viandeQuantity = viande[1];
                        const viandeName = await getNameById(viandeId, CollectionType.Viandes);

                        if (viandeName === null) {
                            continue;
                        }

                        if (!result.has(date.toLocaleDateString())) {
                            result.set(date.toLocaleDateString(), new Map<string, number>());
                        }

                        const dailyViandes = result.get(date.toLocaleDateString());
                        if (dailyViandes.has(viandeName)) {
                            dailyViandes.set(
                                viandeName,
                                dailyViandes.get(viandeName) + viandeQuantity
                            );
                        } else {
                            dailyViandes.set(viandeName, viandeQuantity);
                        }
                    }
                    break;
            }
        }
    }
    // return result;
    // Sort par date
    let mapArray = Array.from(result.entries());
    mapArray.sort((a, b) => {
        return convertToDate(a[0]).getTime() - convertToDate(b[0]).getTime();
    });
    return new Map<string, Map<string, number>>(mapArray);
}

// Fonction pour générer une couleur aléatoire en format RGBA
export const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    let background = `rgb(${r}, ${g}, ${b})`;
    let border = `rgba(${r}, ${g}, ${b}, 0.2)`;
    return {background, border};
};