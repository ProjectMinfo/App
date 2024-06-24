### README pour le Composant GestionAchatsPage

#### Vue d'ensemble
Le composant `GestionAchatsPage` est une interface administrative basée sur React, conçue pour la gestion des achats au sein de l'association ISEN. Cette page permet aux administrateurs et serveurs d'ajouter, de modifier et de supprimer des enregistrements d'achats, ainsi que de visualiser et de gérer le statut de divers articles. Le composant est intégré avec des API pour récupérer et manipuler les données des achats, offrant un outil complet de gestion des stocks.

#### Fonctionnalités Principales
1. **Ajouter des achats**
2. **Modifier des achats**
3. **Supprimer des achats**
4. **Visualiser et filtrer les achats**
5. **Gérer le statut des achats**

#### Technologies Utilisées
- React
- NextUI
- Material-UI
- Icônes personnalisées
- Intégration API

#### Explication détaillée des Fonctions Principales

##### 1. **Ajouter des achats**
Le composant `AddAchatModal` est utilisé pour ajouter de nouveaux achats. Il collecte des données telles que la catégorie, le nom du produit, le numéro de lot, la date de péremption et la quantité. Le modal permet également de dupliquer les entrées pour des ajouts en masse.

```jsx
const onAddOpen = () => { setIsAddModalOpen(true); };
const onAddClose = () => { setIsAddModalOpen(false); };
const onAddSubmit = async (newAchat, duplication) => {
  // Gestion de l'ajout d'un nouvel achat
  ...
};
```

##### 2. **Modifier des achats**
Le composant `EditAchatModal` permet aux administrateurs de modifier des enregistrements d'achats existants. Les utilisateurs peuvent mettre à jour des détails tels que le nom du produit, la catégorie, le numéro de lot et le statut.

```jsx
const onEditOpen = (achat, indexAchat) => { 
  setCurrentAchatIndex(indexAchat); 
  setCurrentAchat(achat); 
  setIsEditModalOpen(true); 
};
const onEditClose = () => { 
  setIsEditModalOpen(false); 
  setCurrentAchat(null); 
};
const onEditSubmit = async (nomArticle, categorie, numLot, nbPortions, dateOuverture, dateFermeture, dlc, etat) => {
  // Gestion de la modification d'un achat
  ...
};
```

##### 3. **Supprimer des achats**
Le composant `DeleteAchatModal` gère la suppression des achats. Lorsqu'un achat est sélectionné pour suppression, le modal confirme l'action avant de retirer l'entrée de la base de données.

```jsx
const onDeleteOpen = (achat) => { 
  setCurrentAchat(achat); 
  setIsDeleteModalOpen(true); 
};
const onDeleteClose = () => { 
  setIsDeleteModalOpen(false); 
  setCurrentAchat(null); 
};
const onDeleteSubmit = async () => {
  // Gestion de la suppression d'un achat
  ...
};
```

##### 4. **Visualiser et filtrer les achats**
Le composant affiche un tableau de tous les achats avec des options pour filtrer en fonction de divers critères tels que le nom du produit, le numéro de lot et le statut. Il prend également en charge l'affichage paginé pour une meilleure performance et convivialité.

```jsx
const renderCell = (achat, columnKey, index) => {
  // Rendu des cellules du tableau en fonction de la clé de colonne
  ...
};

const filteredAchats = achats.filter((achat) => 
  // Logique de filtrage
  ...
);
```

##### 5. **Gérer le statut des achats**
Le composant permet de changer le statut des achats (par exemple, ouvert, consommé, périmé). Cela est géré via une série de boutons et d'actions liés à chaque entrée d'achat.

```jsx
const onChangementEtat = async (achat) => {
  // Logique de changement de statut
  ...
};
```

#### Composant AddAchatModal
Le composant `AddAchatModal` est utilisé pour ajouter de nouvelles entrées d'achat. Il comprend un formulaire avec des champs pour la catégorie, la sélection de produits, le numéro de lot, la date de péremption et la quantité.

##### Fonctions clés :
- **Récupération des données produits** : Récupère les listes de produits (ingrédients, viandes, boissons, snacks) depuis l'API.
- **Gestion du formulaire** : Valide et gère les entrées de formulaire pour créer de nouveaux achats.
- **Soumission** : Soumet le nouvel achat à l'API et met à jour la liste des achats.

```jsx
useEffect(() => {
  const fetchProduits = async () => {
    // Récupère les données des produits depuis l'API
    ...
  };
  fetchProduits();
}, []);

const handleSubmit = () => {
  // Gestion de la soumission du formulaire
  ...
};
```

#### Utilisation
Ce composant est conçu pour être intégré dans un tableau de bord administratif où seuls les personnels autorisés peuvent accéder et gérer les enregistrements d'achats. Il offre une interface conviviale pour maintenir l'inventaire et assurer des enregistrements à jour de tous les achats.
