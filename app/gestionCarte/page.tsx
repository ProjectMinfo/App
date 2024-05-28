'use client';
import React, { useState } from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { title } from "@/components/primitives";

import GestionMenus from "./menus/page";
import GestionPlats from "./plats/page";
import GestionSnacks from "./snacks/page";
import GestionBoissons from "./boissons/page";

export default function App() {
  const [selectedPage, setSelectedPage] = useState<React.ReactElement | null>(null);


  const actions = [
    { nom: "Menus", page: <GestionMenus /> },
    { nom: "Plats", page: <GestionPlats /> },
    { nom: "Snacks", page: <GestionSnacks /> },
    { nom: "Boissons", page: <GestionBoissons /> }
  ];

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <h1 className={title()}>Modifier la carte</h1>
        {selectedPage && (
          <Card className=" mt-2 w-[100%] max-w-[100px]" isPressable onPress={() => setSelectedPage(null)}>
            <CardHeader className="justify-center">
              <p className="text-lg">Retour</p>
            </CardHeader>
          </Card>
        )}
      </div>
      <div className="mt-2">
        {selectedPage ? (
          <>
            {selectedPage}
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4 mt-12">
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
    </div>
  );
}
