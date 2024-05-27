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
  }, []);

  

  return (
    <div className="flex flex-col gap-4">
      
      {plats?.map((item: any) => (
        <ModifyCard key={item.id} item={item}
        />
      ))}

  </div>
  );
}

