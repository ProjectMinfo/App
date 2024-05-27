'use client';
import ModifyCard from "@/components/modifyCard";
import { getSnacks } from "@/config/api";
import { useEffect, useState } from "react";

import { Snacks } from '@/types/index';


export default function GestionSnacks() {

  const [snacks, setSnacks] = useState([] as Snacks[]);

  useEffect(() => {
    async function fetchSnacks() {
      const fetchedSnacks = await getSnacks();
      setSnacks(fetchedSnacks);
    }
    fetchSnacks();
  }, []);

  

  return (
    <div className="flex flex-col gap-4">
      
      {snacks?.map((item: any) => (
        <ModifyCard key={item.id} item={item}
        />
      ))}

  </div>
  );
}

