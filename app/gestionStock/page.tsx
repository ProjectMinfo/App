'use client';  // Indique que ce composant doit être rendu côté client.
import Ingredients from './ingredients/page';  // Import du composant Ingredients.
import Viandes from '@/app/gestionStock/viandes/page';  // Import du composant Viandes.
import Snack from './snacks/page';  // Import du composant Snack.
import Boisson from './boissons/page';  // Import du composant Boisson.
import { title } from "@/components/primitives";  // Import d'un utilitaire de style pour les titres.
import { Button } from "@nextui-org/button";  // Import du composant Button de NextUI.
import { useState } from "react";  // Import du hook useState de React pour gérer l'état.

const GestionStock = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);  // État pour la catégorie sélectionnée.
  const [data, setData] = useState({
    ingredients: [],
    meats: [],
    snacks: [],
    beverages: []
  });  // État pour les données de chaque catégorie.

  // Gestion de la sélection de catégorie.
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // Gestion de la validation des données mises à jour.
  const handleValidate = (updatedData: any) => {
    setData((prevData) => ({
      ...prevData,
      [selectedCategory!.toLowerCase()]: updatedData
    }));
    setSelectedCategory(null);  // Réinitialise la catégorie sélectionnée après validation.
  };

  // Rend la page de la catégorie sélectionnée.
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

  // Si une catégorie est sélectionnée, affiche sa page.
  if (selectedCategory) {
    return (
      <div>
        <h1 className={title()}>Gestion des stocks - {selectedCategory}</h1>
        {renderCategoryPage()}
      </div>
    );
  }

  // Sinon, affiche le menu de sélection de catégorie.
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

export default GestionStock;  // Exporte le composant GestionStock par défaut.
