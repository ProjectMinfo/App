'use client';
import React, { useState, useEffect } from 'react';
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { getBoissons, getIngredients, getMenus, getPlats, getSnacks, getViandes } from "@/config/api";
import { Ingredients, Menus, Plats, Snacks, Boissons, Viandes } from "@/types/index";
import DetailCommandeModal from "@/components/DetailCommandeModal";
import Paiement from './paiement/page';
import { Card, CardHeader, Divider, CardBody } from '@nextui-org/react';
import { prepareCommande } from './logic';


type NewMenus = {
  id: number;
  type: "menu";
  menu: Menus;
  menuId: number;
};

type NewPlats = {
  id: number;
  type: "plat";
  plat: Plats;
  menuId?: number;
};

type NewSnacks = {
  id: number;
  type: "snack";
  snack: Snacks;
  menuId?: number;
};

type NewBoissons = {
  id: number;
  type: "boisson";
  boisson: Boissons;
  menuId?: number;
};

type NewRepas = {
  menu: NewMenus[];
  plat: NewPlats[];
  snack: NewSnacks[];
  boisson: NewBoissons[];
  complete: boolean;
  remainingPlats: number;
  remainingBoissons: number;
  remainingSnacks: number;
  currentMenu?: NewMenus;
};


type IngredientsInPlat = {
  ingredient: Ingredients;
  qmin: number;
  qmax: number;
}


type AllType = NewMenus | NewPlats | NewSnacks | NewBoissons | { type: "other" } | { type: "end" };

