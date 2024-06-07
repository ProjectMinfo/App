### README de la Page `LoginPage`

---

Ce README décrit les différentes fonctionnalités et composants de la page `LoginPage`. Cette page implémente une interface de connexion pour l'application web.

---

### Table des Matières

1. [Aperçu](#aperçu)
2. [Composants et Fonctions Principales](#composants-et-fonctions-principales)
    - [Gestion des États](#gestion-des-états)
    - [Composants Utilisés](#composants-utilisés)
    - [Fonctions de Gestion des Événements](#fonctions-de-gestion-des-événements)
3. [Types Utilisés](#types-utilisés)

---

### Aperçu

La page `LoginPage` fournit un formulaire de connexion où les utilisateurs peuvent entrer leur adresse email et leur mot de passe pour accéder à l'application. Elle vérifie la validité des informations fournies et tente une connexion via une API.

### Composants et Fonctions Principales

#### Gestion des États

Les états principaux utilisés dans ce composant sont les suivants :
- `email` : gère l'adresse email entrée par l'utilisateur.
- `password` : gère le mot de passe entré par l'utilisateur.
- `isVisible` : gère la visibilité du mot de passe.
- `emailInvalide` : gère l'état de validité de l'adresse email.
- `passwordInvalide` : gère l'état de validité du mot de passe.

```js
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isVisible, setIsVisible] = useState(false);
const [emailInvalide, setEmailInvalide] = useState(false);
const [passwordInvalide, setPasswordInvalide] = useState(false);
```

#### Composants Utilisés

Le composant utilise plusieurs autres composants pour construire le formulaire de connexion :
- `Card`, `CardHeader`, `Divider`, `CardBody`, `Input`, `Button`, `CardFooter` : pour structurer et styliser le formulaire.
- `EyeFilledIcon`, `EyeSlashFilledIcon` : pour les icônes de visibilité du mot de passe.
- `postLogin` : pour envoyer les informations de connexion à l'API.

#### Fonctions de Gestion des Événements

##### Validation des Entrées et Soumission du Formulaire

La fonction `handleSubmit` vérifie que l'email et le mot de passe sont valides. Si c'est le cas, elle envoie les informations de connexion à l'API.

```js
const handleSubmit = () => {
  // Check if email contains "@" and ends with "junia.com"
  if (password.length < 1) {
    setPasswordInvalide(true);
  }
  if (!email.includes("@") || !email.endsWith("junia.com")) {
    setEmailInvalide(true);
  }

  if (!emailInvalide || !passwordInvalide) {
    const login = { "email": email, "mdp": password };
    const fetchLogin =  postLogin(login);
    fetchLogin.then((response) => {
      if (window.localStorage.getItem('token') !== null && response.token !== null){
        window.location.href = '/';
      } else {
        alert("Erreur lors de la connexion");
      }
    });
  }
};
```

##### Gestion de la Visibilité du Mot de Passe

La fonction `toggleVisibility` permet de basculer entre l'affichage du mot de passe en clair et sous forme de points.

```js
const toggleVisibility = () => setIsVisible(!isVisible);
```

### Types Utilisés

Les types principaux utilisés dans ce composant sont définis ci-dessous :

```ts
interface LoginProps {
  email: string;
  mdp: string;
}
```

### Aperçu du Composant `LoginPage`

Le composant `LoginPage` est une carte contenant un formulaire de connexion avec des champs pour l'email et le mot de passe, ainsi qu'un bouton pour soumettre le formulaire.

#### Exemple de Rendu

```js
return (
  <Card className="w-96 m-auto my-[50%]">
    <CardHeader className="">
      <h1 className='font-bold text-lg'>Connexion</h1>
    </CardHeader>
    <Divider />
    <CardBody className="flex flex-col gap-8 mt-6">
      <Input
        isClearable
        type="email"
        label="Mail"
        variant="bordered"
        placeholder="Votre mail de connexion"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        isInvalid={emailInvalide}
        errorMessage="L'adresse mail doit être avoir un @ et finir par junia.com"
      />
      <Input
        label="Password"
        variant="bordered"
        placeholder="Votre mot de passe"
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        isInvalid={passwordInvalide}
        errorMessage="Le mot de passe est nécessaire"
      />
      <Button onClick={handleSubmit}>Se connecter</Button>
    </CardBody>
    <Divider className='mt-6' />
    <CardFooter>
      <p>Vous n'avez pas de compte ? <a href="/inscription" className='text-primary'>Inscrivez-vous</a></p>
    </CardFooter>
  </Card>
);
```
