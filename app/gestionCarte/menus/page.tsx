'use client';
import ModifyCard from "@/components/modifyCard";
import { getMenus } from "@/config/api";
import { useEffect, useState } from "react";

import { Menus } from '@/types/index';


export default function GestionMenus() {

  const [menus, setMenus] = useState([] as Menus[]);

  useEffect(() => {
    async function fetchMenus() {
      const fetchedMenus = await getMenus();
      setMenus(fetchedMenus);
    }
    fetchMenus();
  }, []);

  

  return (
    <div className="flex flex-col gap-4">
      
      {menus?.map((item: any) => (
        <ModifyCard key={item.id} item={item}
        />
      ))}

  </div>
  );
}

