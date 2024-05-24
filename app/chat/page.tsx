'use client';
import React, { useState, useEffect } from 'react';
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { getCartes, getIngredients } from "@/config/api";
import { Carte, Repas, ChatLayoutProps, ChatMenuProps } from "@/types/index";
import DetailCommandeModal from "@/components/DetailCommandeModal";
import Paiement from '../paiement/page';
import { Card, CardHeader, Divider, CardBody, CardFooter } from '@nextui-org/react';

export default function ChatPage() {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [repas, setRepas] = useState<Repas>({
    menu: [] as string[],
    plat: [] as string[],
    snack: [] as string[],
    boisson: [] as string[],
    complete: false,
    join: "" as any,
  });
  const [currentStep, setCurrentStep] = useState("menu");
  const [isModalOpen, setIsModalOpen] = useState(false);  // État pour le modal
  const [modalResponse, setModalResponse] = useState<string[]>([]);  // État pour la réponse du modal

  useEffect(() => {
    async function fetchCartes() {
      const fetchedCartes = await getCartes();
      setCartes(fetchedCartes);
    }
    fetchCartes();

    async function fetchIngredients() {
      const fetchedIngredients = await getIngredients(1);
      setIngredients(fetchedIngredients);
    }
    fetchIngredients();

  }, []);

  useEffect(() => {
    if (modalResponse.length > 0) {
      const newRepas = { ...repas };
      newRepas.plat.push(...modalResponse);
      setRepas(newRepas);
      setCurrentStep(getNextStep("plat", newRepas));
    }
  }, [modalResponse]);

  const handleSetRepasItem = (type: keyof Repas, item: string) => {
    const newRepas = { ...repas };
    if (type === "plat" && item !== "Pas de plat") {
      newRepas[type].push(item);
      setIsModalOpen(true);  // Ouvrir le modal
    } else {
      if (type === "menu" || type === "snack" || type === "boisson") {
        newRepas[type].push(item);
      }
      if (type === "boisson") {
        newRepas.complete = true;
      }

    }
    setRepas(newRepas);
    setCurrentStep(getNextStep(type, newRepas));
  };

  const getNextStep = (type: keyof Repas, repas: Repas) => {
    if (type !== "end" && repas.complete) {
      return "other";
    }
    switch (type) {
      case "menu":
        return "plat";
      case "plat":
        return "snack";
      case "snack":
        return "boisson";
      case "boisson":
        return "other";
      default:
        return "end";
    }
  };

  return (
    <div className=" flex justify-center min-h-screen">
      <div className="flex w-3/4 h-3/4 ">

        <div className="flex-1 m-4 grid">
          <h1 className={title()}>Commande !</h1>
          <ChatNext
            repas={repas}
            cartes={cartes}
            setRepasItem={handleSetRepasItem}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
        <div className="w-1 border-r-2 mx-2"></div>
        <div className="flex-1-500 m-4 justify-end  text-right">
          <RecapComponent repas={repas} cartes={cartes} setRepas={function (repas: string): void {
            throw new Error('Function not implemented.');
          }} />
          {/* Inclure DetailCommandeModal ici */}
          <DetailCommandeModal isOpen={isModalOpen} onClose={(values) => (setIsModalOpen(false), setModalResponse(values))} options={ingredients} />
        </div>
      </div >
    </div>
  );
}

function RecapComponent({ repas, cartes }: ChatMenuProps) {
  // Filtrer et obtenir les noms des plats
  const plats: string[] = cartes.filter((carte) => carte.ref === "Plat").map((carte) => carte.nom);

  // Définir le type pour le résultat final
  type PlatsAvecIngredients = {
    [key: string]: string[];
  };

  // Créer un objet pour stocker les plats et leurs ingrédients
  const platsAvecIngredients: PlatsAvecIngredients = {};

  let currentPlat: string | null = null;
  repas.plat.forEach((item) => {
    if (plats.includes(item)) {
      currentPlat = item;
      platsAvecIngredients[currentPlat] = [];
    } else if (currentPlat) {
      platsAvecIngredients[currentPlat].push(item);
    }
  });

  return (
    <div className="flex flex-col gap-4 max-w-[300px] min-w-[300px] text-justify">
      <h2 className="text-lg font-bold gap-4">Récapitulatif de la commande :</h2>

      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-lg font-semibold">Menu 🍱</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className='text-default-500 font-bold'>{repas.menu.join(", ") || "Pas de menu"}</p>
        </CardBody>
        <Divider />
      </Card>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-lg font-semibold">Plat 🌭</p>
          </div>
        </CardHeader>
        <Divider />
        {repas.plat.length === 0 && (
          <CardBody>
            <p className='text-default-500 font-bold'>Pas de plat</p>
          </CardBody>
        )}
        {Object.entries(platsAvecIngredients).map(([plat, ingredients]) => (
          <CardBody key={plat}>
            <p className='text-default-500 font-bold'>{plat}</p>
            <ul>
              {ingredients.map((ingredient, index) => (
                <li className='text-default-500' key={index}>{ingredient}</li>
              ))}
            </ul>
          </CardBody>
        ))}
        <Divider />
      </Card>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-lg font-semibold">Snack 🍪</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className='text-default-500 font-bold'>{repas.snack.join(", ") || "Pas de snack"}</p>
        </CardBody>
        <Divider />
      </Card>
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-lg font-semibold">Boisson 🥤</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <p className='text-default-500 font-bold'>{repas.boisson.join(", ") || "Pas de boisson"}</p>
        </CardBody>
        <Divider />
      </Card>
    </div>
  );
}


