'use client';
import Ingredients from './ingredients/page';
import Viandes from '@/app/gestionStock/viandes/page';
import Snack from './snacks/page';
import Boisson from './boissons/page';
import Link from 'next/link';
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { useState } from "react";

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
        return <Ingredients onValidate={handleValidate} />;
      case "Viandes":
        return <Viandes onValidate={handleValidate} />;
      case "Snack":
        return <Snack onValidate={handleValidate} />;
      case "Boisson":
        return <Boisson onValidate={handleValidate} />;
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
