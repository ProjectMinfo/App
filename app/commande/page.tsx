'use client';
import React, { useState, useEffect } from 'react';
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { getBoissons, getIngredients, getMenus, getPlats, getSnacks, getViandes } from "@/config/api";
import { Ingredients, Menus, Plats, Snacks, Boissons, Viandes, Repas } from "@/types/index";
import DetailCommandeModal from "@/components/DetailCommandeModal";
import Paiement from './paiement/page';
import { Card, CardHeader, Divider, CardBody } from '@nextui-org/react';

type NewMenus = {
  type: "menu";
  menu: Menus;
};

type NewPlats = {
  type: "plat";
  plat: Plats;
};

type NewSnacks = {
  type: "snack";
  snack: Snacks;
};

type NewBoissons = {
  type: "boisson";
  boisson: Boissons;
};

type AllType = NewMenus | NewPlats | NewSnacks | NewBoissons | { type: "end" };

export default function ChatPage() {

  const [listMenus, setListMenus] = useState<Menus[]>([]);
  const [listPlats, setListPlats] = useState<Plats[]>([]);
  const [listIngredients, setIngredients] = useState<Ingredients[] | Viandes[]>([]);
  const [listViandes, setViandes] = useState<Viandes[]>([]);
  const [listSnacks, setListSnacks] = useState<Snacks[]>([]);
  const [listBoissons, setListBoissons] = useState<Boissons[]>([]);

  const [repas, setRepas] = useState<Repas>({
    menu: [],
    plat: [],
    snack: [],
    boisson: [],
    complete: false,
    join: () => {
      return [
        ...repas.menu.map((menu: Menus) => menu.nom),
        ...repas.plat.map((plat: Plats) => plat.nom),
        ...repas.snack.map((snack: Snacks) => snack.nom),
        ...repas.boisson.map((boisson: Boissons) => boisson.nom),
      ].join(", ");
    },
  });

  const [currentStep, setCurrentStep] = useState<string>("menu");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalResponse, setModalResponse] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      const [fetchedMenus, fetchedPlats, fetchedIngredients, fetchedViandes, fetchedSnacks, fetchedBoissons] = await Promise.all([
        getMenus(),
        getPlats(),
        getIngredients(),
        getViandes(),
        getSnacks(),
        getBoissons(),
      ]);
      setListMenus(fetchedMenus);
      setListPlats(fetchedPlats);
      setIngredients(fetchedIngredients);
      setViandes(fetchedViandes);
      setListSnacks(fetchedSnacks);
      setListBoissons(fetchedBoissons);
    }
    fetchData();
  }, []);


  useEffect(() => {
    if (modalResponse && modalResponse.viandes && modalResponse.ingredients) {
      const newRepas = { ...repas };

      modalResponse.viandes.map((viande: Viandes) => (
        newRepas.plat[newRepas.plat.length - 1].ingredients.push({
          ingredient: viande,
          qmin: 0,
          qmax: 0,
        })
      ));

      modalResponse.ingredients.map((ingredient: Viandes) => (
        newRepas.plat[newRepas.plat.length - 1].ingredients.push({
          ingredient: ingredient,
          qmin: 0,
          qmax: 0,
        })
      ));

      setRepas(newRepas);
      setCurrentStep(getNextStep({ type: "plat" }, newRepas));
    }
  }, [modalResponse]);

  const handleSetRepasItem = (type: keyof Repas, item: AllType) => {
    const newRepas: Repas = { ...repas };

    switch (item.type) {
      case "menu":
        newRepas.menu.push(item.menu);
        break;
      case "plat":
        newRepas.plat.push(item.plat);
        setIsModalOpen(true);
        break;
      case "snack":
        newRepas.snack.push(item.snack);
        break;
      case "boisson":
        newRepas.boisson.push(item.boisson);
        newRepas.complete = true;
        break;
    }

    setRepas(newRepas);
    setCurrentStep(getNextStep(item, newRepas));
  };

  const getNextStep = (item: AllType, repas: Repas) => {
    const type = item.type;

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

  function RecapComponent({ repas }: { repas: Repas }) {

    console.log(repas.plat);


    return (
      <div className="flex flex-col gap-4 max-w-[300px] min-w-[300px] text-justify">
        <h2 className="text-lg font-bold">Récapitulatif de la commande :</h2>
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Menu 🍱</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <p className="text-default-500 font-bold">
              {repas.menu.map((menu: Menus) => menu.nom).join(", ") || "Pas de menu"}</p>
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
          {repas.plat.length === 0 ? (
            <CardBody>
              <p className="text-default-500 font-bold">Pas de plat</p>
            </CardBody>
          ) : (
            repas.plat.map((plat: Plats) => (
              <CardBody key={plat.nom}>
                <p className="text-default-500 font-bold">{plat.nom}</p>
                <ul>
                  {plat.ingredients.map((ingredient, index) => (
                    <li className="text-default-500" key={index}>{ingredient.ingredient.nom}</li>
                  ))}
                </ul>
              </CardBody>
            ))
          )}
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
            <p className="text-default-500 font-bold">{repas.snack.map((snack: Snacks) => snack.nom).join(", ") || "Pas de snack"}</p>
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
            <p className="text-default-500 font-bold">{repas.boisson.map((boisson: Boissons) => boisson.nom).join(", ") || "Pas de boisson"}</p>
          </CardBody>
          <Divider />
        </Card>
      </div>
    );
  }

  function ChatNext({ repas, setRepasItem, currentStep, setCurrentStep }: { repas: Repas, setRepasItem: (type: keyof Repas, item: AllType) => void, currentStep: string, setCurrentStep: (step: string) => void }) {
    switch (currentStep) {
      case "menu":
        return <ChatMenu setRepas={item => setRepasItem("menu", item)} />;
      case "plat":
        return <ChatPlat setRepas={item => setRepasItem("plat", item)} />;
      case "snack":
        return <ChatSnack setRepas={item => setRepasItem("snack", item)} />;
      case "boisson":
        return <ChatBoisson setRepas={item => setRepasItem("boisson", item)} />;
      case "other":
        return <ChatOther setCurrentStep={setCurrentStep} />;
      case "end":
        return <ChatEnd />;
      default:
        return null;
    }
  }


  function ChatMenu({ setRepas }: { setRepas: (item: AllType) => void }) {
    const menu: NewMenus[] = listMenus.map((menu) => ({ type: "menu", menu }));

    return (
      <ChatLayout
        who="Lancelot"
        mainSentence="Bonjour ! Que souhaites-tu aujourd'hui ?"
        buttons={menu}
        setRepas={setRepas}
      />
    );
  }

  function ChatPlat({ setRepas }: { setRepas: (item: AllType) => void }) {
    const plat: NewPlats[] = listPlats.map((plat) => ({ type: "plat", plat }));

    return (
      <ChatLayout
        who="Lancelot"
        mainSentence="C'est noté ! Et avec quoi ?"
        buttons={plat}
        setRepas={setRepas}
      />
    );
  }

  function ChatSnack({ setRepas }: { setRepas: (item: AllType) => void }) {
    const snack: NewSnacks[] = listSnacks.map((snack) => ({ type: "snack", snack }));

    return (
      <ChatLayout
        who="Lancelot"
        mainSentence="C'est noté ! Et avec quoi ?"
        buttons={snack}
        setRepas={setRepas}
      />
    );
  }

  function ChatBoisson({ setRepas }: { setRepas: (item: AllType) => void }) {
    const boisson: NewBoissons[] = listBoissons.map((boisson) => ({ type: "boisson", boisson }));

    return (
      <ChatLayout
        who="Lancelot"
        mainSentence="C'est noté ! Et avec quoi ?"
        buttons={boisson}
        setRepas={setRepas}
      />
    );
  }

  type OtherOption = {
    type: "menu" | "plat" | "snack" | "boisson" | "end";
    label: string;
  };

  function ChatOther({ setCurrentStep }: { setCurrentStep: (step: string) => void }) {
    const options: OtherOption[] = [
      { type: "menu", label: "Menu" },
      { type: "plat", label: "Plat" },
      { type: "snack", label: "Snack" },
      { type: "boisson", label: "Boisson" },
      { type: "end", label: "Terminer la commande" },
    ];

    const handleButtonClick = (choice: OtherOption) => {
      setCurrentStep(choice.type);
    };

    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold">Lancelot</h2>
        </div>
        <p className="text-default-900">C'est noté ! Que veux-tu faire ensuite ?</p>
        <div className="grid grid-cols-2 gap-4">
          {options.map((option, index) => (
            <Button
              key={option.type + index}
              color={"default"}
              variant={"solid"}
              className={""}
              onClick={() => handleButtonClick(option)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }



  function ChatEnd() {
    return (
      <div>
        <h2>Lancelot</h2>
        <p>Parfait ! Comment veux-tu régler ta commande ? </p>
        <Paiement />
      </div>
    );
  }

  function ChatLayout({ who, mainSentence, buttons, setRepas }: { who: string, mainSentence: string, buttons: AllType[] | OtherOption[], setRepas: (choice: AllType | OtherOption) => void }) {
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);

    const handleButtonClick = (choice: AllType | OtherOption) => {
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
                key={button.type + index}
                color={"default"}
                variant={"solid"}
                className=""
                onClick={() => handleButtonClick(button)}
                isDisabled={buttonClicked}
              >
                {"menu" in button ? button.menu.nom : "plat" in button ? button.plat.nom : "snack" in button ? button.snack.nom : "boisson" in button ? button.boisson.nom : "label" in button ? button.label : ""}
              </Button>
            ))}
            <Button
              key={999}
              color="danger"
              variant="bordered"
              className="text-color-default bg-color-default"
              onClick={() => handleButtonClick({ type: "end", label: "Terminer la commande" })}
              isDisabled={buttonClicked}
            >Non merci
            </Button>
          </div>
        )}
      </div>
    );
  }



  return (
    <div className="flex justify-center min-h-screen">
      <div className="flex w-3/4 h-3/4">
        <div className="flex-1 m-4 grid">
          <h1 className={title()}>Commande !</h1>
          <ChatNext
            repas={repas}
            setRepasItem={handleSetRepasItem}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
        <div className="w-1 border-r-2 mx-2"></div>
        <div className="flex-1 m-4 justify-end text-right">
          <RecapComponent repas={repas} />
          <DetailCommandeModal isOpen={isModalOpen} onClose={(values: { viandes: Viandes[], ingredients: Ingredients[] }) => { setIsModalOpen(false); setModalResponse(values); }} options={{ "ingredients": listIngredients, "viandes": listViandes }} />
        </div>
      </div>
    </div>
  );
}