function ChatNext({ repas, cartes, setRepasItem, currentStep, setCurrentStep }: ChatMenuProps & { currentStep: string, setCurrentStep: (step: string) => void }) {
  switch (currentStep) {
    case "menu":
      return <ChatMenu cartes={cartes} setRepas={item => setRepasItem("menu", item)} repas={repas} />;
    case "plat":
      return <ChatPlat cartes={cartes} setRepas={item => setRepasItem("plat", item)} repas={repas} />;
    case "snack":
      return <ChatSnack cartes={cartes} setRepas={item => setRepasItem("snack", item)} repas={repas} />;
    case "boisson":
      return <ChatBoisson cartes={cartes} setRepas={item => setRepasItem("boisson", item)} repas={repas} />;
    case "other":
      return <ChatOther setCurrentStep={setCurrentStep} />;
    case "end":
      return <ChatEnd repas={repas} cartes={[]} setRepas={function (repas: string): void {
        throw new Error("Function not implemented.");
      }} />;
    default:
      return null;
  }
}

function ChatMenu({ cartes, setRepas }: ChatMenuProps) {
  const menu = cartes.filter((carte) => carte.ref === "Menu").map((carte) => carte.nom);
  menu.push("Pas de menu");

  return (
    <ChatLayout
      who="Lancelot"
      mainSentence="Bonjour ! Que souhaites-tu aujourd'hui ?"
      buttons={menu}
      setRepas={setRepas}
    />
  );
}

function ChatPlat({ cartes, setRepas }: ChatMenuProps) {
  const plat = cartes.filter((carte) => carte.ref === "Plat").map((carte) => carte.nom);
  plat.push("Pas de plat");

  return (
    <ChatLayout
      who="Lancelot"
      mainSentence="C'est noté ! Et avec quoi ?"
      buttons={plat}
      setRepas={setRepas}
    />
  );
}

function ChatSnack({ cartes, setRepas }: ChatMenuProps) {
  const snack = cartes.filter((carte) => carte.ref === "Snack").map((carte) => carte.nom);
  snack.push("Pas de snack");

  return (
    <ChatLayout
      who="Lancelot"
      mainSentence="C'est noté ! Et avec quoi ?"
      buttons={snack}
      setRepas={setRepas}
    />
  );
}

function ChatBoisson({ cartes, setRepas }: ChatMenuProps) {
  const boisson = cartes.filter((carte) => carte.ref === "Boisson").map((carte) => carte.nom);
  boisson.push("Pas de boisson");

  return (
    <ChatLayout
      who="Lancelot"
      mainSentence="C'est noté ! Et avec quoi ?"
      buttons={boisson}
      setRepas={setRepas}
    />
  );
}

function ChatOther({ setCurrentStep }: { setCurrentStep: (step: string) => void }) {
  const options = ["Plat", "Snack", "Boisson", "Fini !"];

  return (
    <ChatLayout
      who="Lancelot"
      mainSentence="C'est noté ! Et avec quoi ?"
      buttons={options}
      setRepas={(choice) => setCurrentStep(choice === "Fini !" ? "end" : choice.toLowerCase())}
    />
  );
}

function ChatEnd({ repas }: ChatMenuProps) {
  return (
    <div>
      <h2>Lancelot</h2>
      <p>Parfait ! Comment veux-tu régler ta commande ? </p>
      <Paiement />
    </div>
  );
}

function ChatLayout({ who, mainSentence, buttons, setRepas }: ChatLayoutProps) {
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleButtonClick = (choice: string) => {
    setRepas(choice);
    setButtonClicked(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold">{who}</h2>
      </div>
      <p className="text-default-900">{mainSentence}</p>
      {buttons && buttons.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {buttons.map((button, index) => (
            <Button
              key={button}
              color={index === buttons.length - 1 ? "danger" : "default"}
              variant={index === buttons.length - 1 ? "bordered" : "solid"}
              className={index === buttons.length - 1 ? "text-color-default bg-color-default" : ""}
              onClick={() => handleButtonClick(button)}
              isDisabled={buttonClicked}
            >
              {button}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
