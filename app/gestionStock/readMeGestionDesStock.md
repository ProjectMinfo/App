# GestionStock Page

## Description

La page GestionStock est une partie essentielle de notre application, permettant aux utilisateurs de gérer les stocks d'ingrédients, de viandes, de snacks et de boissons. Elle offre une interface utilisateur pour ajouter, modifier et supprimer des articles dans chaque catégorie de stock. Les modifications peuvent être validées et enregistrées dans la base de données.

## Fonctionnalités Principales

- **Affichage des catégories de stock** : Les utilisateurs peuvent sélectionner parmi les catégories suivantes : Ingrédients, Viandes, Snacks et Boissons.
- **Ajout d'articles** : Les utilisateurs peuvent ajouter de nouveaux articles à chaque catégorie.
- **Modification des quantités** : Les utilisateurs peuvent modifier les quantités des articles existants.
- **Suppression d'articles** : Les utilisateurs peuvent supprimer des articles du stock.
- **Validation des modifications** : Les modifications peuvent être validées et enregistrées dans la base de données.

## Technologies Utilisées

- **Frontend** : Next.js avec TypeScript
- **Backend** : Rust
- **UI Library** : NextUI

## Structure du Composant

### GestionStock.tsx

```typescript
'use client';
import React, { useState } from "react";
import Ingredients from './ingredients/page';
import Viandes from '@/app/gestionStock/viandes/page';
import Snack from './snacks/page';
import Boisson from './boissons/page';
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";

const GestionStock = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [data, setData] = useState({
    ingredients: [],
    meats: [],
    snacks: [],
    beverages: []
  });

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleValidate = (updatedData: any) => {
    setData((prevData) => ({
      ...prevData,
      [selectedCategory!.toLowerCase()]: updatedData
    }));
    setSelectedCategory(null);
  };

  const renderCategoryPage = () => {
    switch (selectedCategory) {
      case "Ingrédients":
        return <Ingredients />;
      case "Viandes":
        return <Viandes />;
      case "Snack":
        return <Snack />;
      case "Boisson":
        return <Boisson />;
      default:
        return null;
    }
  };

  if (selectedCategory) {
    return (
      <div>
        <h1 className={title()}>Gestion des stocks - {selectedCategory}</h1>
        {renderCategoryPage()}
      </div>
    );
  }

  return (
    <div>
      <h1 className={title()}>Gestion des stocks</h1>
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <div className="grid grid-cols-2 gap-4">
            {["Ingrédients", "Viandes", "Snack", "Boisson"].map((category) => (
              <Button key={category} onClick={() => handleCategoryClick(category)}>
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionStock;
```

### Composants Enfants

#### Ingredients.tsx

- Permet de gérer les ingrédients.
- Affiche une liste des ingrédients disponibles.
- Permet d'ajouter, modifier et supprimer des ingrédients.

#### Viandes.tsx

- Permet de gérer les viandes.
- Affiche une liste des viandes disponibles.
- Permet d'ajouter, modifier et supprimer des viandes.

#### Snacks.tsx

- Permet de gérer les snacks.
- Affiche une liste des snacks disponibles.
- Permet d'ajouter, modifier et supprimer des snacks.

#### Boissons.tsx

- Permet de gérer les boissons.
- Affiche une liste des boissons disponibles.
- Permet d'ajouter, modifier et supprimer des boissons.

### API Calls

Les appels API sont gérés via `axios` pour communiquer avec le backend Rust. Les fonctions principales incluent :

- `getIngredients`, `postIngredients`, `deleteIngredients`
- `getViandes`, `postViandes`, `deleteViandes`
- `getSnacks`, `postSnacks`, `deleteSnacks`
- `getBoissons`, `postBoissons`, `deleteBoissons`

Exemple d'appel API pour obtenir les ingrédients :

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://minfoapi.fly.dev',
});

const token = 'DEV_TOKEN';

api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getIngredients = async () => {
  try {
    const response = await api.get('/ingredients');
    return response.data;
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    throw error;
  }
};
```


