'use client';
import ModifyCard from "@/components/modifyCard";
import { getBoissons } from "@/config/api";
import { useEffect, useState } from "react";

import { Boissons } from '@/types/index';


export default function GestionBoissons() {

  const [boissons, setBoissons] = useState([] as Boissons[]);

  useEffect(() => {
    async function fetchBoissons() {
      const fetchedBoissons = await getBoissons();
      setBoissons(fetchedBoissons);
    }
    fetchBoissons();
  }, []);

  

  return (
    <div className="flex flex-col gap-4">
      
      {boissons?.map((item: any) => (
        <ModifyCard key={item.id} item={item}
        />
      ))}

  </div>
  );
}

