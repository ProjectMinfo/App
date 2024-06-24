---

# Page Affichage Cuisine

## Description

La page `AffichageCuisine` permet de visualiser les commandes en cours dans la cuisine, en les catégorisant par type de produit. Les utilisateurs peuvent voir les commandes de Sandwichs et Hot-Dogs d'un côté, et les commandes de Paninis et Croque-Monsieur de l'autre. L'interface est conçue pour être claire et facile à lire, avec une option de plein écran pour une meilleure visibilité.

## Fonctionnalités Principales

- **Affichage des commandes par catégorie** : Les commandes sont filtrées et affichées selon qu'elles contiennent des Sandwichs, Hot-Dogs, Paninis ou Croque-Monsieur.
- **Mise à jour en temps réel** : L'heure actuelle est mise à jour chaque seconde pour fournir un contexte temporel aux commandes.
- **Mode plein écran** : Les utilisateurs peuvent basculer en mode plein écran pour une meilleure visibilité des commandes.

## Technologies Utilisées

- **Frontend** : Next.js avec TypeScript
- **UI Library** : NextUI

## Structure du Composant

### AffichageCuisine.tsx

```typescript
'use client';
import React, { useState, useEffect } from "react";
import { getCommande, getComptes } from "@/config/api"; 
import { NewCommandes, Comptes } from "@/types"; 

type ColoredCommande = NewCommandes & { color: string } & { nom: string };

const CommandesCuisine = () => {
  const [commandes, setCommandes] = useState<ColoredCommande[]>([]);
  const [clients, setClients] = useState<Comptes[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const fetchCommandes = await getCommande();
        const comptes = await getComptes();

        const resultCommandes: ColoredCommande[] = fetchCommandes
          .filter((commande: ColoredCommande) => commande.payee && commande.contenu)
          .map((commande: ColoredCommande) => ({
            ...commande,
            color: generateRandomColor(),
            nom: comptes.find((client: { numCompte: number; }) => client.numCompte === commande.numCompte)?.nom || "Inconnu",
          }));

        setCommandes(resultCommandes);
        setClients(comptes);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes ou des comptes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();

    // Mettre à jour l'heure chaque seconde
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8333',
    '#33FFF5', '#F5FF33', '#8D33FF', '#33FF8D', '#FF3385',
    '#FF5733CC', '#33FF57CC', '#3357FFCC', '#FF33A1CC', '#FF8333CC',
    '#33FFF5CC', '#F5FF33CC', '#8D33FFCC', '#33FF8DCC', '#FF3385CC'
  ];

  let colorIndex = 0;

  const generateRandomColor = () => {
    const color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
    return color + '80'; // Ajouter une transparence de 50%
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className={`flex flex-col h-screen overflow-hidden max-w-full ${isFullscreen ? "fixed top-0 left-0 w-full h-full bg-white z-50" : ""}`}>
      <header className="w-full bg-gray-800  p-2 text-center fixed top-0">
        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 bg-blue-500  rounded hover:bg-blue-600"
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              toggleFullscreen();
            }}
          >
            {isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          </button>
          <div className="text-xl">{currentTime.toLocaleTimeString()}</div>
        </div>
      </header>
      <div className="flex flex-1 p-4 pt-16 overflow-hidden max-w-full">
        <div className="w-1/2 p-2 border-r border-gray-300 overflow-hidden">
          <h2 className="text-2xl text-blue-800 font-bold mb-4">Sandwichs et Hot-Dogs</h2>
          <div className="grid grid-cols-1 gap-2">
            {commandes.filter(commande => commande.contenu.includes('Sandwich') || commande.contenu.includes('Hot-Dog')).slice(0, 10).map((commande, index) => {
              const produitsFroids = commande.contenu.split('//').filter(part => part.includes('Sandwich') || part.includes('Hot-Dog'));
              return produitsFroids.map((produit, idx) => (
                <div key={`${index}-${idx}`} className="p-2 rounded shadow-lg bg-white bg-opacity-80 text-black" style={{ backgroundColor: commande.color, height: '80px', width: '95%' }}>
                  <h3 className="text-md font-semibold truncate">{commande.nom}</h3>
                  <p className="text-sm mt-1 truncate">{produit}</p>
                  <p className="text-xs text-black mt-1 truncate">{commande.commentaire}</p>
                </div>
              ));
            })}
          </div>
        </div>
        <div className="w-1/2 p-2 overflow-hidden">
          <h2 className="text-2xl text-red-800 font-bold mb-4">Paninis et Croque-Monsieur</h2>
          <div className="grid grid-cols-1 gap-2">
            {commandes.filter(commande => commande.contenu.includes('Panini') || commande.contenu.includes('Croque-Monsieur')).slice(0, 10).map((commande, index) => {
              const produitsChauds = commande.contenu.split('//').filter(part => part.includes('Panini') || part.includes('Croque-Monsieur'));
              return produitsChauds.map((produit, idx) => (
                <div key={`${index}-${idx}`} className="p-2 rounded shadow-lg bg-white bg-opacity-80 text-black" style={{ backgroundColor: commande.color, height: '80px', width: '95%' }}>
                  <h3 className="text-md font-semibold truncate">{commande.nom}</h3>
                  <p className="text-sm mt-1 truncate">{produit}</p>
                  <p className="text-xs text-black mt-1 truncate">{commande.commentaire}</p>
                </div>
              ));
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandesCuisine;
```

