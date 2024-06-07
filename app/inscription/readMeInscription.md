### README pour la page d'inscription

La page d'inscription est conçue pour permettre aux utilisateurs de créer un compte en utilisant un chatbot interactif nommé Lancelot. Voici une explication détaillée des différentes fonctions et composants utilisés dans cette page.

#### Composants et Fonctions

1. **Composants Importés**

   - **React Hooks** : Utilisation de `useState` pour gérer l'état local de la page.
   - **NextUI Components** : Utilisation des composants de NextUI pour créer une interface utilisateur agréable et interactive, tels que `Card`, `CardHeader`, `Avatar`, `CardBody`, `CardFooter`, et `Input`.
   - **API Calls** : Utilisation de la fonction `postCreateCompte` pour envoyer les données d'inscription à l'API.

2. **Fonction `LancelotResponse`**

   Cette fonction est utilisée pour afficher les messages de Lancelot dans une carte.
   ```javascript
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
           <p>{lancelotText}</p>
         </CardBody>
       </Card>
     );
   }
   ```

3. **Fonction `UserResponse`**

   Cette fonction est utilisée pour afficher les réponses de l'utilisateur dans une carte.
   ```javascript
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
   ```

4. **Fonction `UserInput`**

   Cette fonction gère l'entrée utilisateur et affiche une carte avec un champ de saisie et un bouton d'envoi.
   ```javascript
   function UserInput({ userInput, onInputChange, onSendClick, placeholder, step }: { userInput: string, onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onSendClick: () => void, placeholder: string, step: number }) {
     const [isVisible, setIsVisible] = useState(false);
     const toggleVisibility = () => setIsVisible(!isVisible);

     const [errorMessages, setErrorMessages] = useState("");
     const [isInvalid, setIsInvalid] = useState(false);

     function isReady() {
       if (userInput.trim() === "") {
         setErrorMessages("Ce champ ne peut pas être vide");
         setIsInvalid(true);
         return true;
       }
       if (step === 1) {
         if (userInput.includes("@") && userInput.endsWith("junia.com")) {
           setIsInvalid(false);
           return onSendClick();
         }
         setErrorMessages("L'adresse mail doit être avoir un @ et finir par junia.com");
         setIsInvalid(true);
         return true;
       }
       if (step === 2) {
         if (userInput.trim() === "" || isNaN(parseInt(userInput))) {
           setErrorMessages("Le numéro de promo doit être un nombre");
           setIsInvalid(true);
           return true;
         }
         setIsInvalid(false);
         return onSendClick();
       }
       if (step === 3) {
         if (userInput.trim().length < 4) {
           setErrorMessages("Le mot de passe doit faire au moins 4 caractères");
           setIsInvalid(true);
           return true;
         }
         setIsInvalid(false);
         return onSendClick();
       }
       setIsInvalid(false);
       return onSendClick();
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
   ```

5. **Composant Principal `InscriptionPage`**

   Le composant principal de la page d'inscription gère l'état global, les messages, et les étapes du chatbot.
   ```javascript
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

         let lancelotText = "";
         switch (step) {
           case 0:
             lancelotText = "Quel est votre email Junia ?";
             break;
           case 1:
             lancelotText = "Ton numéro de promo ?";
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
         "numCompte": -1,
         "prenom": firstName,
         "promo": parseInt(promo),
         "resetToken": "",
         "tokenExpiration": ""
       };

       postCreateCompte(newUser);
     }

     return (
       <div className="flex flex-col gap-1">
         {messages.map((message, index) => (
           message.sender === "Lancelot" ? (
             <LancelotResponse key={index} lancelotText={message.text} />
           ) : (
             index !== 7 ? (
               <UserResponse key={index} userText={message.text} step={step} />
             ) : (
               <UserResponse

 key={index} userText={"*".repeat(Number(message.text.length))} step={step} />
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
       </div>
     );
   }
   ```

#### Utilisation de l'API

La fonction `postCreateCompte` est utilisée pour envoyer les données d'inscription à l'API. Voici un exemple de cette fonction :

```javascript
export const postCreateCompte = async (data: any) => {
  try {
    const response = await api.post('/user', JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.status === 201) {
      window.localStorage.setItem('password', data.mdp);
      window.localStorage.setItem('email', data.email);
      window.localStorage.setItem('user', JSON.stringify(data));
      return response.data;
    } else {
      throw new Error('Error creating compte');
    }
  } catch (error) {
    console.error('Error creating compte:', error);
    throw error;
  }
};
```

Cette fonction envoie les données de l'utilisateur sous forme JSON à l'endpoint `/user` de l'API. Si la création du compte réussit, les informations de l'utilisateur sont stockées dans le `localStorage`.

#### Types Utilisés

Voici les types et interfaces utilisés dans la page d'inscription :

```typescript
export interface Comptes {
  acces: number;
  email: string;
  mdp: string;
  montant: number;
  nom: string;
  numCompte: number;
  prenom: string;
  promo: number;
  resetToken: string;
  tokenExpiration: string;
}
```

Ces types définissent la structure des données de l'utilisateur et sont utilisés pour garantir que les données manipulées sont cohérentes et valides.

### Conclusion

Cette page d'inscription utilise un chatbot interactif pour guider l'utilisateur à travers le processus d'inscription. Les composants NextUI sont utilisés pour créer une interface utilisateur fluide et réactive, et les appels API permettent de communiquer avec le backend pour stocker les données de l'utilisateur. Cette combinaison de technologies permet de créer une expérience utilisateur agréable et efficace.