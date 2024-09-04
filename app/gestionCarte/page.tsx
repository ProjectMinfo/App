'use client';
import React, { useState } from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { title } from "@/components/primitives";

import GestionMenus from "./menus";
import GestionPlats from "./plats";
import GestionSnacks from "./snacks";
import GestionBoissons from "./boissons";
import GestionIngredients from "./ingredients";
import GestionViandes from "./viandes";
import EditCarteModal from "@/components/EditCarteModal";
import { Boissons, Ingredients, Menus, Plats, Snacks, Viandes } from "@/types";
import { postMenus, postPlats, postBoissons, postSnacks, postIngredients, postViandes } from "@/config/api";

type MenuItem = Menus | Boissons | Plats | Snacks | Ingredients | Viandes;

export default function App() {
  const [selectedPage, setSelectedPage] = useState<React.ReactElement | null>(null);
  const [selectedPageName, setSelectedPageName] = useState<string | null>(null);
  const [modalData, setModalData] = useState<{ item: MenuItem; type: string } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const actions = [
    { nom: "Menus", page: <GestionMenus /> },
    { nom: "Plats", page: <GestionPlats /> },
    { nom: "Snacks", page: <GestionSnacks /> },
    { nom: "Boissons", page: <GestionBoissons /> },
    { nom: "Ingrédients", page: <GestionIngredients /> },
    { nom: "Viandes", page: <GestionViandes /> }
  ];

  function handleSave(updatedItem: MenuItem, type: string) {
    if (type === 'menu') {
      postMenus(updatedItem);
    } else if (type === 'plat') {
      postPlats(updatedItem);
    } else if (type === 'boisson') {
      postBoissons(updatedItem);
    } else if (type === 'snack') {
      postSnacks(updatedItem);
    } else if (type === 'ingredient') {
      postIngredients(updatedItem);
    } else if (type === 'viande') {
      postViandes(updatedItem);
    }
  };

  function newItems(page: React.ReactElement) {    
    if (page && selectedPageName === "Menus") {
      const newMenu: Menus = {
        event: false,
        dispo: true,
        id: -1,
        nom: "",
        prix: 0,
        prixServeur: 0,
        quantitePlat: 0,
        quantiteSnack: 0,
        quantiteBoisson: 0,
      };
      setModalData({ item: newMenu, type: "menu" });
    } else if (page && selectedPageName === "Plats") {
      const newPlats: Plats = {
        event: false,
        dispo: true,
        id: -1,
        nom: "",
        prix: 0,
        prixServeur: 0,
        quantite: 0,
        ingredients: [],
      };
      setModalData({ item: newPlats, type: "plat" });
    } else if (page && selectedPageName === "Snacks") {
      const newSnacks: Snacks = {
        dispo: true,
        id: -1,
        nom: "",
        quantite: 0,
        prix: 0,
        prixServeur: 0,
      };
      setModalData({ item: newSnacks, type: "snack" });
    } else if (page && selectedPageName === "Boissons") {
      const newBoissons: Boissons = {
        dispo: true,
        id: -1,
        nom: "",
        quantite: 0,
        prix: 0,
        prixServeur: 0,
      };
      setModalData({ item: newBoissons, type: "boisson" });
    } else if (page && selectedPageName === "Ingrédients") {
      const newIngredients: Ingredients = {
        commentaire: "",
        dispo: true,
        id: -1,
        nom: "",
        quantite: 0,
      };
      setModalData({ item: newIngredients, type: "ingredient" });
    } else if (page && selectedPageName === "Viandes") {
      const newViandes: Viandes = {
        commentaire: "",
        dispo: true,
        id: -1,
        nom: "",
        quantite: 0,
      };
      setModalData({ item: newViandes, type: "viande" });
    }
  }

  return (
    <div>
      <div>
        <div className="flex flex-col justify-center items-center">
          <h1 className={title()}>Modifier la carte</h1>
          {selectedPage && (
            <div className="flex justify-center items-center gap-8">
              <Card className="flex flex-col mt-2 w-[100%] max-w-[100px]" isPressable onPress={() => {newItems(selectedPage); setIsModalOpen(true);}}>
                <CardHeader className="justify-center">
                  <p className="text-lg">Ajouter</p>
                </CardHeader>
              </Card>
              <Card className="flex flex-col mt-2 w-[100%] max-w-[100px]" isPressable onPress={() => setSelectedPage(null)}>
                <CardHeader className="justify-center">
                  <p className="text-lg">Retour</p>
                </CardHeader>
              </Card>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2">
        {selectedPage ? (
          <>
            {selectedPage}
          </>
        ) : (
          <div className="grid grid-cols-1 gap-4 mt-12 md:grid-cols-2">
            {actions.map((action) => (
              <Card
                key={action.nom}
                isPressable
                onPress={() => {setSelectedPage(action.page); setSelectedPageName(action.nom)}}
              >
                <CardHeader className="justify-center">
                  <p className="text-lg">{action.nom}</p>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="text-small text-default-500">
                    Modifier les différents {action.nom.toLowerCase()}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
      {modalData && (
        <EditCarteModal
          item={modalData.item}
          isOpen={isModalOpen}
          onClose={() => {setModalData(null) ; setIsModalOpen(false)}}
          onSave={(updatedItem: MenuItem) => {
            handleSave(updatedItem, modalData.type);
            setModalData(null);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
