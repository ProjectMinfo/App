import {getBoissonById, getIngredientById, getSnackById, getViandeById} from "@/config/api";
import {
  Boissons,
  Ingredients,
  NewCommandes,
  Snacks,
  Temperatures,
  Viandes,
} from "@/types";
import { get } from "http";

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
    const date = getDate(commande);
    let key: string;
    switch (timeFrame) {
      case TimeFrame.Jour:
        if (date.toLocaleDateString() != currDate.toLocaleDateString()) break;
        key = `${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:00`;
        break;
      case TimeFrame.Semaine:
        // Skip of the commande date is more than a week old
        // if (date.getTime() < currDate.getTime() - 7 * 24 * 60 * 60 * 1000) break;
/*        if (date.getDay() != currDate.getDay()) break;
        key = date.toLocaleDateString();*/
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
      return convertToDate(a[0]).getTime() - convertToDate(b[0]).getTime();
    }
  });
  return new Map<string, number>(mapArray);
}

/*export function getWeekNumber(dateStr: string) {
    let date = new Date(dateStr);
    const currentDate = (typeof date === 'object') ? date : new Date();

    const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
    const daysToNextMonday = (januaryFirst.getDay() === 1) ? 0 : (7 - januaryFirst.getDay()) % 7;
    const nextMonday = new Date(currentDate.getFullYear(), 0, januaryFirst.getDate() + daysToNextMonday);

    return (currentDate < nextMonday) ? 52 :
        (currentDate > nextMonday ? Math.ceil(
            (currentDate - nextMonday) / (24 * 3600 * 1000) / 7) : 1);
}*/

export type Temp = {
  tmp1: number;
  tmp2: number;
  tmp3: number | null;
};

export function getMonthName(dateStr: string): string {
  const month = parseInt(dateStr.split("/")[1]);
  const lut = {
    1: "Janvier",
    2: "Février",
    3: "Mars",
    4: "Avril",
    5: "Mai",
    6: "Juin",
    7: "Juillet",
    8: "Août",
    9: "Septembre",
    10: "Octobre",
    11: "Novembre",
    12: "Décembre",
  };
  return lut[month];
}

export function getMonthNumber(monthName: string): number {
  const lut = {
    Janvier: 1,
    Février: 2,
    Mars: 3,
    Avril: 4,
    Mai: 5,
    Juin: 6,
    Juillet: 7,
    Août: 8,
    Septembre: 9,
    Octobre: 10,
    Novembre: 11,
    Décembre: 12,
  };
  return lut[monthName];
}

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
      // Calcule la moyenne de chaque jour
      result.forEach((temp, date) => {
        const _date = new Date(date);
        if (
          _date.getDay() == currDate.getDay() &&
          _date.getMonth() == currDate.getMonth() &&
          _date.getFullYear() == currDate.getFullYear()
        ) {
          // Calcule la moyenne des températures
          let tmp: Temp = { tmp1: 0, tmp2: 0, tmp3: 0 || null };
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
      result.forEach((temp1, date1) => {
        result.forEach((temp2, date2) => {
          const _date1 = new Date(date2);
          const _date2 = new Date(date2);
          if (
            _date1.getFullYear() === _date2.getFullYear() &&
            _date1.getFullYear() === currDate.getFullYear() &&
            _date1.getMonth() == currDate.getMonth()
          ) {
            if (
              _date1.getTime() - currDate.getTime() <
              7 * 24 * 60 * 60 * 1000
            ) {
              // Calcule la moyenne des températures
              let tmp: Temp = { tmp1: 0, tmp2: 0, tmp3: 0 || null };
              temp1.forEach((temperature) => {
                tmp.tmp1 += temperature.tmp1;
                tmp.tmp2 += temperature.tmp2;
                tmp.tmp3 += temperature.tmp3;
              });
              temp2.forEach((temperature) => {
                tmp.tmp1 += temperature.tmp1;
                tmp.tmp2 += temperature.tmp2;
                tmp.tmp3 += temperature.tmp3;
              });
              tmp.tmp1 /= temp1.length + temp2.length;
              tmp.tmp2 /= temp1.length + temp2.length;
              tmp.tmp3 /= temp1.length + temp2.length;
              meanTemp.set(date1, tmp);
            }
          }
        });
      });
      break;
    case TimeFrame.Mois:
      // Calcule la moyenne de chaque mois
      result.forEach((temp1, date1) => {
        result.forEach((temp2, date2) => {
          const _date1 = new Date(date1);
          const _date2 = new Date(date2);
          if (
            _date1.getMonth() === _date2.getMonth() &&
            _date1.getFullYear() === _date2.getFullYear() &&
            _date1.getFullYear() === currDate.getFullYear()
          ) {
            // Calcule la moyenne des températures
            let tmp: Temp = { tmp1: 0, tmp2: 0, tmp3: 0 || null };
            temp1.forEach((temperature) => {
              tmp.tmp1 += temperature.tmp1;
              tmp.tmp2 += temperature.tmp2;
              tmp.tmp3 += temperature.tmp3;
            });
            temp2.forEach((temperature) => {
              tmp.tmp1 += temperature.tmp1;
              tmp.tmp2 += temperature.tmp2;
              tmp.tmp3 += temperature.tmp3;
            });
            tmp.tmp1 /= temp1.length + temp2.length;
            tmp.tmp2 /= temp1.length + temp2.length;
            tmp.tmp3 /= temp1.length + temp2.length;
            meanTemp.set(getMonthName(date1), tmp);
          }
        });
      });
      break;
    case TimeFrame.Annee:
      // Calcule la moyenne de chaque année
      result.forEach((temp1, date1) => {
        result.forEach((temp2, date2) => {
          if (new Date(date1).getFullYear() === new Date(date2).getFullYear()) {
            // Calcule la moyenne des températures
            let tmp: Temp = { tmp1: 0, tmp2: 0, tmp3: 0 || null };
            temp1.forEach((temperature) => {
              tmp.tmp1 += temperature.tmp1;
              tmp.tmp2 += temperature.tmp2;
              tmp.tmp3 += temperature.tmp3;
            });
            temp2.forEach((temperature) => {
              tmp.tmp1 += temperature.tmp1;
              tmp.tmp2 += temperature.tmp2;
              tmp.tmp3 += temperature.tmp3;
            });
            tmp.tmp1 /= temp1.length + temp2.length;
            tmp.tmp2 /= temp1.length + temp2.length;
            tmp.tmp3 /= temp1.length + temp2.length;
            meanTemp.set(new Date(date1).getFullYear(), tmp);
          }
        });
      });
      break;
    case TimeFrame.Toujours:
      // Calcule la moyenne de chaque jour
      result.forEach((temp, date) => {
        // Calcule la moyenne des températures
        let tmp: Temp = { tmp1: 0, tmp2: 0, tmp3: 0 || null };
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
  return meanTemp;
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
    console.error("Error fetching ingredient name:", error);
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

            if (!ingredientName) {
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
  return { background, border };
};