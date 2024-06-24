'use client';

import React, { useState } from 'react';
import { Button } from "@nextui-org/button";
import { Card, CardHeader, Avatar, CardBody, CardFooter, Input } from "@nextui-org/react";
import { postCreateCompte } from '@/config/api';
import { Comptes } from '@/types';
import { EyeSlashFilledIcon } from '@/public/EyeSlashFilledIcon';
import { EyeFilledIcon } from '@/public/EyeFilledIcon';

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

function UserResponse({ userText, step }: { userText: string, step: number }) {

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

function UserInput({ userInput, onInputChange, onSendClick, placeholder, step }: { userInput: string, onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onSendClick: () => void, placeholder: string, step: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [errorMessages, setErrorMessages] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);

  function isReady(){
    // console.log("step", step, "userInput", userInput);    

    // step 0 = on s'en fout
    // step 1 = email
    // step 2 = promo
    // step 3 = password

    if (userInput.trim() === "") {
      setErrorMessages("Ce champ ne peut pas être vide")
      setIsInvalid(true)
      return true;
    }

    if (step === 1){
      if (userInput.includes("@") && userInput.endsWith("junia.com")){
        setIsInvalid(false)
        return onSendClick()
      }
      setErrorMessages("L'adresse mail doit être avoir un @ et finir par junia.com")
      setIsInvalid(true)
      return true
    }
    if (step === 2){
      if (userInput.trim() === "" || isNaN(parseInt(userInput))) {
        setErrorMessages("Le numéro de promo doit être un nombre")
        setIsInvalid(true)
        return true;
      }
      setIsInvalid(false)
      return onSendClick()
    }
    if (step === 3){
      if (userInput.trim().length < 4){
        setErrorMessages("Le mot de passe doit faire au moins 4 caractères")
        setIsInvalid(true)
        return true;
      }
      setIsInvalid(false)
      return onSendClick();
    }
    setIsInvalid(false)
    return onSendClick()
  }

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

          {step !== 3 ? (
            <Input 
            value={userInput} 
            onChange={onInputChange} 
            placeholder={placeholder} 
            isInvalid={isInvalid}
            errorMessage={errorMessages}
            />
          ) : (
            <Input
              variant="bordered"
              placeholder={placeholder}
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              value={userInput}
              onChange={onInputChange}
              className=""
              isInvalid={isInvalid}
              errorMessage={errorMessages}
            />
          )}


        </CardBody>
        <CardFooter className="gap-3 justify-end">
          <div className="flex gap-2">
            <Button onPress={isReady} className="text-small justify-end item-end hover:text-primary-500">
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
          lancelotText = "On a besoin d'une adresse mail pour te connecter ! Quel est ton adresse mail Junia ?";
          break;
        case 1:
          lancelotText = "Ton numéro de promo (ou pas) ?";
          break;
        case 2:
          lancelotText = "Et ton mot de passe (pas nécessairement le mdp Junia) ?";
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


  if (step === 4) {
    const userResponse = messages.filter(message => message.sender === "User").map(message => message.text);

    const email = userResponse[1];
    const promo = userResponse[2];
    const password = userResponse[3];

    const firstName = email.split(".")[0];
    const lastName = email.split(".")[1].split("@")[0];

    const newUser: Comptes = {
      "acces": 0,
      "email": email,
      "mdp": password,
      "montant": 0,
      "nom": lastName,
      "numCompte": -1, // This field is not used in the API
      "prenom": firstName,
      "promo": parseInt(promo),
      "resetToken": "",
      "tokenExpiration": ""
    };
    // console.log(newUser);
    

    postCreateCompte(newUser);
  }


  return (
    <div className="flex flex-col gap-1 px-10 max-md:px-2">
      {messages.map((message, index) => (
        message.sender === "Lancelot" ? (
          <LancelotResponse key={index} lancelotText={message.text} />
        ) : (
          index !== 7 ? (
            <UserResponse key={index} userText={message.text} step={step} />
          ) : (
            <UserResponse key={index} userText={"*".repeat(Number(message.text.length))} step={step} />
          )
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
                    step === 2 ? "Ton numéro de promo ?" :
                      "Et ton mot de passe ?"
          }
          step={step}
        />
      ) : (null)}
      {/* <SchoolSelection onSelectSchool={handleSelectSchool} /> */}
      {/* ) : null */}
      {/* )} */}
    </div>
  );
}
