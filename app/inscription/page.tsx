'use client';

import React, { useState } from 'react';
import { Button } from "@nextui-org/button";
import { Card, CardHeader, Avatar, CardBody, CardFooter, Input } from "@nextui-org/react";

function LancelotResponse({ lancelotText }: { lancelotText: string }) {
  return (
    <Card className="w-full max-w-sm justify-start">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar size="md" src="logo.png" />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-800">Lancelot</h4>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-3 text-default-500">
        <p>
          {lancelotText}
        </p>
      </CardBody>
    </Card>
  );
}

function UserResponse({ userText }: { userText: string }) {
  return (
    <div className="flex flex-col gap-8 items-end">
      <Card className="w-full max-w-sm">
        <CardHeader className="justify-end">
          <div className="flex gap-5">
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">Toi</h4>
            </div>
            <Avatar isBordered radius="full" size="md" src="" />
          </div>
        </CardHeader>
        <CardBody className="px-3 text-default-400">
          <Input value={userText} isDisabled={true} />
        </CardBody>
      </Card>
    </div>
  );
}

function UserInput({ userInput, onInputChange, onSendClick, placeholder }: { userInput: string, onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onSendClick: () => void, placeholder: string }) {
  return (
    <div className="flex flex-col gap-8 items-end">
      <Card className="w-full max-w-sm">
        <CardHeader className="justify-end">
          <div className="flex gap-5">
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">Toi</h4>
            </div>
            <Avatar isBordered radius="full" size="md" src="" />
          </div>
        </CardHeader>
        <CardBody className="px-3 py-0 text-default-400">
          <Input value={userInput} onChange={onInputChange} placeholder={placeholder} />
        </CardBody>
        <CardFooter className="gap-3 justify-end">
          <div className="flex gap-2">
            <Button onPress={onSendClick} className="text-small justify-end item-end hover:text-primary-500">
              Envoyer
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function SchoolSelection({ onSelectSchool }: { onSelectSchool: (school: string) => void }) {
  const schools = ["ISEN", "HEI", "ISA", "Autre"];
  return (
    <div className="flex flex-col gap-8 items-end">
      <Card className="w-full max-w-sm">
        <CardHeader className="justify-end">
          <div className="flex gap-5">
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">Toi</h4>
            </div>
            <Avatar isBordered radius="full" size="md" src="" />
          </div>
        </CardHeader>
        <CardBody className="px-3 py-0 text-default-400 text-center">
          <p>
            Veuillez sélectionner votre école:
          </p>
        </CardBody>
        <CardFooter className="gap-3 justify-center">
          <div className="flex gap-2">
            <div className="flex gap-2">
              {schools.map(school => (
                <Button key={school} onPress={() => onSelectSchool(school)}>
                  {school}
                </Button>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function InscriptionPage() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "Lancelot", text: "Bonjour, je suis Lancelot, ton futur cornet préféré ! Comment vas-tu aujourd'hui ?" },
  ]);
  const [step, setStep] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSendClick = () => {
    if (userInput.trim()) {
      const newMessages = [...messages, { sender: "User", text: userInput }];
      setMessages(newMessages);
      setUserInput("");
      setStep(step + 1);

      // Simulate Lancelot's response based on the current step
      let lancelotText = "";
      switch (step) {
        case 0:
          lancelotText = "Quel est votre email Junia ?";
          break;
        case 1:
          lancelotText = "Quel est votre prénom ?";
          break;
        case 2:
          lancelotText = "Quel est votre nom ?";
          break;
        case 3:
          lancelotText = "Veuillez sélectionner votre école :";
          break;
        default:
          lancelotText = "Merci pour votre inscription !";
          break;
      }
      setMessages([...newMessages, { sender: "Lancelot", text: lancelotText }]);
    }
  };

  const handleSelectSchool = (school: string) => {
    const newMessages = [...messages, { sender: "User", text: school }];
    setMessages(newMessages);
    setStep(step + 1);

    // Simulate Lancelot's response after school selection
    setMessages([...newMessages, { sender: "Lancelot", text: "Merci pour votre inscription !" }]);
  };

  return (
    <div className="flex flex-col gap-8">
      {messages.map((message, index) => (
        message.sender === "Lancelot" ? (
          <LancelotResponse key={index} lancelotText={message.text} />
        ) : (
          <UserResponse key={index} userText={message.text} />
        )
      ))}
      {step < 4 ? (
        <UserInput
          userInput={userInput}
          onInputChange={handleInputChange}
          onSendClick={handleSendClick}
          placeholder={
            step === 0 ? "Comment vas-tu aujourd'hui ?" :
              step === 1 ? "Quel est ton mail JUNIA ?" :
                step === 2 ? "Ton beau prénom ?" :
                  "Et ton magnifique nom ?"
          }
        />
      ) : ( step === 4 ? (
        <SchoolSelection onSelectSchool={handleSelectSchool} />
      ) : null
      )}
    </div>
  );
}
