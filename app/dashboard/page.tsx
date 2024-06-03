'use client';
import {useEffect, useState} from "react";
import {getCommande, getIngredients} from "@/config/api";
import {Ingredients, NewCommandes} from "@/types";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    BarElement
} from 'chart.js';
import {Bar, Line} from "react-chartjs-2";

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

function getDate(NewCommandes: NewCommandes): Date {
    return new Date(parseInt(NewCommandes.date.$date.$numberLong));
}

function aggregateByTimeFrame(commandes: NewCommandes[], timeFrame: TimeFrame): Map<string, number> {
    const result = new Map<string, number>();
    commandes.forEach((commande) => {
        const date = getDate(commande);
        let key: string;
        switch (timeFrame) {
            case TimeFrame.Jour:
                key = date.toLocaleDateString();
                break;
            case TimeFrame.Semaine:
                key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                break;
            case TimeFrame.Mois:
                key = `${date.getFullYear()}-${date.getMonth() + 1}`;
                break;
            case TimeFrame.Annee:
                key = `${date.getFullYear()}`;
                break;
            case TimeFrame.Toujours:
                key = "all_time";
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

const Dashboard = () => {
    const [commandes, setCommandes] = useState<NewCommandes[]>([]);
    const [ingredients, setIngredients] = useState<Ingredients[]>([]);
    const [timeFrame, setTimeFrame] = useState<TimeFrame>(TimeFrame.Jour);

    useEffect(() => {
        const fetchData = async () => {
            const jsonCommande = await getCommande();
            setCommandes(jsonCommande);

            const jsonIngredients = await getIngredients();
            setIngredients(jsonIngredients);
        };
        fetchData();
    }, []);

    // Sort ingredients by quantity
    const sortedIngredients = ingredients.sort((a, b) => b.quantite - a.quantite);

    // Aggregate commandes by time frame and sort labels
    const commandesByTimeFrame = aggregateByTimeFrame(commandes, timeFrame);
    const sortedLabels = Array.from(commandesByTimeFrame.keys());
    sortedLabels.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
    });

    const commandesData = {
        labels: sortedLabels,
        datasets: [
            {
                label: `Commandes par ${TimeFrame[timeFrame].toLowerCase()}`,
                data: Array.from(commandesByTimeFrame.values()),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };

    const ingredientsData = {
        labels: sortedIngredients.map((ingredient) => ingredient.nom),
        datasets: [
            {
                label: 'Quantité',
                data: sortedIngredients.map((ingredient) => ingredient.quantite),
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };

    return (
        <>
            <div className="min-h-screen flex flex-col p-8">
                <div className="flex flex-row space-x-8">
                    <div className="w-1/2 p-6 shadow-md rounded-lg border-2 border-red-500">
                        <h2 className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">Commandes</h2>
                        <div className="flex flex-col space-y-4">
                            <select value={timeFrame} onChange={(e) => setTimeFrame(Number(e.target.value))}>
                                {Object.values(TimeFrame).filter(value => typeof value === 'number').map((value, index) => (
                                    <option key={index} value={value}>{TimeFrame[value]}</option>
                                ))}
                            </select>
                            <Line data={commandesData} width={600} height={400}/>
                        </div>
                    </div>

                    <div className="w-1/2 p-6 shadow-md rounded-lg border-2 border-red-500">
                        <h2 className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">Ingrédients</h2>
                        <div className="flex flex-col space-y-4">
                            <Bar data={ingredientsData} width={600} height={400}/>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );
};

export default Dashboard;