### README pour la Page PriseCommande

#### Vue d'ensemble
La page `PriseCommande` est une interface utilisateur conçue pour prendre des commandes dans le cadre de la gestion du restaurant de l'association ISEN. Cette page permet aux serveurs de sélectionner des menus, plats, snacks, et boissons, et de les ajouter à une commande en cours. La page inclut également des fonctionnalités pour la gestion des baguettes, la visualisation des commandes en cours, et l'accès à la liste des comptes.

#### Fonctionnalités Principales
1. **Sélection et ajout d'articles à la commande**
2. **Affichage de la commande en cours**
3. **Gestion des baguettes**
4. **Accès à la liste des comptes**
5. **Mode serveur**

#### Technologies Utilisées
- React
- NextUI
- API Intégrée

#### Explication détaillée des Fonctions Principales

##### 1. **Sélection et ajout d'articles à la commande**
La page permet aux serveurs de sélectionner des menus, plats, snacks et boissons à ajouter à une commande. Chaque article peut être ajouté en fonction des disponibilités et des configurations d'événements.

```jsx
const handleSetRepasItem = (type: keyof NewRepas, item: AllType) => {
  const newRepas: NewRepas = { ...repas };

  switch (item.type) {
    case "menu":
      newRepas.menu.push(item);
      newRepas.currentMenu = item;
      newRepas.remainingPlats = item.menu.quantitePlat;
      newRepas.remainingPerifs = item.menu.quantiteBoisson + item.menu.quantiteSnack;
      setCurrentMenuId(item.menuId);
      setIsMenuDone(false);
      break;
    case "plat":
      if (!isMenuDone) {
        newRepas.remainingPlats -= 1;
        const platInMenu = item;
        platInMenu.plat.prix = 0;
        platInMenu.plat.prixServeur = 0;
        platInMenu.menuId = currentMenuId;
        setCurrentPlat(platInMenu);
        setIsModalOpen(true);
      } else {
        setCurrentPlat(item);
        setIsModalOpen(true);
      }
      break;
    case "snack":
      if (!isMenuDone) {
        newRepas.remainingPerifs -= 1;
        const snackInMenu = item;
        snackInMenu.snack.prix = 0;
        snackInMenu.snack.prixServeur = 0;
        snackInMenu.menuId = currentMenuId;
        newRepas.snack.push(snackInMenu);
      } else {
        newRepas.snack.push(item);
      }
      break;
    case "boisson":
      if (!isMenuDone) {
        newRepas.remainingPerifs -= 1;
        const boissonInMenu = item;
        boissonInMenu.boisson.prix = 0;
        boissonInMenu.boisson.prixServeur = 0;
        boissonInMenu.menuId = currentMenuId;
        newRepas.boisson.push(boissonInMenu);
      } else {
        newRepas.boisson.push(item);
      }
      break;
  }

  if (newRepas.menu.length > 0 && newRepas.remainingPlats === 0 && newRepas.remainingPerifs === 0) {
    setIsMenuDone(true);
  }

  setRepas(newRepas);
  setCurrentStep(getNextStep(item, newRepas));
};
```

##### 2. **Affichage de la commande en cours**
La page affiche la commande en cours, permettant aux serveurs de voir les articles ajoutés et de les modifier si nécessaire.

```jsx
function ChatNext({ repas, setRepasItem, currentStep, setCurrentStep }) {
  if (repas.remainingPlats > 0) {
    return <ChatPlat setRepas={item => setRepasItem("plat", item)} />;
  } else {
    if (currentStep === "end") {
      return <ChatEnd repas={repas} allViandes={allViandes} />;
    } else if (currentStep === "menu") {
      return <ChatMenu setRepas={item => setRepasItem("menu", item)} />;
    } else if (currentStep === "plat") {
      return <ChatPlat setRepas={item => setRepasItem("plat", item)} />;
    } else if (currentStep === "snack") {
      return <ChatSnack setRepas={item => setRepasItem("snack", item)} />;
    } else if (currentStep === "boisson") {
      return <ChatBoisson setRepas={item => setRepasItem("boisson", item)} />;
    } else return <ChatOther setCurrentStep={setCurrentStep} />;
  }
}
```

##### 3. **Gestion des baguettes**
Les serveurs peuvent gérer les quantités de baguettes fraîches et totales. Un modal permet de mettre à jour ces quantités.

```jsx
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
```

##### 4. **Accès à la liste des comptes**
Les serveurs peuvent accéder à la liste des comptes pour voir les informations des clients. Un modal affiche la liste des comptes.

```jsx
{isModalCompteOpen && (
  <ListeComptesModal
    isOpen={isModalCompteOpen}
    onClose={() => setIsModalCompteOpen(false)}
  />
)}
```

##### 5. **Mode serveur**
La page dispose d'un mode serveur, permettant de basculer entre les vues client et serveur.

```jsx
<Button
  variant="faded"
  onClick={() => isServeur(!serveur)}
  className={serveur ? "bg-red-500" : ""}
>
  Serveur ?  {serveur ? "(Oui)" : "(Non)"}
</Button>
```

#### Utilisation
Ce composant est conçu pour être utilisé dans un tableau de bord accessible aux serveurs et administrateurs. Il permet de prendre des commandes de manière efficace et de gérer les articles et quantités disponibles en temps réel.

