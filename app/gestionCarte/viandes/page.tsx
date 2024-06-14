'use client';
import ModifyCard from "@/components/modifyCard";
import { getViandes } from "@/config/api";
import { useEffect, useState } from "react";

import { Viandes } from '@/types/index';

export default function GestionViandes() {

  const [viandes, setViandes] = useState([] as Viandes[]);
  const [search, setSearch] = useState(""); // État pour la recherche

  useEffect(() => {
    async function fetchViandes() {
      const fetchedViandes = await getViandes();
      setViandes(fetchedViandes);
    }
    fetchViandes();
  }, []);

  // Filtrer les viandes en fonction de la recherche
  const filteredViandes = viandes.filter((viande) =>
    viande.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Champ de saisie pour la recherche */}
      <input
        type="text"
        placeholder="Rechercher une viande"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      <div className="grid grid-cols-1 gap-4 mt-12 md:grid-cols-2">
        {filteredViandes.map((item: Viandes) => (
          <ModifyCard key={item.id} item={item} type="viande"/>
        ))}
      </div>
    </div>
  );
}
