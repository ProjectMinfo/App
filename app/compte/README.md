
---

# Compte Page

## Description

La page `Compte` permet aux utilisateurs de visualiser leurs informations personnelles et leurs transactions. Elle offre des fonctionnalités pour afficher et gérer les commandes, ainsi que pour se déconnecter.

## Fonctionnalités Principales

- **Affichage des informations personnelles** : Affiche les informations personnelles de l'utilisateur telles que le nom, le prénom, l'identifiant, l'adresse email et la promo.
- **Visualisation des transactions** : Affiche les transactions effectuées par l'utilisateur avec des détails sur la date, le contenu et le prix.
- **Affichage et masquage des transactions** : Permet à l'utilisateur d'afficher plus ou moins de transactions selon ses besoins.

## Technologies Utilisées

- **Frontend** : Next.js avec TypeScript
- **UI Library** : NextUI

## Structure du Composant

### Compte.tsx

#### États du Composant

```typescript
const [user, setUser] = useState(null);
const [isLoading, setIsLoading] = useState(true);
const [commandes, setCommandes] = useState([]);
const [boissonsAll, setBoissonsAll] = useState([]);
const [snacksAll, setSnacksAll] = useState([]);
const [commandesAffichees, setCommandesAffichees] = useState(5);
```

Les états du composant sont utilisés pour gérer les informations de l'utilisateur, les commandes, les boissons, les snacks, et le nombre de commandes affichées.

#### useEffect

```typescript
useEffect(() => {
  async function fetchData() {
    try {
      const fetchedUser = await getUser(587);
      setUser(fetchedUser);
      const fetchedCommandes = await getCommandesByIdUser(587);
      setCommandes(fetchedCommandes);
      const fetchedBoissons = await getBoissons();
      setBoissonsAll(fetchedBoissons);
      const fetchedSnacks = await getSnacks();
      setSnacksAll(fetchedSnacks);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  }

  fetchData();
}, []);
```

Cette fonction `useEffect` récupère les informations de l'utilisateur, les commandes, les boissons et les snacks à partir de l'API lorsque le composant est monté et met à jour les états correspondants.

#### toDate

```typescript
const toDate = (dateNumber) => {
  const date = new Date(Number(dateNumber));
  const jour = ('0' + date.getDate()).slice(-2);
  const mois = ('0' + (date.getMonth() + 1)).slice(-2);
  const annee = date.getFullYear();
  return `${jour}/${mois}/${annee}`;
};
```

Cette fonction convertit un timestamp en une date au format `JJ/MM/AAAA`.

#### countPlats

```typescript
const countPlats = (plats) => {
  const platCounts = new Map();
  plats.forEach(plat => {
    platCounts.set(plat, (platCounts.get(plat) || 0) + 1);
  });
  return platCounts;
};
```

Cette fonction compte le nombre de chaque plat dans une liste et retourne une `Map` avec les plats comme clés et leurs occurrences comme valeurs.

#### commandeContenu

```typescript
const commandeContenu = (commande) => {
  let platsAffiche = "";
  if (commande.contenu) {
    const regex = /([A-Za-zÀ-ÖØ-öø-ÿ\s-]+)(?=:)/g;
    const platsMatches = commande.contenu.match(regex);
    if (platsMatches) {
      const plats = platsMatches.map(match => match.trim());
      const platCounts = countPlats(plats);
      platsAffiche = "Plat(s) : " + [...platCounts.entries()].map(([plat, count]) => `${count} ${plat}`).join(", ");
    }
  }

  let boissonsAffiche = "";
  if (commande.boissons && commande.boissons.length !== 0) {
    boissonsAffiche = "Boisson(s) :";
    for (const boissonElem of commande.boissons) {
      boissonsAffiche += ` ${boissonElem[1]} ${boissonsAll[boissonElem[0]].nom},`;
    }
    boissonsAffiche = boissonsAffiche.slice(0, -1);
  }

  let snacksAffiche = "";
  if (commande.snacks && commande.snacks.length !== 0) {
    snacksAffiche = "Snack(s) :";
    for (const snackElem of commande.snacks) {
      snacksAffiche += ` ${snackElem[1]} ${snacksAll[snackElem[0]].nom},`;
    }
    snacksAffiche = snacksAffiche.slice(0, -1);
  }

  return [platsAffiche, boissonsAffiche, snacksAffiche].filter(Boolean).join("<br>");
};
```

Cette fonction formate le contenu d'une commande en une chaîne HTML lisible en affichant les plats, les boissons et les snacks.

#### handleShowMore et handleShowLess

```typescript
const handleShowMore = () => {
  setCommandesAffichees(prevCount => Math.min(prevCount + 5, commandes.length));
};

const handleShowLess = () => {
  setCommandesAffichees(prevCount => Math.max(prevCount - 5, 5));
};
```

Ces fonctions gèrent l'affichage de plus ou moins de commandes en ajustant l'état `commandesAffichees`.


---
