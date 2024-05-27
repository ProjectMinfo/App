'use client';
import ModifyCard from "@/components/modifyCard";
import { getSnacks } from "@/config/api";
import { useEffect, useState } from "react";

import { Snacks } from '@/types/index';

export default function GestionSnacks() {

  const [snacks, setSnacks] = useState([] as Snacks[]);
  const [search, setSearch] = useState(""); // État pour la recherche

  useEffect(() => {
    async function fetchSnacks() {
      const fetchedSnacks = await getSnacks();
      setSnacks(fetchedSnacks);
    }
    fetchSnacks();
  }, []);

  // Filtrer les snacks en fonction de la recherche
  const filteredSnacks = snacks.filter((snack) =>
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

      <div className="grid grid-cols-4 gap-4">
        {filteredSnacks.map((item: Snacks) => (
          <ModifyCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
