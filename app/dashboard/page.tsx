'use client';
import {useEffect, useState} from "react";
import {getAllTemperatures, getBoissons, getCommande, getIngredients, getSnacks, getViandes} from "@/config/api";
import {Boissons, Ingredients, NewCommandes, Snacks, Temperatures, Viandes} from "@/types";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import {Bar, Line} from "react-chartjs-2";
import {Card, CardBody, CardHeader} from "@nextui-org/react";

// Register Chart.js components
ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

enum TimeFrame {
    Jour,
    Semaine,
    Mois,
    Annee,
    Toujours
}

enum CollectionType {
    Ingredients,
    Snacks,
    Boissons,
    Viandes
}

function getDate(NewCommandes: NewCommandes): Date {
    return new Date(parseInt(NewCommandes.date.$date.$numberLong));
}

function getDatasetFromCollection(collection: Ingredients[] | Snacks[] | Boissons[] | Viandes[]): Object {
    const sortedCollection = collection.sort((a, b) => b.quantite - a.quantite);
    return {
        labels: sortedCollection.map((item) => item.nom),
        datasets: [
            {
                label: 'Quantité',
                data: sortedCollection.map((item) => item.quantite),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };
}

function getDatasetFromCollectionType(collectionType: CollectionType, ingredients: Ingredients[], snacks: Snacks[], boissons: Boissons[], viandes: Viandes[]): Object {
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

function aggregateByTimeFrame(commandes: NewCommandes[], timeFrame: TimeFrame): Map<string, number> {
    const result = new Map<string, number>();
    const currDate = new Date();
    commandes.forEach((commande) => {
        const date = getDate(commande);
        let key: string;
        switch (timeFrame) {
            case TimeFrame.Jour:
                if (date.getFullYear() != currDate.getFullYear())
                    break;
                key = date.toLocaleDateString();
                break;
            case TimeFrame.Semaine:
                if (date.getFullYear() != currDate.getFullYear())
                    break;
                key = getWeekNumber(date.toLocaleDateString()).toString();
                break;
            case TimeFrame.Mois:
                if (date.getFullYear() != currDate.getFullYear())
                    break;
                key = getMonthName(date.toLocaleDateString());
                break;
            case TimeFrame.Annee:
                key = date.getFullYear().toString();
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
    return result;
}

function getWeekNumber(dateStr: string) {
    let date = new Date(dateStr);
    const currentDate = (typeof date === 'object') ? date : new Date();

    const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
    const daysToNextMonday = (januaryFirst.getDay() === 1) ? 0 : (7 - januaryFirst.getDay()) % 7;
    const nextMonday = new Date(currentDate.getFullYear(), 0, januaryFirst.getDate() + daysToNextMonday);

    return (currentDate < nextMonday) ? 52 :
        (currentDate > nextMonday ? Math.ceil(
            (currentDate - nextMonday) / (24 * 3600 * 1000) / 7) : 1);
}

type Temp = {
    tmp1: number,
    tmp2: number,
    tmp3: number | null
}

function getMonthName(dateStr: string): string {
    const month = new Date(dateStr).getMonth();
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
        12: "Décembre"
    };
    return lut[month];
}

function getMonthNumber(monthName: string): number {
    const lut = {
        "Janvier": 1,
        "Février": 2,
        "Mars": 3,
        "Avril": 4,
        "Mai": 5,
        "Juin": 6,
        "Juillet": 7,
        "Août": 8,
        "Septembre": 9,
        "Octobre": 10,
        "Novembre": 11,
        "Décembre": 12
    };
    return lut[monthName];
}

function getTemperaturesByTimeFrame(temperatures: Temperatures[], timeFrame: TimeFrame): Map<string, Temp> {
    let result = new Map<string, Temperatures[]>;
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
    const currentDate = new Date();
    switch (timeFrame) {
        case TimeFrame.Jour:
            // Calcule la moyenne de chaque jour
            result.forEach((temp, date) => {
                if (new Date(date).getFullYear() === currentDate.getFullYear()) {
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
        case TimeFrame.Semaine:
            // Calcule la moyenne de chaque semaine
            result.forEach((temp1, date1) => {
                result.forEach((temp2, date2) => {
                    if (new Date(date1).getFullYear() === currentDate.getFullYear()){
                        if (getWeekNumber(date1) === getWeekNumber(date2)) {
                            // Calcule la moyenne des températures
                            let tmp: Temp = {tmp1: 0, tmp2: 0, tmp3: 0 || null};
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
                            meanTemp.set(getWeekNumber(date1), tmp);
                        }
                    }
                });
            });
            break;
        case TimeFrame.Mois:
            // Calcule la moyenne de chaque mois
            result.forEach((temp1, date1) => {
                result.forEach((temp2, date2) => {
                    if (new Date(date1).getMonth() === new Date(date2).getMonth() && new Date(date1).getFullYear() === new Date(date2).getFullYear() && new Date(date1).getFullYear() === currentDate.getFullYear()) {
                        // Calcule la moyenne des températures
                        let tmp: Temp = {tmp1: 0, tmp2: 0, tmp3: 0 || null};
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
                        let tmp: Temp = {tmp1: 0, tmp2: 0, tmp3: 0 || null};
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
    return meanTemp;
}

type Temp = {
    tmp1: number,
    tmp2: number,
    tmp3: number | null
}

const Dashboard = () => {
    const [commandes, setCommandes] = useState<NewCommandes[]>([]);
    const [ingredients, setIngredients] = useState<Ingredients[]>([]);
    const [snacks, setSnacks] = useState<Snacks[]>([]);
    const [boissons, setBoissons] = useState<Boissons[]>([]);
    const [viandes, setViandes] = useState<Viandes[]>([]);
    const [temperatures, setTemperatures] = useState<Temperatures[]>([]);

    const [timeFrame, setTimeFrame] = useState<TimeFrame>(TimeFrame.Jour);
    const [tempTimeFrame, setTempTimeFrame] = useState<TimeFrame>(TimeFrame.Jour);
    const [data, setData] = useState<CollectionType>(CollectionType.Ingredients);

    useEffect(() => {
        const fetchData = async () => {
            setCommandes(await getCommande());
            setIngredients(await getIngredients());
            setSnacks(await getSnacks());
            setBoissons(await getBoissons());
            setViandes(await getViandes());
            setTemperatures(await getAllTemperatures());
        };
        fetchData();
    }, []);

    // Aggregate commandes by time frame and sort labels
    const commandesByTimeFrame = aggregateByTimeFrame(commandes, timeFrame);
    let mapArray = Array.from(commandesByTimeFrame.entries());
    mapArray.sort((a, b) => {
        switch (timeFrame) {
            case TimeFrame.Jour:
                const dateA = new Date(a[0]);
                const dateB = new Date(b[0]);
                return dateA.getDate() - dateB.getDate();
            case TimeFrame.Semaine:
                return parseInt(a[0]) - parseInt(b[0]);
            case TimeFrame.Mois:
                return getMonthNumber(a[0]) - getMonthNumber(b[0]);
            case TimeFrame.Annee:
                return parseInt(a[0]) - parseInt(b[0]);
            case TimeFrame.Toujours:
                const dateC = new Date(a[0]);
                const dateD = new Date(b[0]);
                return dateC.getUTCDate() - dateD.getUTCDate();
        }
    });
    const sortedCommandes = new Map<string, number>(mapArray);

    // Aggregate temperatures by time frame
    const temperaturesByTimeFrame = getTemperaturesByTimeFrame(temperatures, tempTimeFrame);
    let mapArrayTemp = Array.from(temperaturesByTimeFrame.entries());
    mapArrayTemp.sort((a, b) => {
        switch (tempTimeFrame) {
            case TimeFrame.Jour:
                const dateA = new Date(a[0]);
                const dateB = new Date(b[0]);
                return dateA.getDate() - dateB.getDate();
            case TimeFrame.Semaine:
                return parseInt(a[0]) - parseInt(b[0]);
            case TimeFrame.Mois:
                return getMonthNumber(a[0]) - getMonthNumber(b[0]);
            case TimeFrame.Annee:
                return parseInt(a[0]) - parseInt(b[0]);
            case TimeFrame.Toujours:
                const dateC = new Date(a[0]);
                const dateD = new Date(b[0]);
                return dateC.getDate(new Date(a[0])) - dateD.getDate(new Date(b[0]));
        }
    });
    const sortedTemps = new Map<string, Temp>(mapArrayTemp);

    const commandesData = {
        labels: Array.from(sortedCommandes.keys()),
        datasets: [
            {
                label: `Commandes par ${TimeFrame[timeFrame].toLowerCase()}`,
                data: Array.from(sortedCommandes.values()),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
            },
        ],
    };

    const temperaturesData = {
        labels: Array.from(sortedTemps.keys()),
        datasets: [
            {
                label: 'Frigo 1',
                // Data is all the temperatures of the frigo 1 (tmp1)
                data: Array.from(sortedTemps.values()).map((temp) => temp.tmp1),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
            },
            {
                label: 'Frigo 2',
                data: Array.from(sortedTemps.values()).map((temp) => temp.tmp2),
                fill: false,
                backgroundColor: 'rgb(55, 255, 132)',
                borderColor: 'rgba(55, 255, 132, 0.2)',
                tension: 0.3,
            },
            {
                label: 'Frigo 3',
                data: Array.from(sortedTemps.values()).map((temp) => temp.tmp3),
                fill: false,
                backgroundColor: 'rgb(132, 255, 255)',
                borderColor: 'rgba(132, 255, 255, 0.2)',
                tension: 0.3,
            },
        ],
    };


    return (
        <>
            <div className="grid grid-cols-6 gap-4">
                <Card className="col-span-6 p-2">
                    <CardHeader
                        className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">Commandes</CardHeader>
                    <CardBody>
                        <select value={timeFrame} onChange={(e) => setTimeFrame(Number(e.target.value))}>
                            {Object.values(TimeFrame).filter(value => typeof value === 'number').map((value, index) => (
                                <option key={index} value={value}>{TimeFrame[value]}</option>
                            ))}
                        </select>
                        <Line data={commandesData}/>
                    </CardBody>
                </Card>

                <Card className="col-span-4 p-2">
                    <CardHeader
                        className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">Températures
                        frigo</CardHeader>
                    <CardBody>
                        <select value={tempTimeFrame} onChange={(e) => setTempTimeFrame(Number(e.target.value))}>
                            {Object.values(TimeFrame).filter(value => typeof value === 'number').map((value, index) => (
                                <option key={index} value={value}>{TimeFrame[value]}</option>
                            ))}
                        </select>
                        <Line data={temperaturesData}></Line>
                    </CardBody>
                </Card>


                <Card className="col-span-2 row-span-1 p-2">
                    <CardHeader className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">Dernières
                        Commandes</CardHeader>
                    <CardBody>
                        <ul>
                            {
                                commandes.slice(commandes.length - 15, commandes.length).reverse().map((commande, index) => (
                                    <li key={index}>{getDate(commande).toLocaleString()}</li>
                                ))
                            }
                        </ul>
                    </CardBody>
                </Card>

                <Card className="col-span-2 row-span-1 p-2">
                    <CardHeader className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">Dernières
                        Commandes</CardHeader>
                    <CardBody>
                        <ul>
                            {
                                commandes.slice(commandes.length - 15, commandes.length).reverse().map((commande, index) => (
                                    <li key={index}>{getDate(commande).toLocaleString()}</li>
                                ))
                            }
                        </ul>
                    </CardBody>
                </Card>

                <Card className="col-span-4 p-2">
                    <CardHeader
                        className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">Stocks
                    </CardHeader>
                    <CardBody>
                        <select value={data} onChange={(e) => setData(Number(e.target.value))}>
                            {Object.values(CollectionType).filter(value => typeof value === 'number').map((value, index) => (
                                <option key={index} value={value}>{CollectionType[value]}</option>
                            ))}
                        </select>
                        <Bar data={getDatasetFromCollectionType(data, ingredients, snacks, boissons, viandes)}/>
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default Dashboard;