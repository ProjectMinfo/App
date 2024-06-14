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
import {
    aggregateByTimeFrame,
    CollectionType, getDatasetFromCollectionType,
    getMonthNumber,
    getDate,
    getTemperaturesByTimeFrame, Temp,
    TimeFrame, getChiffreAffaire
} from "@/app/dashboard/logic";

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
    console.log(commandesByTimeFrame);
/*    let mapArray = Array.from(commandesByTimeFrame.entries());
    mapArray.sort((a, b) => {
        return new Date(a[0]).getTime() - new Date(b[0]).getTime();
    });
    const sortedCommandes = new Map<string, number>(mapArray);*/
    const commandesData = {
        labels: Array.from(commandesByTimeFrame.keys()),
        datasets: [
            {
                label: `Commandes par ${TimeFrame[timeFrame].toLowerCase()}`,
                data: Array.from(commandesByTimeFrame.values()),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.3,
            },
        ],
    };

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

    const chiffreAffaire = getChiffreAffaire(commandes)
    const chiffreAffaireData = {
        labels: Array.from(chiffreAffaire.keys()),
        datasets: [
            {
                label: "Chiffre d'affaire du jour",
                data: Array.from(chiffreAffaire.values()),
                fill: true,
                backgroundColor: 'rgb(132, 255, 255)',
                borderColor: 'rgba(132, 255, 255, 0.2)',
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


                <Card className="col-span-2 row-span-1 p-2 max-md:max-h-[300px]">
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

                <Card className="col-span-3 row-span-1 p-2 max-md:max-h-[300px]">
                    <CardHeader className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">Chiffre
                        d'affaire</CardHeader>
                    <CardBody>
                        <Line data={chiffreAffaireData}></Line>
                    </CardBody>
                </Card>

                <Card className="col-span-3 p-2">
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