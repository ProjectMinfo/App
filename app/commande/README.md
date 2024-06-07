### README de la Page `ChatPage`

---

Ce README décrit les différentes fonctionnalités et composants de la page `ChatPage`. La page permet aux utilisateurs de sélectionner des éléments de menu, de plats, de boissons, et de snacks, puis de passer une commande.

---

### Table des Matières

1. [Aperçu](#aperçu)
2. [Composants et Fonctions Principales](#composants-et-fonctions-principales)
    - [Fetch Data](#fetch-data)
    - [Gestion des Réponses du Modal pour les Plats](#gestion-des-réponses-du-modal-pour-les-plats)
    - [Ajout des Items dans le Repas](#ajout-des-items-dans-le-repas)
    - [Suppression des Items dans le Repas](#suppression-des-items-dans-le-repas)
    - [Récapitulatif de la Commande](#récapitulatif-de-la-commande)
    - [Composants de Chat pour Menu, Plat, Snack, Boisson, et Autres](#composants-de-chat-pour-menu-plat-snack-boisson-et-autres)
    - [Fin de la Commande](#fin-de-la-commande)
3. [API et Configuration](#api-et-configuration)
4. [Types Utilisés](#types-utilisés)

---

### Aperçu

La page `ChatPage` est une interface interactive permettant aux utilisateurs de construire leur commande en choisissant des menus, des plats, des boissons et des snacks. L'utilisateur interagit avec une interface de chat simulée pour ajouter des items à sa commande et voir un récapitulatif avant de procéder au paiement.

### Composants et Fonctions Principales

#### Fetch Data

Cette fonction utilise `useEffect` pour récupérer les données nécessaires dès le chargement de la page, incluant les menus, les plats, les ingrédients, les viandes, les snacks, et les boissons.

```js
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
```

#### Gestion des Réponses du Modal pour les Plats

Cette fonction gère les réponses reçues du modal lorsque l'utilisateur sélectionne des ingrédients et des viandes pour un plat spécifique.

```js
useEffect(() => {
  if (modalResponse && modalResponse.viandes && modalResponse.ingredients) {
    const nextRepas = { ...repas };
    const resultIngredients = [...modalResponse.ingredients, ...modalResponse.viandes];

    const newPlat = { ...currentPlat };

    if (newPlat.plat) {
      newPlat.plat.ingredients = resultIngredients;
      nextRepas.plat.push(newPlat);
      modalResponse.viandes.map((viande) => allViandes.push(viande));

      setCurrentPlat(undefined);
      setRepas(nextRepas);
      setAllViandes(allViandes);
      setCurrentStep(getNextStep({ type: "plat" }, nextRepas));
    }
  }
}, [modalResponse]);
```

#### Ajout des Items dans le Repas

Cette fonction permet d'ajouter des items de différents types (menu, plat, snack, boisson) à la commande actuelle.

```js
const handleSetRepasItem = (type, item) => {
  const newRepas = { ...repas };

  switch (item.type) {
    case "menu":
      newRepas.menu.push(item);
      newRepas.currentMenu = item;
      newRepas.remainingPlats = item.menu.quantitePlat;
      newRepas.remainingBoissons = item.menu.quantiteBoisson;
      newRepas.remainingSnacks = item.menu.quantiteSnack;
      setCurrentMenuId(item.menuId);
      setIsMenuDone(false);
      break;
    case "plat":
      // similar handling for plat, snack, boisson
  }

  setRepas(newRepas);
  setCurrentStep(getNextStep(item, newRepas));
};
```

#### Suppression des Items dans le Repas

Cette fonction permet de supprimer des items de différents types de la commande actuelle.

```js
function handleDeleteItem(type, item) {
  const newRepas = { ...repas };
  const itemIndex = newRepas[type].findIndex((currentItem) => currentItem.id === item.id);

  if (type === "menu") {
    // handle deletion of associated items in the menu
  }

  newRepas[type].splice(itemIndex, 1);
  setRepas(newRepas);
  setCurrentStep(getNextStep(item, newRepas));
}
```

#### Récapitulatif de la Commande

Ce composant affiche un récapitulatif de la commande avec les prix totaux pour chaque catégorie d'items (menu, plat, snack, boisson).

```js
function RecapComponent({ repas }) {
  getPriceTotal(repas, false);

  return (
    <div className="flex flex-col gap-4 max-w-[300px]">
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
                    <div className="flex flex-row" key={menu.id}>
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
                      <span className="ml-auto">
                        {menu.menu.prix.toFixed(2)}
                      </span>
                    </div>
                  ))
                : "Pas de menu"}
            </p>
          </CardBody>
        </div>
        <Divider />
      </Card>
      // similar cards for plat, snack, boisson
      <h3 className="text-lg font-bold">Total : {prixTotal.toFixed(2)} €</h3>
    </div>
  );
}
```

#### Composants de Chat pour Menu, Plat, Snack, Boisson, et Autres

Ces composants gèrent l'affichage et la sélection des différentes catégories d'items.

```js
function ChatMenu({ setRepas }) {
  const menuId = Math.floor(Math.random() * 1000) + 1;
  const menu = listMenus.map((menu) => ({ id: menu.id, type: "menu", menu, menuId }));

  return (
    <ChatLayout
      who="Lancelot"
      mainSentence="Bonjour ! Que souhaites-tu aujourd'hui ?"
      buttons={menu}
      setRepas={setRepas}
    />
  );
}

// similar components for ChatPlat, ChatSnack, ChatBoisson
```

#### Fin de la Commande

Ce composant gère la finalisation de la commande et le passage au paiement.

```js
const ChatEnd = React.memo(({ repas, allViandes }) => {
  const handleSave = (repas) => {
    if (!commandeSend) {
      prepareCommande(repas, allViandes);
      setCommandeSend(true);
    }
  };

  handleSave(repas);

  return (
    <div>
      <h2>Lancelot</h2>
      <span>Parfait ! Comment veux-tu régler ta commande ?</span>
      <Paiement />
    </div>
  );
});
```

### API et Configuration

Les fonctions API utilisées pour récupérer les données sont définies dans `@/config/api` :

- `getBoissons`
- `getIngredients`
- `getMenus`
- `getPlats`
- `getSnacks`
- `getViandes`

### Types Utilisés

Les types utilisés dans ce composant sont définis dans `@/types/index` :

- `Ingredients`
- `Menus`
- `Plats`
- `Snacks`
- `Boissons`
- `Viandes`

---