export default function ChatPage() {

  const [listMenus, setListMenus] = useState<Menus[]>([]);
  const [listPlats, setListPlats] = useState<Plats[]>([]);
  const [listIngredients, setIngredients] = useState<Ingredients[] | Viandes[]>([]);
  const [listViandes, setViandes] = useState<Viandes[]>([]);
  const [listSnacks, setListSnacks] = useState<Snacks[]>([]);
  const [listBoissons, setListBoissons] = useState<Boissons[]>([]);

  const [repas, setRepas] = useState<NewRepas>({
    menu: [],
    plat: [],
    snack: [],
    boisson: [],
    complete: false,
    remainingPlats: 0,
    remainingBoissons: 0,
    remainingSnacks: 0
  });

  const [currentStep, setCurrentStep] = useState<string>("other");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalResponse, setModalResponse] = useState<any>([]);

  const [isMenuDone, setIsMenuDone] = useState<boolean>(true);
  const [currentPlat, setCurrentPlat] = useState<NewPlats>();
  const [allViandes, setAllViandes] = useState<Viandes[]>([]);
  const [currentMenuId, setCurrentMenuId] = useState<number>(0);

  // Fetch data
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

  // Gestion des réponses du modal pour les plats
  useEffect(() => {

    if (modalResponse && modalResponse.viandes && modalResponse.ingredients) {
      const nextRepas = { ...repas };
      const resultIngredients = [...modalResponse.ingredients, ...modalResponse.viandes];

      const newPlat = { ...currentPlat }; // Make a copy of the currentPlat object

      if (newPlat.plat) {
        newPlat.plat.ingredients = resultIngredients; // Update the ingredients property of the newPlat object


        nextRepas.plat.push(newPlat); // Push the newPlat object to the plat array in newRepas


        modalResponse.viandes.map((viande: Viandes) => (
          allViandes.push(viande)
        ));

        setCurrentPlat(undefined);

        setRepas(nextRepas);
        setAllViandes(allViandes);
        setCurrentStep(getNextStep({ type: "plat" }, nextRepas));
      }
    }
  }, [modalResponse]);

  // Ajout des items dans le repas
  const handleSetRepasItem = (type: keyof NewRepas, item: AllType) => {
    const newRepas: NewRepas = { ...repas };

    switch (item.type) {
      case "menu":
        newRepas.menu.push(item);
        newRepas.currentMenu = item
        newRepas.remainingPlats = item.menu.quantitePlat;
        newRepas.remainingBoissons = item.menu.quantiteBoisson;
        newRepas.remainingSnacks = item.menu.quantiteSnack;
        setCurrentMenuId(item.menuId);
        setIsMenuDone(false);
        break;
      case "plat":
        if (!isMenuDone) {
          newRepas.remainingPlats -= 1;
          const platInMenu = item;
          platInMenu.plat.prix = 0;
          platInMenu.plat.prixServeur = 0;
          platInMenu.menuId = currentMenuId;
          setCurrentPlat(platInMenu);  // Set the current plat before opening the modal
          setIsModalOpen(true);
        }
        else {
          setCurrentPlat(item);  // Set the current plat before opening the modal
          setIsModalOpen(true);
        }
        break;
      case "snack":
        if (!isMenuDone) {
          newRepas.remainingSnacks -= 1;
          const snackInMenu = item
          snackInMenu.snack.prix = 0;
          snackInMenu.snack.prixServeur = 0;
          snackInMenu.menuId = currentMenuId;

          newRepas.snack.push(snackInMenu);
        }
        else {
          newRepas.snack.push(item);
        }
        break;
      case "boisson":
        if (!isMenuDone) {
          newRepas.remainingBoissons -= 1;
          const boissonInMenu = item
          boissonInMenu.boisson.prix = 0;
          boissonInMenu.boisson.prixServeur = 0;
          boissonInMenu.menuId = currentMenuId;

          newRepas.boisson.push(boissonInMenu);
        }
        else {
          newRepas.boisson.push(item);
        }
        break;
    }

    if (newRepas.menu.length > 0 && newRepas.remainingPlats === 0 && newRepas.remainingBoissons === 0 && newRepas.remainingSnacks === 0) {
      setIsMenuDone(true);
    }

    setRepas(newRepas);
    setCurrentStep(getNextStep(item, newRepas));
  };

  const getNextStep = (item: AllType, repas: NewRepas): string => {
    if (repas.remainingPlats > 0) {
      return "plat";
    } else if (repas.remainingBoissons > 0) {
      return "boisson";
    } else if (repas.remainingSnacks > 0) {
      return "snack";
    } else {
      return "other";
    }
  };

  function handleDeleteItem(type: keyof NewRepas, item: AllType) {
    const newRepas: NewRepas = { ...repas };
    const itemIndex = newRepas[type].findIndex((currentItem) => currentItem.id === item.id);

    if (type === "menu") {
      console.log("delete menu");
      
      const currentItem = item as NewMenus;

      newRepas.boisson = newRepas.boisson.filter((boisson) => boisson.menuId !== currentItem.menuId);
      newRepas.snack = newRepas.snack.filter((snack) => snack.menuId !== currentItem.menuId);
      newRepas.plat = newRepas.plat.filter((plat) => plat.menuId !== currentItem.menuId);
    }

    newRepas[type].splice(itemIndex, 1);

    if (type === "plat") {
      const currentItem = item as NewPlats;
      currentItem.plat.ingredients.map((ingredient) => {
        const index = allViandes.findIndex((viande) => ingredient.id === viande.id);
        allViandes.splice(index, 1);
      });
    }

    setRepas(newRepas);
    setCurrentStep(getNextStep(item, newRepas));
  }


  function RecapComponent({ repas }: { repas: NewRepas }) {

    console.log(repas, allViandes);

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
          <div className="max-h-[80px] h-[80px] overflow-scroll">
            <CardBody>
              <p className="text-default-500 font-bold">
                {repas.menu.length > 0
                  ? repas.menu.map((menu, index) => (
                    <span key={menu.id}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteItem("menu", menu);
                        }}
                        className="text-link"
                      >
                        {menu.menu.nom}
                      </a>
                      {index < repas.menu.length - 1 ? ", " : ""}
                    </span>
                  ))
                  : "Pas de menu"}
              </p>
            </CardBody>
          </div>
          <Divider />
        </Card>
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Plat 🌭</p>
            </div>
          </CardHeader>
          <Divider />
          <div className="max-h-[150px] h-[150px] overflow-scroll">
            {repas.plat.length === 0 ? (
              <CardBody>
                <p className="text-default-500 font-bold">Pas de plat</p>
              </CardBody>
            ) : (
              repas.plat.map((plat: NewPlats, index) => (
                <CardBody key={plat.id}>
                  <p className="text-default-500 font-bold">
                    {/* {repas.plat.length > 0
                      ? repas.plat.map((plat, index) => ( */}
                    <span>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteItem("plat", plat);
                        }}
                        className="text-link"
                      >
                        {plat.plat.nom}
                      </a>
                      {index < repas.plat.length - 1 ? ", " : ""}
                    </span>
                    {/* ))
                      : "Pas de plat"} */}
                  </p>
                  <ul>
                    {plat.plat.ingredients.map((currentIngredient: IngredientsInPlat) => (
                      <li className="text-default-500" key={currentIngredient.nom} >{currentIngredient.nom}</li>
                    ))}

                  </ul>
                </CardBody>
              ))
            )}
          </div>
          <Divider />
        </Card>
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Snack 🍪</p>
            </div>
          </CardHeader>
          <Divider />
          <div className="max-h-[80px] h-[80px] overflow-scroll">

            <CardBody>
              <p className="text-default-500 font-bold">
                {repas.snack.length > 0
                  ? repas.snack.map((snack, index) => (
                    <span key={snack.id}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteItem("snack", snack);
                        }}
                        className="text-link"
                      >
                        {snack.snack.nom}
                      </a>
                      {index < repas.snack.length - 1 ? ", " : ""}
                    </span>
                  ))
                  : "Pas de snack"}
              </p>
            </CardBody>
          </div>
          <Divider />
        </Card>
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Boisson 🥤</p>
            </div>
          </CardHeader>
          <Divider />
          <div className="max-h-[80px] h-[80px] overflow-scroll">

            <CardBody>
              <p className="text-default-500 font-bold">
                {repas.boisson.length > 0
                  ? repas.boisson.map((boisson, index) => (
                    <span key={boisson.id}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteItem("boisson", boisson);
                        }}
                        className="text-link"
                      >
                        {boisson.boisson.nom}
                      </a>
                      {index < repas.boisson.length - 1 ? ", " : ""}
                    </span>
                  ))
                  : "Pas de boisson"}
              </p>
            </CardBody>
          </div>
          <Divider />
        </Card>
      </div>
    );
  }

  function ChatNext({ repas, setRepasItem, currentStep, setCurrentStep }: { repas: NewRepas, setRepasItem: (type: keyof NewRepas, item: AllType) => void, currentStep: string, setCurrentStep: (step: string) => void }) {
    if (repas.remainingPlats > 0) {
      return <ChatPlat setRepas={item => setRepasItem("plat", item)} />;
    }
    else if (repas.remainingSnacks > 0) {
      return <ChatSnack setRepas={item => setRepasItem("snack", item)} />;
    }
    else if (repas.remainingBoissons > 0) {
      return <ChatBoisson setRepas={item => setRepasItem("boisson", item)} />;
    }
    else {
      if (currentStep === "end") {
        return <ChatEnd repas={repas} allViandes={allViandes} />;
      }
      else if (currentStep === "menu") {
        return <ChatMenu setRepas={item => setRepasItem("menu", item)} />;
      }
      else if (currentStep === "plat") {
        return <ChatPlat setRepas={item => setRepasItem("plat", item)} />;
      }
      else if (currentStep === "snack") {
        return <ChatSnack setRepas={item => setRepasItem("snack", item)} />;
      }
      else if (currentStep === "boisson") {
        return <ChatBoisson setRepas={item => setRepasItem("boisson", item)} />;
      }
      else return <ChatOther setCurrentStep={setCurrentStep} />;
    }
  }


  function ChatMenu({ setRepas }: { setRepas: (item: AllType) => void }) {
    const menuId = Math.floor(Math.random() * 1000) + 1;
    const menu: NewMenus[] = listMenus.map((menu) => ({ id: menu.id, type: "menu", menu, menuId }));

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
    const id = Math.floor(Math.random() * 1000) + 1;
    const plat: NewPlats[] = listPlats.map((plat) => ({ id: id, type: "plat", plat }));

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
    const id = Math.floor(Math.random() * 1000) + 1;
    const snack: NewSnacks[] = listSnacks.map((snack) => ({ id: id, type: "snack", snack }));

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
    const id = Math.floor(Math.random() * 1000) + 1;
    const boisson: NewBoissons[] = listBoissons.map((boisson) => ({ id: id, type: "boisson", boisson }));

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
    type: "menu" | "plat" | "snack" | "boisson" | "other" | "end";
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
              key={index}
              color={index === options.length - 1 ? "danger" : "default"}
              variant={index === options.length - 1 ? "bordered" : "solid"}
              className={"font-medium"}
              onClick={() => handleButtonClick(option)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }



  function ChatEnd({ repas, allViandes }: { repas: NewRepas, allViandes: Viandes[] }) {

    prepareCommande(repas, allViandes);

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
                key={index}
                color={"default"}
                variant={"solid"}
                className={"font-medium"}
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
              className="font-medium"
              onClick={() => handleButtonClick({ type: "other", label: "Terminer la commande" })}
              isDisabled={buttonClicked}
            >
              Non merci
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
          <DetailCommandeModal
            isOpen={isModalOpen}
            onClose={(values: { viandes: Viandes[], ingredients: Ingredients[] }) => {
              setIsModalOpen(false);
              setModalResponse(values);
            }}
            options={{ "ingredients": listIngredients, "viandes": listViandes, "currentPlat": currentPlat }}  // Pass the current plat to the modal
          />
        </div>
      </div>
    </div>
  );
}
