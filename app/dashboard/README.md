### README pour la Page Trésorerie

#### Vue d'ensemble
La page Trésorerie est une interface de tableau de bord conçue pour les administrateurs. Elle permet de visualiser et d'analyser les commandes, les températures des frigos, le chiffre d'affaires et les tendances des stocks. La page utilise divers graphiques pour représenter les données de manière claire et intuitive.

#### Fonctionnalités Principales
1. **Visualisation des commandes par période**
2. **Suivi des températures des frigos**
3. **Affichage du chiffre d'affaires**
4. **Gestion et analyse des stocks**
5. **Visualisation des tendances des achats**

#### Technologies Utilisées
- React
- NextUI
- Chart.js
- API Intégrée

#### Explication détaillée des Fonctions Principales

##### 1. **Visualisation des commandes par période**
La page affiche les commandes agrégées par différentes périodes (jour, semaine, mois, année, toujours). Un graphique linéaire est utilisé pour représenter ces données.

```jsx
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
```

##### 2. **Suivi des températures des frigos**
Les températures des frigos sont suivies et affichées en fonction de différentes périodes. Les données sont agrégées et affichées dans un graphique linéaire.

```jsx
const temperaturesByTimeFrame = getTemperaturesByTimeFrame(temperatures, tempTimeFrame);
const temperaturesData = {
  labels: Array.from(sortedTemps.keys()),
  datasets: [
    {
      label: "Frigo 1",
      data: Array.from(sortedTemps.values()).map((temp) => temp.tmp1),
      fill: false,
      backgroundColor: "rgb(255, 99, 132)",
      borderColor: "rgba(255, 99, 132, 1)",
      tension: 0.3,
    },
    {
      label: "Frigo 2",
      data: Array.from(sortedTemps.values()).map((temp) => temp.tmp2),
      fill: false,
      backgroundColor: "rgb(55, 255, 132)",
      borderColor: "rgba(55, 255, 132, 1)",
      tension: 0.3,
    },
    {
      label: "Frigo 3",
      data: Array.from(sortedTemps.values()).map((temp) => temp.tmp3),
      fill: false,
      backgroundColor: "rgb(132, 255, 255)",
      borderColor: "rgba(132, 255, 255, 1)",
      tension: 0.3,
    },
  ],
};
```

##### 3. **Affichage du chiffre d'affaires**
Le chiffre d'affaires est calculé et affiché pour chaque jour. Un graphique linéaire montre l'évolution du chiffre d'affaires au fil du temps.

```jsx
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
```

##### 4. **Gestion et analyse des stocks**
La page permet de visualiser les stocks par type de collection (ingrédients, snacks, boissons, viandes). Un graphique à barres affiche les quantités en stock.

```jsx
const getDatasetFromCollectionType = (
  collectionType: CollectionType,
  ingredients: Ingredients[],
  snacks: Snacks[],
  boissons: Boissons[],
  viandes: Viandes[]
): Object => {
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
```

##### 5. **Visualisation des tendances des achats**
La page affiche les tendances des achats pour chaque type de collection. Les tendances sont agrégées et affichées dans un graphique linéaire.

```jsx
function formatTendanceData(tendance: Map<string, Map<string, number>>) {
  const tendanceData = {
    labels: Array.from(tendance?.keys() || []),
    datasets: [],
  };

  tendance?.forEach((value1, key1) => {
    value1.forEach((value, key) => {
      if (tendanceData.datasets.find((dataset) => dataset.label === key)) {
        tendanceData.datasets
            .find((dataset) => dataset.label === key)
            .data.push(value);
      } else {
        tendanceData.datasets.push({
          label: key,
          data: [value],
          fill: false,
          backgroundColor: stringToColour(key),
          borderColor: stringToColour(key),
          tension: 0.3,
        });
      }
    });
  });
  return tendanceData;
}
```

#### Utilisation
Ce composant est conçu pour être utilisé dans un tableau de bord administratif, accessible uniquement aux utilisateurs autorisés. Il permet de surveiller et d'analyser les performances des commandes, les températures des équipements de stockage, le chiffre d'affaires et les stocks.
