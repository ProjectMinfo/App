'use client';
import ModifyCard from "@/components/modifyCard";
import { getPlats } from "@/config/api";
import { useEffect, useState } from "react";

import { Plats } from '@/types/index';


export default function GestionPlats() {

  const [plats, setPlats] = useState([] as Plats[]);

  useEffect(() => {
    async function fetchPlats() {
      const fetchedPlats = await getPlats();
      setPlats(fetchedPlats);
    }
    fetchPlats();
  }, [plats]);

  

  return (
    <div className="grid grid-cols-1 gap-4 mt-12 md:grid-cols-2">
      {plats?.map((item: any) => (
        <ModifyCard key={item.id} item={item} type="plat"
        />
      ))}

  </div>
  );
}

