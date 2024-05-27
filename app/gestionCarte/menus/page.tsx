'use client';
import ModifyCard from "@/components/modifyCard";
import { getMenus } from "@/config/api";
import { useEffect, useState } from "react";

type Menu = {
  commentaire: string;
  dispo: boolean;
  id: number;
  nom: string;
  prix: number;
  prixServeur: number;
  quantiteBoisson: number;
  quantitePlat: number;
  quantiteSnack: number;
};


export default function GestionMenus() {

  const [menus, setMenus] = useState([] as Menu[]);

  useEffect(() => {
    async function fetchMenus() {
      const fetchedMenus = await getMenus();
      setMenus(fetchedMenus);
    }
    fetchMenus();
  }, []);

  

  return (
    <div className="grid grid-cols-2 gap-4">

      {menus?.map((menu: any) => (
        <ModifyCard key={menu.id} menu={menu}
        />
      ))}

  </div>
  );
}

