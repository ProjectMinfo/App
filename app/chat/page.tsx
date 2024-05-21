'use client';
import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";
import { useState } from "react";


export function ChatLayout(mainSentence: string, buttons?: string[], nextChat?: JSX.Element) {
  const [showNextChat, setShowNextChat] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  const handleButtonClick = () => {
    setShowNextChat(true);
    setButtonClicked(true);
  };

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h2 className="text-lg font-bold">Lancelot</h2>
      </div>
      <p className="text-default-900">
        {mainSentence}
      </p>
      {buttons && buttons.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {buttons.map((button) => (
            <Button onClick={handleButtonClick} isDisabled={buttonClicked}>
              {button}
            </Button>
          ))}
        </div>
      )}
      {showNextChat && nextChat}
    </div>
  );
}


export function ChatMenu() {
  return ChatLayout("Bonjour ! Que souhaites-tu aujourd'hui ?", ["Une pizza", "Une frite"], ChatPlat());
}


export function ChatPlat() {
  return ChatLayout("C'est noté ! Et avec quoi ?", ["Du ketchup", "De la mayo"], ChatEnd());
}

export function ChatEnd() {
  return ChatLayout("Parfait ! Ta commande est bientôt prête !");
}

export default function ChatPage() {
  return (
    <div>
      {/* fais moi une discussion, avec zone de texte, de réponse, et exemple de discussion */}
      <h1 className={title()}>Commande !</h1>
      <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <div className="flex flex-col gap-4">
            <ChatMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
