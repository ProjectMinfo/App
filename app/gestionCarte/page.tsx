'use client';
import React, { useState } from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { title } from "@/components/primitives";

import GestionMenus from "./menus/page";
import GestionPlats from "./plats/page";
import GestionSnacks from "./snacks/page";
import GestionBoissons from "./boissons/page";
import GestionIngredients from "./ingredients/page";
import GestionViandes from "./viandes/page";
import EditCarteModal from "@/components/EditCarteModal";
import { Boissons, Ingredients, Menus, Plats, Snacks, Viandes } from "@/types";
import { postMenus, postPlats, postBoissons, postSnacks, postIngredients, postViandes } from "@/config/api";

type MenuItem = Menus | Boissons | Plats | Snacks | Ingredients | Viandes;

export default function App() {
  const [selectedPage, setSelectedPage] = useState<React.ReactElement | null>(null);
  const [modalData, setModalData] = useState<{ item: MenuItem; type: string } | null>(null);

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
    if (page && page.type.name && page.type.name === "GestionMenus") {
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
    } else if (page && page.type.name && page.type.name === "GestionPlats") {
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
    } else if (page && page.type.name && page.type.name === "GestionSnacks") {
      const newSnacks: Snacks = {
        dispo: true,
        id: -1,
        nom: "",
        quantite: 0,
        prix: 0,
        prixServeur: 0,
      };
      setModalData({ item: newSnacks, type: "snack" });
    } else if (page && page.type.name && page.type.name === "GestionBoissons") {
      const newBoissons: Boissons = {
        dispo: true,
        id: -1,
        nom: "",
        quantite: 0,
        prix: 0,
        prixServeur: 0,
      };
      setModalData({ item: newBoissons, type: "boisson" });
    } else if (page && page.type.name && page.type.name === "GestionIngredients") {
      const newIngredients: Ingredients = {
        commentaire: "",
        dispo: true,
        id: -1,
        nom: "",
        quantite: 0,
      };
      setModalData({ item: newIngredients, type: "ingredient" });
    } else if (page && page.type.name && page.type.name === "GestionViandes") {
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
              <Card className="flex flex-col mt-2 w-[100%] max-w-[100px]" isPressable onPress={() => newItems(selectedPage)}>
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
                onPress={() => setSelectedPage(action.page)}
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
          isOpen={true}
          onClose={() => setModalData(null)}
          onSave={(updatedItem: MenuItem) => {
            handleSave(updatedItem, modalData.type);
            setModalData(null);
          }}
        />
      )}
    </div>
  );
}
