### README de la Page `Navbarr`

---

Ce README décrit les différentes fonctionnalités et composants de la page `Navbarr`. Cette page implémente une barre de navigation latérale pour une application web.

---

### Table des Matières

1. [Aperçu](#aperçu)
2. [Composants et Fonctions Principales](#composants-et-fonctions-principales)
    - [Gestion des États](#gestion-des-états)
    - [Composants Utilisés](#composants-utilisés)
    - [Fonctions de Gestion des Événements](#fonctions-de-gestion-des-événements)
    - [Effet d'Initialisation](#effet-dinitialisation)
3. [Types Utilisés](#types-utilisés)

---

### Aperçu

La page `Navbarr` fournit une barre de navigation latérale qui permet aux utilisateurs de naviguer entre différentes pages de l'application. La barre de navigation est réactive et s'adapte aux différentes tailles d'écran.

### Composants et Fonctions Principales

#### Gestion des États

Les états principaux utilisés dans ce composant sont les suivants :
- `isDropdownOpen` : gère l'état d'ouverture du menu déroulant.
- `isNavOpen` : gère l'état d'ouverture de la barre de navigation sur les petits écrans.
- `dropdownRef` : une référence à l'élément du menu déroulant pour détecter les clics à l'extérieur.

```js
const [isDropdownOpen, setIsDropdownOpen] = useState(false);
const [isNavOpen, setIsNavOpen] = useState(false);
const dropdownRef = useRef<HTMLDivElement | null>(null);
```

#### Composants Utilisés

Le composant utilise plusieurs autres composants pour la navigation et les icônes :
- `usePathname` : pour obtenir le chemin actuel.
- `ChevronDown`, `MenuIcon`, `XIcon` : pour afficher les icônes du menu.
- `Link` : pour la navigation entre les pages.
- `ThemeSwitch` : pour le changement de thème.

#### Fonctions de Gestion des Événements

##### Détection de l'URL active

La fonction `isActive` vérifie si le chemin actuel correspond à celui passé en paramètre et applique une classe CSS spécifique pour indiquer l'élément actif.

```js
const isActive = (path: string) => activePath === path ? 'border-y-3 font-semibold' : '';
```

##### Gestion de l'ouverture/fermeture du menu déroulant

La fonction `toggleDropdown` change l'état d'ouverture du menu déroulant.

```js
const toggleDropdown = () => {
  setIsDropdownOpen(!isDropdownOpen);
};
```

##### Gestion des clics à l'extérieur

La fonction `handleClickOutside` ferme le menu déroulant si un clic est détecté à l'extérieur de celui-ci.

```js
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    setIsDropdownOpen(false);
  }
};
```

##### Gestion des clics sur les liens

La fonction `handleLinkClick` ferme le menu déroulant et la barre de navigation sur les petits écrans lorsqu'un lien est cliqué.

```js
const handleLinkClick = () => {
  setIsDropdownOpen(false);
  setIsNavOpen(false); // Fermer également la navbar en mode téléphone
};
```

#### Effet d'Initialisation

Cet effet ajoute un écouteur d'événements pour détecter les clics à l'extérieur du menu déroulant et nettoie l'écouteur lors de la destruction du composant.

```js
useEffect(() => {
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);
```

### Types Utilisés

Les types principaux utilisés dans ce composant sont définis ci-dessous :

```ts
type IconType = {
  chevron: JSX.Element;
  menu: JSX.Element;
  close: JSX.Element;
};
```

---

### Aperçu du Composant `Navbarr`

Le composant `Navbarr` est un menu de navigation latéral qui permet aux utilisateurs de naviguer entre différentes sections de l'application. Il inclut un menu déroulant pour les sections de gestion et s'adapte aux petits écrans avec un bouton de menu.

#### Exemple de Rendu

```js
return (
  <div className="flex z-50 max-md:w-0 w-1/6">
    {/* Navbar */}
    <div className={`fixed top-0 left-0 h-full bg-red-500  py-4 px-4 w-64 md:w-1/6 z-10 transform ${isNavOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 overflow-y-auto `}>
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-center h-32">
          <Link href="/" className="flex flex-col items-center justify-center space-y-2" onClick={handleLinkClick}>
            <img src="logo.png" alt="Logo" className="h-16 w-auto" />
            <h2 className=" text-4xl font-semibold">CHTI'MI</h2>
          </Link>
        </div>

        <div className="flex flex-col space-y-6 text-center text-lg">
          <div className={isActive('/commande')}>
            <Link href="/commande" onClick={handleLinkClick}>Commande</Link>
          </div>
          {/* autres liens */}
        </div>
      </div>
    </div>

    {/* Contenu principal */}
    <div className={`flex-1 p-4 md:ml-64 md:w-5/6`}>
      <div className="md:hidden fixed top-0 left-0 z-20 p-4">
        <button onClick={() => setIsNavOpen(!isNavOpen)}>
          {isNavOpen ? icons.close : icons.menu}
        </button>
      </div>
      {/* Placez ici le contenu de votre page */}
    </div>
  </div>
);
```
