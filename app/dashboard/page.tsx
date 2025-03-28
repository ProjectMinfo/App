"use client";
import { useEffect, useState } from "react";

import {
  getAllTemperatures,
  getBoissons,
  getCommande,
  getIngredients,
  getSnacks,
  getViandes,
} from "@/config/api";

import {
  Boissons,
  Ingredients,
  NewCommandes,
  Snacks,
  Temperatures,
  Viandes,
} from "@/types";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

import {
  Card,
  CardBody,
  CardHeader,
  DatePicker,
  Select,
  SelectItem,
  Tab,
  Tabs,
} from "@nextui-org/react";

import {
  aggregateByTimeFrame,
  CollectionType,
  getChiffreAffaire,
  getCollectionTendance,
  getDatasetFromCollectionType,
  getDate,
  getTemperaturesByTimeFrame,
  TimeFrame,
  regrouperCommandes
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

  const [timeFrame, setTimeFrame] = useState<TimeFrame>(TimeFrame.Toujours);
  const [tempTimeFrame, setTempTimeFrame] = useState<TimeFrame>(
    TimeFrame.Toujours
  );
  const [data, setData] = useState<CollectionType>(CollectionType.Ingredients);

  const [ingredientsTendances, setIngredientsTendances] =
    useState<Map<string, Map<string, number>>>();
  const [boissonsTendances, setBoissonsTendances] =
    useState<Map<string, Map<string, number>>>();
  const [snacksTendances, setSnacksTendances] =
    useState<Map<string, Map<string, number>>>();
  const [viandesTendances, setViandesTendandes] =
    useState<Map<string, Map<string, number>>>();

  const [collectionType, setCollectionType] = useState<CollectionType>(
    CollectionType.Ingredients
  );


  const [dateDebutCommande, setDateDebutCommande] = useState<Date>(new Date('2023-01-01'));
  const [dateFinCommande, setDateFinCommande] = useState<Date>(new Date('2025-12-31'));


  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCommandes = await getCommande();
        setCommandes(fetchedCommandes);
        setIngredients(await getIngredients());
        setSnacks(await getSnacks());
        setBoissons(await getBoissons());
        setViandes(await getViandes());
        setTemperatures(await getAllTemperatures());

        // Calculer les tendances des ingrédients
        let tendanceData = await getCollectionTendance(
          fetchedCommandes,
          CollectionType.Ingredients
        );
        setIngredientsTendances(tendanceData);

        tendanceData = await getCollectionTendance(
          fetchedCommandes,
          CollectionType.Boissons
        );
        setBoissonsTendances(tendanceData);

        tendanceData = await getCollectionTendance(
          fetchedCommandes,
          CollectionType.Snacks
        );
        setSnacksTendances(tendanceData);

        tendanceData = await getCollectionTendance(
          fetchedCommandes,
          CollectionType.Viandes
        );
        setViandesTendandes(tendanceData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Aggregate commandes by time frame and sort labels
  const commandesByTimeFrame = aggregateByTimeFrame(commandes, timeFrame);
  const commandesData = {
    labels: Array.from(commandesByTimeFrame.keys()),
    datasets: [
      {
        label: `Commandes`,
        data: Array.from(commandesByTimeFrame.values()),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.3,
      },
    ],
  };

  // Aggregate temperatures by time frame
  const temperaturesByTimeFrame = getTemperaturesByTimeFrame(
    temperatures,
    tempTimeFrame
  );

  const chiffreAffaire = getChiffreAffaire(commandes);
  const chiffreAffaireData = {
    labels: Array.from(chiffreAffaire.keys()),
    datasets: [
      {
        label: "Chiffre d'affaire du jour",
        data: Array.from(chiffreAffaire.values()),
        fill: true,
        backgroundColor: "rgb(132, 255, 255)",
        borderColor: "rgba(132, 255, 255, 1)",
        tension: 0.3,
      },
    ],
  };

  const temperaturesData = {
    labels: Array.from(temperaturesByTimeFrame.keys()),
    datasets: [
      {
        label: "Frigo 1",
        // Data is all the temperatures of the frigo 1 (tmp1)
        data: Array.from(temperaturesByTimeFrame.values()).map(
          (temp) => temp.tmp1
        ),
        fill: false,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.3,
      },
      {
        label: "Frigo 2",
        data: Array.from(temperaturesByTimeFrame.values()).map(
          (temp) => temp.tmp2
        ),
        fill: false,
        backgroundColor: "rgb(55, 255, 132)",
        borderColor: "rgba(55, 255, 132, 1)",
        tension: 0.3,
      },
      {
        label: "Frigo 3",
        data: Array.from(temperaturesByTimeFrame.values()).map(
          (temp) => temp.tmp3
        ),
        fill: false,
        backgroundColor: "rgb(132, 255, 255)",
        borderColor: "rgba(132, 255, 255, 1)",
        tension: 0.3,
      },
    ],
  };

  // https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
  const stringToColour = (str: string) => {
    if (str === null || str === undefined) return "#FFFFFF";

    let hash = 0;
    str.split("").forEach((char) => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let colour = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += value.toString(16).padStart(2, "0");
    }
    return colour;
  };

  function formatTendanceData(tendance: Map<string, Map<string, number>>) {
    if (!tendance) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = Array.from(tendance.keys());

    const allKeys = new Set();
    tendance.forEach((value) => {
      value.forEach((_, key) => {
        allKeys.add(key);
      });
    });

    const tendanceData = {
      labels,
      datasets: [],
    };

    allKeys.forEach((key: string) => {
      const data = labels.map((date) => {
        const dayData = tendance.get(date);
        return dayData?.get(key) || 0;
      });

      tendanceData.datasets.push({
        label: key,
        data,
        fill: false,
        backgroundColor: stringToColour(key),
        borderColor: stringToColour(key),
        tension: 0.3,
      });
    });

    return tendanceData;
  }

  const tendancesData = new Map<CollectionType, Object>();
  tendancesData.set(
    CollectionType.Ingredients,
    formatTendanceData(ingredientsTendances)
  );
  tendancesData.set(
    CollectionType.Boissons,
    formatTendanceData(boissonsTendances)
  );
  tendancesData.set(CollectionType.Snacks, formatTendanceData(snacksTendances));
  tendancesData.set(
    CollectionType.Viandes,
    formatTendanceData(viandesTendances)
  );

  // -- Nouveau graphique pour les commandes et le bénéfice total par type de paiement --
  const paiementData = regrouperCommandes(commandes, dateDebutCommande, dateFinCommande);
  
  const labelsPaiement = ['Paiement Compte MI', 'Paiement CB', 'Paiement Espèces'];
  const dataPaiement = {
    labels: labelsPaiement,
    datasets: [
      {
        label: 'Nombre de Commandes',
        data: [
          paiementData[0].count,
          paiementData[1].count,
          paiementData[2].count,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Bénéfice Total',
        data: [
          paiementData[0].totalBenefit,
          paiementData[1].totalBenefit,
          paiementData[2].totalBenefit,
        ],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      }
    ]
  };

  return (
    <>
      <div className="grid grid-cols-6 gap-4">
        <Card className="col-span-6 p-2">
          <CardHeader className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">
            Commandes
          </CardHeader>
          <CardBody>
            <Select
              value={String(timeFrame)}
              onChange={(e) => setTimeFrame(Number(e.target.value))}
              placeholder="Choisir une période"
            >
              {Object.values(TimeFrame)
                .filter((value) => typeof value === "number")
                .map((value, index) => (
                  <SelectItem key={index} value={String(value)}>
                    {TimeFrame[value]}
                  </SelectItem>
                ))}
            </Select>
            <Line data={commandesData} />
          </CardBody>
        </Card>

        <Card className="col-span-4 p-2">
          <CardHeader className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">
            Températures frigo
          </CardHeader>
          <CardBody>
            <Select
              value={String(tempTimeFrame)}
              onChange={(e) => setTempTimeFrame(Number(e.target.value))}
              placeholder="Choisir une période"
            >
              {Object.values(TimeFrame)
                .filter((value) => typeof value === "number")
                .map((value, index) => (
                  <SelectItem key={index} value={String(value)}>
                    {TimeFrame[value]}
                  </SelectItem>
                ))}
            </Select>
            <Line data={temperaturesData}></Line>
          </CardBody>
        </Card>

        <Card className="col-span-2 row-span-1 p-2 max-md:max-h-[300px]">
          <CardHeader className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">
            Dernières Commandes
          </CardHeader>
          <CardBody>
            <ul>
              {commandes
                .slice(commandes.length - 15, commandes.length)
                .reverse()
                .map((commande, index) => (
                  <li key={index}>{getDate(commande).toLocaleString()}</li>
                ))}
            </ul>
          </CardBody>
        </Card>

        <Card className="col-span-3 row-span-1 p-2 max-md:max-h-[300px]">
          <CardHeader className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">
            Chiffre d'affaire
          </CardHeader>
          <CardBody>
            <Line data={chiffreAffaireData}></Line>
          </CardBody>
        </Card>

        <Card className="col-span-3 p-2">
          <CardHeader className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">
            Stocks
          </CardHeader>
          <Tabs aria-label="Options">
            <Tab aria-label="Quantité" key="quantite" title="Quantité">
              <CardBody>
                <Select
                  value={String(data)}
                  onChange={(e) => setData(Number(e.target.value))}
                  placeholder="Choisir un type de collection"
                >
                  {Object.values(CollectionType)
                    .filter((value) => typeof value === "number")
                    .map((value, index) => (
                      <SelectItem key={index} value={String(value)}>
                        {CollectionType[value]}
                      </SelectItem>
                    ))}
                </Select>
                <Bar
                  data={getDatasetFromCollectionType(
                    data,
                    ingredients,
                    snacks,
                    boissons,
                    viandes
                  )}
                />
              </CardBody>
            </Tab>
            <Tab aria-label="Tendances" key="tendances" title="Tendances">
              <CardBody>
                <Select
                  value={String(collectionType)}
                  onChange={(e) => setCollectionType(Number(e.target.value))}
                  placeholder="Choisir un type de collection"
                >
                  {Object.values(CollectionType)
                    .filter((value) => typeof value === "number")
                    .map((value, index) => (
                      <SelectItem key={index} value={String(value)}>
                        {CollectionType[value]}
                      </SelectItem>
                    ))}
                </Select>
                <Line data={tendancesData.get(collectionType)} />
              </CardBody>
            </Tab>
          </Tabs>
        </Card>
        <Card className="col-span-6 p-2">
          <div className="flex  flex-row justify-center items-center gap-10">
          <DatePicker 
            label="Date de début"
            granularity="day"
            onChange={(e) => setDateDebutCommande( new Date(`${e.year}-${e.month}-${e.day}`) )}
          />
          <DatePicker 
            label="Date de fin"
            granularity="day"
            onChange={(e) => setDateFinCommande( new Date(`${e.year}-${e.month}-${e.day}`) )}
          />
          </div>
          <Bar data={dataPaiement} />
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
