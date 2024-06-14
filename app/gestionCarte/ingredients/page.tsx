'use client';
import ModifyCard from "@/components/modifyCard";
import { getIngredients } from "@/config/api";
import { useEffect, useState } from "react";

import { Ingredients } from '@/types/index';

export default function GestionIngredients() {

  const [ingredients, setIngredients] = useState([] as Ingredients[]);
  const [search, setSearch] = useState(""); // État pour la recherche

  useEffect(() => {
    async function fetchIngredients() {
      const fetchedIngredients = await getIngredients();
      setIngredients(fetchedIngredients);
    }
    fetchIngredients();
  }, []);

  // Filtrer les ingredients en fonction de la recherche
  const filteredIngredients = ingredients.filter((snack) =>
    snack.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Champ de saisie pour la recherche */}
      <input
        type="text"
        placeholder="Rechercher un snack"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      <div className="grid grid-cols-1 gap-4 mt-12 md:grid-cols-2">
        {filteredIngredients.map((item: Ingredients) => (
          <ModifyCard key={item.id} item={item} type="ingredient"/>
        ))}
      </div>
    </div>
  );
}
