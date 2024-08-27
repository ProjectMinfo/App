'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { getBoissons, getEventMode, getIngredients, getIngredientsExtras, getMenus, getPlats, getSnacks, getViandes } from "@/config/api";
import { Ingredients, Menus, Plats, Snacks, Boissons, Viandes } from "@/types/index";
import DetailCommandeModal from "@/components/DetailCommandeModal";
import Paiement from '@/components/paiement';
import { Card, CardHeader, CardBody } from '@nextui-org/react';
import ListeComptesModal from '@/components/listeCompteModal';
import ListeCommandeModal from '@/components/listeCommandeModal';
import { RecapComponent } from '@/components/CommandeCompos';
import GestionBaguetteModal from '@/components/GestionBaguettesModal';


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
  remainingPerifs: number;
  currentMenu?: NewMenus;
};


type AllType = NewMenus | NewPlats | NewSnacks | NewBoissons | { type: "other" } | { type: "end" } | Menus | Plats | Snacks | Boissons;

export default function ChatPage() {

  const [listMenus, setListMenus] = useState<Menus[]>([]);
  const [listPlats, setListPlats] = useState<Plats[]>([]);
  const [listIngredients, setIngredients] = useState<Ingredients[] | Viandes[]>([]);
  const [listViandes, setViandes] = useState<Viandes[]>([]);
  const [listSnacks, setListSnacks] = useState<Snacks[]>([]);
  const [listBoissons, setListBoissons] = useState<Boissons[]>([]);
  const [listExtras, setListExtras] = useState<Ingredients[]>([]);

  const [allBaguetteId, setAllBaguetteId] = useState<Ingredients>();
  const [newBaguetteId, setNewBaguetteId] = useState<Ingredients>();

  const [eventMode, setEventMode] = useState<boolean>(false);


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

  const [serveur, isServeur] = useState<boolean>(false);

  const [isModalCompteOpen, setIsModalCompteOpen] = useState<boolean>(false);
  const [isModalCommandeOpen, setIsModalCommandeOpen] = useState<boolean>(false);
  const [isModalBaguetteOpen, setIsModalBaguetteOpen] = useState<boolean>(false);



  // Fetch data
  useEffect(() => {
    async function fetchData() {
      const [fetchedMenus, fetchedPlats, fetchedExtras, fetchedIngredients, fetchedViandes, fetchedSnacks, fetchedBoissons, fetchedEventMode] = await Promise.all([
        getMenus(),
        getPlats(),
        getIngredientsExtras(),
        getIngredients(),
        getViandes(),
        getSnacks(),
        getBoissons(),
        getEventMode(),
      ]);
      setListMenus(fetchedMenus);
      setListPlats(fetchedPlats);
      setListExtras(fetchedExtras);
      setIngredients(fetchedIngredients);
      setViandes(fetchedViandes);
      setListSnacks(fetchedSnacks);
      setListBoissons(fetchedBoissons);
      setEventMode(fetchedEventMode);
    }
    fetchData();
  }, [repas]);

  // Gestion des réponses du modal pour les plats
  useEffect(() => {
    if (modalResponse && modalResponse.viandes && modalResponse.ingredients && modalResponse.extras) {
      const nextRepas = { ...repas };
      const resultIngredients = [...modalResponse.ingredients, ...modalResponse.viandes, ...modalResponse.extras];

      // console.log(resultIngredients);
      
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

  useEffect(() => {
    if (listIngredients) {
      const baguette = listIngredients.find((ingredient) => ingredient.nom === "Baguette Fraiche");
      if (baguette) {
        setNewBaguetteId(baguette);
      }
      const allBaguette = listIngredients.find((ingredient) => ingredient.nom === "Baguette Totale");
      if (allBaguette) {
        setAllBaguetteId(allBaguette);
      }
      // console.log("Baguette Fraiche", baguette, "Baguette Totale", allBaguette);
    }
  }, [listIngredients]);


  // Ajout des items dans le repas
  const handleSetRepasItem = useCallback((type: keyof NewRepas, item: AllType) => {
    const newRepas: NewRepas = { ...repas };

    switch (item.type) {
      case "menu":
        newRepas.menu.push(item);
        newRepas.currentMenu = item
        newRepas.remainingPlats = item.menu.quantitePlat;
        newRepas.remainingPerifs = item.menu.quantiteBoisson + item.menu.quantiteSnack;
        setCurrentMenuId(item.menuId);
        setIsMenuDone(false);
        break;
      case "plat":
        if (!isMenuDone) {
          newRepas.remainingPlats -= 1;
          const platInMenu = { ...item, id: Date.now() }; // Assign a unique id using Date.now()
          platInMenu.plat.prix = 0;
          platInMenu.plat.prixServeur = 0;
          platInMenu.menuId = currentMenuId;
          setCurrentPlat(platInMenu);  // Set the current plat before opening the modal
          setIsModalOpen(true);
        }
        else {
          const platItem = { ...item, id: Date.now() }; // Assign a unique id using Date.now()
          setCurrentPlat(platItem);  // Set the current plat before opening the modal
          setIsModalOpen(true);
        }
        break;
      case "snack":
        if (!isMenuDone) {
          newRepas.remainingPerifs -= 1;
          const snackInMenu = { ...item, id: Date.now() }; // Assign a unique id using Date.now()
          snackInMenu.snack.prix = 0;
          snackInMenu.snack.prixServeur = 0;
          snackInMenu.menuId = currentMenuId;

          newRepas.snack.push(snackInMenu);
        }
        else {
          const snackItem = { ...item, id: Date.now() }; // Assign a unique id using Date.now()
          newRepas.snack.push(snackItem);
        }
        break;
      case "boisson":
        if (!isMenuDone) {
          newRepas.remainingPerifs -= 1;
          const boissonInMenu = { ...item, id: Date.now() }; // Assign a unique id using Date.now()
          boissonInMenu.boisson.prix = 0;
          boissonInMenu.boisson.prixServeur = 0;
          boissonInMenu.menuId = currentMenuId;
          newRepas.boisson.push(boissonInMenu);
        }
        else {
          const boissonItem = { ...item, id: Date.now() }; // Assign a unique id using Date.now()
          newRepas.boisson.push(boissonItem);
        }
        break;
    }

    // Check if the menu is complete
    if (newRepas.remainingPlats <= 0 && newRepas.remainingPerifs <= 0) {
      setIsMenuDone(true);
    }

    setRepas(newRepas);
    setCurrentStep(getNextStep(item, newRepas));
  }, [repas]);

  const getNextStep = (item: AllType, repas: NewRepas): string => {
    if (repas.remainingPlats > 0) {
      return "plat";
    } else {
      return "other";
    }
  };

  function handleDeleteItem(type: keyof NewRepas, item: AllType) {
    const newRepas: NewRepas = { ...repas };
    const itemIndex = newRepas[type].findIndex((currentItem) => currentItem.id === item.id);

    if (type === "menu") {
      // console.log("delete menu");

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

  function handleAddItem(type: keyof NewRepas, item: AllType) {
    const newRepas: NewRepas = { ...repas };
    item.id = Date.now();
    newRepas[type].push(item);
    setRepas(newRepas);
    setCurrentStep(getNextStep(item, newRepas));
  }


  function ChatNext({ repas, setRepasItem, currentStep, setCurrentStep }: { repas: NewRepas, setRepasItem: (type: keyof NewRepas, item: AllType) => void, currentStep: string, setCurrentStep: (step: string) => void }) {
    if (repas.remainingPlats > 0) {
      return <ChatPlat setRepas={item => setRepasItem("plat", item)} />;
    }
    // else if (repas.remainingSnacks > 0) {
    //   return <ChatSnack setRepas={item => setRepasItem("snack", item)} />;
    // }
    // else if (repas.remainingBoissons > 0) {
    //   return <ChatBoisson setRepas={item => setRepasItem("boisson", item)} />;
    // }
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


  function ChatOption({ setRepas, type, items }: { setRepas: (item: AllType) => void, type: keyof NewRepas, items: AllType[] }) {
    const id = Math.floor(Math.random() * 1000) + 1;
    // créer une copie de "items" pour ne pas modifier l'original
    const newItems = [...items];
    const options = newItems.map((item) => ({ id: id, type: type, [type]: item }));

    // console.log("options", options);


    return (
      <ChatLayout
        buttons={options}
        setRepas={setRepas}
      />
    );
  }

  function ChatMenu({ setRepas }: { setRepas: (item: AllType) => void }) {
    return <ChatOption setRepas={setRepas} type="menu" items={listMenus} />;
  }

  function ChatPlat({ setRepas }: { setRepas: (item: AllType) => void }) {
    return <ChatOption setRepas={setRepas} type="plat" items={listPlats} />;
  }

  function ChatSnack({ setRepas }: { setRepas: (item: AllType) => void }) {
    return <ChatOption setRepas={setRepas} type="snack" items={listSnacks} />;
  }

  function ChatBoisson({ setRepas }: { setRepas: (item: AllType) => void }) {
    return <ChatOption setRepas={setRepas} type="boisson" items={listBoissons} />;
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
      <div className="flex flex-col gap-4 ">
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

    return (
      <div>
        <Paiement repas={repas} allViandes={allViandes} serveurView={true} prixServeur={serveur} />
      </div>
    );
  }

  function ChatLayout({ buttons, setRepas }: { who: string, mainSentence: string, buttons: AllType[] | OtherOption[], setRepas: (choice: AllType | OtherOption) => void }) {
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);

    const handleButtonClick = (choice: AllType | OtherOption) => {
      setRepas(choice);
      setButtonClicked(true);
    };

    return (
      <div className="flex flex-col gap-4">
        {buttons && buttons.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {buttons
              .filter(button =>
                "menu" in button ? button.menu && button.menu.dispo :
                  "plat" in button ? button.plat && button.plat.dispo :
                    "snack" in button ? button.snack && button.snack.dispo :
                      "boisson" in button ? button.boisson && button.boisson.dispo : false
              ).filter(button =>
                "menu" in button ? button.menu.event == eventMode :
                  "plat" in button ? button.plat.event == eventMode :
                    "snack" in button ? button.snack :
                      "boisson" in button ? button.boisson : (null))
              .map((button, index) => (
                <Button
                  key={index}
                  color={"default"}
                  variant={"solid"}
                  className={"font-medium"}
                  onClick={() => handleButtonClick(button)}
                  isDisabled={buttonClicked}
                >
                  {"menu" in button ? button.menu.nom :
                    "plat" in button ? button.plat.nom :
                      "snack" in button ? button.snack.nom :
                        "boisson" in button ? button.boisson.nom :
                          "label" in button ? button.label : ""}
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
    <>
      <h1 className={title()}>Prise de commande </h1>
      <div className="flex justify-center min-h-screen mt-10 max-md:mt-0">
        <div className="flex flex-row max-md:flex-col w-5/6 h-3/4 ">
          <div className="flex-1 m-4 grid">
            <div className="flex flex-col gap-16 max-md:gap-6">
              <ChatNext
                repas={repas}
                setRepasItem={handleSetRepasItem}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
              <Card className="max-w-full">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Options serveur</h2>
                </CardHeader>
                <CardBody className='flex flex-col gap-4'>

                  <Button
                    color="default"
                    variant="solid"
                    onClick={() => setIsModalCommandeOpen(!isModalCommandeOpen)}
                  >
                    Commande en cours
                  </Button>

                  <Button
                    color="default"
                    variant="faded"
                    onClick={() => setIsModalBaguetteOpen(!isModalBaguetteOpen)}
                  // isDisabled
                  >
                    Baguettes fraiches : {newBaguetteId ? newBaguetteId.quantite : 0}  / totales : {allBaguetteId ? allBaguetteId.quantite : 0}
                  </Button>

                  <Button
                    color="default"
                    variant="faded"
                    onClick={() => setIsModalCompteOpen(!isModalCompteOpen)}
                  >
                    Listes des comptes
                  </Button>

                  <Button
                    // color="default"
                    variant="faded"
                    onClick={() => isServeur(!serveur)}
                    className={serveur ? "bg-red-500" : ""}
                  >
                    Serveur ?  {serveur ? "(Oui)" : "(Non)"}
                  </Button>
                </CardBody>
              </Card>
              {isModalCompteOpen && (
                <ListeComptesModal
                  isOpen={isModalCompteOpen}
                  onClose={() => setIsModalCompteOpen(false)}
                />
              )}
              {isModalCommandeOpen && (
                <ListeCommandeModal
                  isOpen={isModalCommandeOpen}
                  onClose={() => setIsModalCommandeOpen(false)}
                />
              )}
              {isModalBaguetteOpen && (
                <GestionBaguetteModal
                  isOpen={isModalBaguetteOpen}
                  onClose={(newBaguette, allBaguette) => {
                    setIsModalBaguetteOpen(false);
                    setNewBaguetteId(newBaguette);
                    setAllBaguetteId(allBaguette);
                  }}
                  nbBaguette={newBaguetteId}
                  nbAllBaguette={allBaguetteId}
                />
              )}
            </div>
          </div>

          <div className="w-1 border-r-2 mx-2"></div>

          <div className="flex-1 m-4 justify-end text-right max-md:grid max-md:justify-center">
            <RecapComponent handleDeleteItem={handleDeleteItem} repas={repas} isServeur={serveur} handleAddItem={handleAddItem} />
            <DetailCommandeModal
              isOpen={isModalOpen}
              onClose={(values: { viandes: Viandes[], ingredients: Ingredients[] }) => {
                setIsModalOpen(false);
                setModalResponse(values);
              }}
              options={{ "ingredients": listIngredients, "extras": listExtras, "viandes": listViandes, "currentPlat": {...currentPlat} }}  // Pass the current plat to the modal
            />

          </div>
        </div>
      </div>
    </>
  );
}