## Composants Enfants

### ColoredCommande

- **ColoredCommande** : Étend l'interface `NewCommandes` pour ajouter un champ `color` et `nom`.

### API Calls

Les appels API sont gérés via `axios` pour communiquer avec le backend. Les fonctions principales incluent :

#### getCommande

```typescript
export const getCommande = async () => {
  try {
    const response = await api.get(`/commandes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commandes:', error);
    throw error;
  }
};
```

#### getComptes

```typescript
export const getComptes = async () => {
  try {
    const response = await api.get('/users')
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
```

### Types
Bien sûr! Voici une version plus détaillée du README, expliquant chaque fonction de la page `AffichageCuisine` :

---

# AffichageCuisine Page

## Description

La page `AffichageCuisine` permet de visualiser les commandes en cours dans la cuisine, en les catégorisant par type de produit. Les utilisateurs peuvent voir les commandes de Sandwichs et Hot-Dogs d'un côté, et les commandes de Paninis et Croque-Monsieur de l'autre. L'interface est conçue pour être claire et facile à lire, avec une option de plein écran pour une meilleure visibilité.

## Fonctionnalités Principales

- **Affichage des commandes par catégorie** : Les commandes sont filtrées et affichées selon qu'elles contiennent des Sandwichs, Hot-Dogs, Paninis ou Croque-Monsieur.
- **Mise à jour en temps réel** : L'heure actuelle est mise à jour chaque seconde pour fournir un contexte temporel aux commandes.
- **Mode plein écran** : Les utilisateurs peuvent basculer en mode plein écran pour une meilleure visibilité des commandes.

## Technologies Utilisées

- **Frontend** : Next.js avec TypeScript
- **UI Library** : NextUI

## Structure du Composant

### AffichageCuisine.tsx

```typescript
'use client';
import React, { useState, useEffect } from "react";
import { getCommande, getComptes } from "@/config/api"; 
import { NewCommandes, Comptes } from "@/types"; 

type ColoredCommande = NewCommandes & { color: string } & { nom: string };

const CommandesCuisine = () => {
  const [commandes, setCommandes] = useState<ColoredCommande[]>([]);
  const [clients, setClients] = useState<Comptes[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const fetchCommandes = await getCommande();
        const comptes = await getComptes();

        const resultCommandes: ColoredCommande[] = fetchCommandes
          .filter((commande: ColoredCommande) => commande.payee && commande.contenu)
          .map((commande: ColoredCommande) => ({
            ...commande,
            color: generateRandomColor(),
            nom: comptes.find((client: { numCompte: number; }) => client.numCompte === commande.numCompte)?.nom || "Inconnu",
          }));

        setCommandes(resultCommandes);
        setClients(comptes);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes ou des comptes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();

    // Mettre à jour l'heure chaque seconde
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8333',
    '#33FFF5', '#F5FF33', '#8D33FF', '#33FF8D', '#FF3385',
    '#FF5733CC', '#33FF57CC', '#3357FFCC', '#FF33A1CC', '#FF8333CC',
    '#33FFF5CC', '#F5FF33CC', '#8D33FFCC', '#33FF8DCC', '#FF3385CC'
  ];

  let colorIndex = 0;

  const generateRandomColor = () => {
    const color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
    return color + '80'; // Ajouter une transparence de 50%
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className={`flex flex-col h-screen overflow-hidden max-w-full ${isFullscreen ? "fixed top-0 left-0 w-full h-full bg-white z-50" : ""}`}>
      <header className="w-full bg-gray-800  p-2 text-center fixed top-0">
        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 bg-blue-500  rounded hover:bg-blue-600"
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              toggleFullscreen();
            }}
          >
            {isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          </button>
          <div className="text-xl">{currentTime.toLocaleTimeString()}</div>
        </div>
      </header>
      <div className="flex flex-1 p-4 pt-16 overflow-hidden max-w-full">
        <div className="w-1/2 p-2 border-r border-gray-300 overflow-hidden">
          <h2 className="text-2xl text-blue-800 font-bold mb-4">Sandwichs et Hot-Dogs</h2>
          <div className="grid grid-cols-1 gap-2">
            {commandes.filter(commande => commande.contenu.includes('Sandwich') || commande.contenu.includes('Hot-Dog')).slice(0, 10).map((commande, index) => {
              const produitsFroids = commande.contenu.split('//').filter(part => part.includes('Sandwich') || part.includes('Hot-Dog'));
              return produitsFroids.map((produit, idx) => (
                <div key={`${index}-${idx}`} className="p-2 rounded shadow-lg bg-white bg-opacity-80 text-black" style={{ backgroundColor: commande.color, height: '80px', width: '95%' }}>
                  <h3 className="text-md font-semibold truncate">{commande.nom}</h3>
                  <p className="text-sm mt-1 truncate">{produit}</p>
                  <p className="text-xs text-black mt-1 truncate">{commande.commentaire}</p>
                </div>
              ));
            })}
          </div>
        </div>
        <div className="w-1/2 p-2 overflow-hidden">
          <h2 className="text-2xl text-red-800 font-bold mb-4">Paninis et Croque-Monsieur</h2>
          <div className="grid grid-cols-1 gap-2">
            {commandes.filter(commande => commande.contenu.includes('Panini') || commande.contenu.includes('Croque-Monsieur')).slice(0, 10).map((commande, index) => {
              const produitsChauds = commande.contenu.split('//').filter(part => part.includes('Panini') || part.includes('Croque-Monsieur'));
              return produitsChauds.map((produit, idx) => (
                <div key={`${index}-${idx}`} className="p-2 rounded shadow-lg bg-white bg-opacity-80 text-black" style={{ backgroundColor: commande.color, height: '80px', width: '95%' }}>
                  <h3 className="text-md font-semibold truncate">{commande.nom}</h3>
                  <p className="text-sm mt-1 truncate">{produit}</p>
                  <p className="text-xs text-black mt-1 truncate">{commande.commentaire}</p>
                </div>
              ));
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandesCuisine;
```

## Explication du Code

### Importations

```typescript
import React, { useState, useEffect } from "react";
import { getCommande, getComptes } from "@/config/api";
import { NewCommandes, Comptes } from "@/types";
```

Ces importations incluent les hooks `useState` et `useEffect` de React, les fonctions API pour récupérer les commandes et les comptes, et les types `NewCommandes` et `Comptes`.

### Déclarations des États

```typescript
const [commandes, setCommandes] = useState<ColoredCommande[]>([]);
const [clients, setClients] = useState<Comptes[]>([]);
const [loading, setLoading] = useState(true);
const [currentTime, setCurrentTime] = useState(new Date());
const [isFullscreen, setIsFullscreen] = useState(false);
```

Ces déclarations utilisent le hook `useState` pour gérer les états des commandes, des clients, de l'état de chargement, de l'heure actuelle et du mode plein écran.

### useEffect

```typescript
useEffect(() => {
  const fetchCommandes = async () => {
    try {
      const fetchCommandes = await getCommande();
      const comptes = await getComptes();

      const resultCommandes: ColoredCommande[] = fetchCommandes
        .filter((commande: ColoredCommande) => commande.payee && commande.contenu)
        .map((commande: ColoredCommande) => ({
          ...commande,
          color: generateRandomColor(),


          nom: comptes.find((client: { numCompte: number; }) => client.numCompte === commande.numCompte)?.nom || "Inconnu",
        }));

      setCommandes(resultCommandes);
      setClients(comptes);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes ou des comptes :", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCommandes();

  // Mettre à jour l'heure chaque seconde
  const interval = setInterval(() => {
    setCurrentTime(new Date());
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

L'effet est utilisé pour récupérer les commandes et les comptes au chargement initial du composant et pour mettre à jour l'heure actuelle chaque seconde.

### Génération de Couleur Aléatoire

```typescript
const colors = [
  '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8333',
  '#33FFF5', '#F5FF33', '#8D33FF', '#33FF8D', '#FF3385',
  '#FF5733CC', '#33FF57CC', '#3357FFCC', '#FF33A1CC', '#FF8333CC',
  '#33FFF5CC', '#F5FF33CC', '#8D33FFCC', '#33FF8DCC', '#FF3385CC'
];

let colorIndex = 0;

const generateRandomColor = () => {
  const color = colors[colorIndex];
  colorIndex = (colorIndex + 1) % colors.length;
  return color + '80';
};
```

Ces fonctions et variables génèrent des couleurs aléatoires à appliquer aux commandes pour une meilleure visualisation.

### Mode Plein Écran

```typescript
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};
```

Cette fonction permet de basculer en mode plein écran et de quitter ce mode.

### Rendu du Composant

```typescript
if (loading) {
  return <div>Chargement...</div>;
}
```

Cette condition affiche un message de chargement jusqu'à ce que les données soient récupérées.

### Header

```typescript
<header className="w-full bg-gray-800  p-2 text-center fixed top-0">
  <div className="flex justify-between items-center">
    <button
      className="px-4 py-2 bg-blue-500  rounded hover:bg-blue-600"
      onClick={() => {
        setIsFullscreen(!isFullscreen);
        toggleFullscreen();
      }}
    >
      {isFullscreen ? "Quitter le plein écran" : "Plein écran"}
    </button>
    <div className="text-xl">{currentTime.toLocaleTimeString()}</div>
  </div>
</header>
```

Le header contient un bouton pour basculer en mode plein écran et affiche l'heure actuelle.

### Affichage des Commandes

```typescript
<div className="flex flex-1 p-4 pt-16 overflow-hidden max-w-full">
  <div className="w-1/2 p-2 border-r border-gray-300 overflow-hidden">
    <h2 className="text-2xl text-blue-800 font-bold mb-4">Sandwichs et Hot-Dogs</h2>
    <div className="grid grid-cols-1 gap-2">
      {commandes.filter(commande => commande.contenu.includes('Sandwich') || commande.contenu.includes('Hot-Dog')).slice(0, 10).map((commande, index) => {
        const produitsFroids = commande.contenu.split('//').filter(part => part.includes('Sandwich') || part.includes('Hot-Dog'));
        return produitsFroids.map((produit, idx) => (
          <div key={`${index}-${idx}`} className="p-2 rounded shadow-lg bg-white bg-opacity-80 text-black" style={{ backgroundColor: commande.color, height: '80px', width: '95%' }}>
            <h3 className="text-md font-semibold truncate">{commande.nom}</h3>
            <p className="text-sm mt-1 truncate">{produit}</p>
            <p className="text-xs text-black mt-1 truncate">{commande.commentaire}</p>
          </div>
        ));
      })}
    </div>
  </div>
  <div className="w-1/2 p-2 overflow-hidden">
    <h2 className="text-2xl text-red-800 font-bold mb-4">Paninis et Croque-Monsieur</h2>
    <div className="grid grid-cols-1 gap-2">
      {commandes.filter(commande => commande.contenu.includes('Panini') || commande.contenu.includes('Croque-Monsieur')).slice(0, 10).map((commande, index) => {
        const produitsChauds = commande.contenu.split('//').filter(part => part.includes('Panini') || part.includes('Croque-Monsieur'));
        return produitsChauds.map((produit, idx) => (
          <div key={`${index}-${idx}`} className="p-2 rounded shadow-lg bg-white bg-opacity-80 text-black" style={{ backgroundColor: commande.color, height: '80px', width: '95%' }}>
            <h3 className="text-md font-semibold truncate">{commande.nom}</h3>
            <p className="text-sm mt-1 truncate">{produit}</p>
            <p className="text-xs text-black mt-1 truncate">{commande.commentaire}</p>
          </div>
        ));
      })}
    </div>
  </div>
</div>
```

Cette section affiche les commandes en deux catégories : "Sandwichs et Hot-Dogs" et "Paninis et Croque-Monsieur", en utilisant des couleurs pour différencier les commandes.

## API Utilisées

### getCommande

Cette fonction récupère toutes les commandes depuis l'API.

```typescript

export const getCommande = async () => {
  try {
    const response = await api.get(`/commandes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commandes:', error);
    throw error;
  }
};
```




### getComptes

Cette fonction récupère tous les comptes clients depuis l'API.

```typescript

export const getComptes = async () => {

  try {
    const response = await api.get('/users')
    return (response.data);

  }
  catch (error) {
    console.error('Error fetching users', error);
    throw error;
  }
}
```

## Types

### NewCommandes

Ce type représente une commande avec ses propriétés.

```typescript
export interface NewCommandes {
  id: number;
  contenu: string;
  numCompte: number;
  date: {
    $date: string;
  };
  distribuee: boolean;
  prix: number;
  typePaiement: number;
  commentaire: string;
  ingredients: [number, number];
  viandes: [number, number];
  boissons: [number, number];
  snacks: [number, number];
  payee: boolean;
}
```

### Comptes



Ce type représente un compte client avec ses propriétés.


```typescript
export interface Comptes {
  acces: number;
  email: string;
  mdp: string;
  montant: number;
  nom: string;
  numCompte: number;
  prenom: string;
  promo: number;
  resetToken: string;
  tokenExpiration: string;
}
```

