'use client';
import ModifyCard from "@/components/modifyCard";
import { getBoissons } from "@/config/api";
import { useEffect, useState } from "react";

import { Boissons } from '@/types/index';

export default function GestionBoissons() {

  const [boissons, setBoissons] = useState([] as Boissons[]);
  const [search, setSearch] = useState(""); // État pour la recherche

  useEffect(() => {
    async function fetchBoissons() {
      const fetchedBoissons = await getBoissons();
      setBoissons(fetchedBoissons);
    }
    fetchBoissons();
  }, []);

  // Filtrer les boissons en fonction de la recherche
  const filteredBoissons = boissons.filter((boisson) =>
    boisson.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher une boisson"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      <div className="grid grid-cols-4 gap-x-4">
        {filteredBoissons.map((item: Boissons) => (
          <ModifyCard key={item.id} item={item} type="boisson"/>
        ))}
      </div>
    </div>
  );
}
