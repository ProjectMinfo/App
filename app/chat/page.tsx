'use client';
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { useState, useEffect } from "react";
import { getCartes } from "@/config/api";
import { Carte, Repas, ChatLayoutProps, ChatMenuProps } from "@/types/index"; // Assurez-vous que les types sont correctement importés

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

  useEffect(() => {
    async function fetchCartes() {
      const fetchedCartes = await getCartes();
      setCartes(fetchedCartes);
    }
    fetchCartes();
  }, []);

  return (
    <div className="flex">
      <div className="w-2/3">
        {/* Chat section */}
        <h1 className={title()}>Commande !</h1>
        <ChatNext repas={repas} cartes={cartes} setRepas={setRepas} />
      </div>
      <div className="w-1/3 p-4">
        {/* Récapitulatif section */}
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

function ChatNext({ repas, cartes, setRepas }: ChatMenuProps) {
  if (repas.menu.length === 0) {
    return <ChatMenu cartes={cartes} repas={repas} setRepas={(item) => setRepasItem(repas, setRepas, "menu", item)} />;
  }
  if (repas.plat.length === 0) {
    return <ChatPlat cartes={cartes} repas={repas} setRepas={(item) => setRepasItem(repas, setRepas, "plat", item)} />;
  }
  if (repas.snack.length === 0) {
    return <ChatSnack cartes={cartes} repas={repas} setRepas={(item) => setRepasItem(repas, setRepas, "snack", item)} />;
  }
  if (repas.boisson.length === 0) {
    return <ChatBoisson cartes={cartes} repas={repas} setRepas={(item) => setRepasItem(repas, setRepas, "boisson", item)} />;
  }
  return <ChatOther cartes={cartes} repas={repas} setRepas={setRepas} />;
}

function setRepasItem(repas: Repas, setRepas: (repas: Repas) => void, type: keyof Repas, item: string) {
  const newRepas = { ...repas };
  if (type === "menu" || type === "plat" || type === "snack" || type === "boisson") {
    newRepas[type].push(item);
  }
  setRepas(newRepas);
}

function ChatLayout({ who, mainSentence, buttons, nextChat, setRepas }: ChatLayoutProps) {
  const [showNextChat, setShowNextChat] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleButtonClick = (choice: string) => {
    setRepas(choice);
    setShowNextChat(true);
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
      {showNextChat && nextChat}
    </div>
  );
}

function ChatMenu({ cartes, repas, setRepas }: ChatMenuProps) {
  const menu = cartes.filter((carte) => carte.ref === "Menu").map((carte) => carte.nom);
  menu.push("Pas de menu");

  return (
    <ChatLayout
      who="Lancelot"
      mainSentence="Bonjour ! Que souhaites-tu aujourd'hui ?"
      buttons={menu}
      nextChat={<ChatNext cartes={cartes} repas={repas} setRepas={setRepas} />}
      setRepas={setRepas}
    />
  );
}

function ChatPlat({ cartes, repas, setRepas }: ChatMenuProps) {
  const plat = cartes.filter((carte) => carte.ref === "Plat").map((carte) => carte.nom);
  plat.push("Pas de plat");

  return (
    <ChatLayout
      who="Lancelot"
      mainSentence="C'est noté ! Et avec quoi ?"
      buttons={plat}
      nextChat={<ChatNext cartes={cartes} repas={repas} setRepas={setRepas} />}
      setRepas={setRepas}
    />
  );
}

function ChatSnack({ cartes, repas, setRepas }: ChatMenuProps) {
  const snack = cartes.filter((carte) => carte.ref === "Snack").map((carte) => carte.nom);
  snack.push("Pas de snack");

  return (
    <ChatLayout
      who="Lancelot"
      mainSentence="C'est noté ! Et avec quoi ?"
      buttons={snack}
      nextChat={<ChatNext cartes={cartes} repas={repas} setRepas={setRepas} />}
      setRepas={setRepas}
    />
  );
}

function ChatBoisson({ cartes, repas, setRepas }: ChatMenuProps) {
  const boisson = cartes.filter((carte) => carte.ref === "Boisson").map((carte) => carte.nom);
  boisson.push("Pas de boisson");

  return (
    <ChatLayout
      who="Lancelot"
      mainSentence="C'est noté ! Et avec quoi ?"
      buttons={boisson}
      nextChat={<ChatNext cartes={cartes} repas={repas} setRepas={setRepas} />}
      setRepas={setRepas}
    />
  );
}

function ChatOther({ cartes, repas, setRepas }: ChatMenuProps) {
  const options = ["Plat", "Snack", "Boisson", "Rien !"];

  return (
    <ChatLayout
      who="Lancelot"
      mainSentence="C'est noté ! Et avec quoi ?"
      buttons={options}
      nextChat={<ChatNext cartes={cartes} repas={repas} setRepas={setRepas} />}
      setRepas={setRepas}
    />
  );
}

function ChatEnd({ cartes, repas }: ChatMenuProps) {
  return (
    <ChatLayout
      who="Lancelot"
      mainSentence={`Parfait ! Ta commande est bientôt prête ! Voici ta commande : ${repas.join()}`}
      setRepas={() => {}}
    />
  );
}
