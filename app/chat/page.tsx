'use client';
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { useState, useEffect } from "react";
import { getCartes } from "@/config/api";
import { Carte, Repas, ChatLayoutProps, ChatMenuProps } from "@/types/index";

export default function ChatPage() {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [repas, setRepas] = useState<Repas>({
    menu: [] as string[],
    plat: [] as string[],
    snack: [] as string[],
    boisson: [] as string[],
    complete: false,
    join: "" as any,
  });
  const [currentStep, setCurrentStep] = useState("menu");

  useEffect(() => {
    async function fetchCartes() {
      const fetchedCartes = await getCartes();
      setCartes(fetchedCartes);
    }
    fetchCartes();
  }, []);

  const handleSetRepasItem = (type: keyof Repas, item: string) => {
    const newRepas = { ...repas };
    if (type === "menu" || type === "plat" || type === "snack" || type === "boisson") {
      newRepas[type].push(item);
    }
    if (type === "boisson" ) {
      newRepas.complete = true;
      console.log("TOUPYOUPI");
      
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
    <div className="flex">
      <div className="w-2/3">
        <h1 className={title()}>Commande !</h1>
        <ChatNext 
          repas={repas} 
          cartes={cartes} 
          setRepasItem={handleSetRepasItem} 
          currentStep={currentStep}
          setCurrentStep={setCurrentStep} 
        />
      </div>
      <div className="w-1/3 p-4">
        <RecapComponent repas={repas} />
      </div>
    </div>
  );
}

function RecapComponent({ repas }: { repas: Repas }) {
  return (
    <div>
      <h2 className="text-lg font-bold gap-4 mb-4">Récapitulatif de la commande :</h2>
      <ul>
        <li><b>Menu:</b> {repas.menu.join(", ") || "Pas de menu"}</li>
        <li><b>Plat:</b> {repas.plat.join(", ") || "Pas de plat"}</li>
        <li><b>Snack:</b> {repas.snack.join(", ") || "Pas de snack"}</li>
        <li><b>Boisson:</b> {repas.boisson.join(", ") || "Pas de boisson"}</li>
      </ul>
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
      return <ChatOther cartes={cartes} setCurrentStep={setCurrentStep} />;
    case "end":
      return <ChatEnd repas={repas} cartes={[]} setRepas={function (repas: string): void {
        throw new Error("Function not implemented.");
      } } />;
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
      <p>Parfait ! Ta commande est bientôt prête ! Voici ta commande :</p>
      <ul>
        <li><b>Menu:</b> {repas.menu.join(", ") || "Pas de menu"}</li>
        <li><b>Plat:</b> {repas.plat.join(", ") || "Pas de plat"}</li>
        <li><b>Snack:</b> {repas.snack.join(", ") || "Pas de snack"}</li>
        <li><b>Boisson:</b> {repas.boisson.join(", ") || "Pas de boisson"}</li>
      </ul>
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
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="text-lg font-bold">{who}</h2>
      </div>
      <p className="text-default-900">{mainSentence}</p>
      {buttons && buttons.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {buttons.map((button) => (
            <Button key={button} onClick={() => handleButtonClick(button)} isDisabled={buttonClicked}>
              {button}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
