### README pour la Page GestionCompte

#### Vue d'ensemble
La page `GestionComptePage` est une interface administrative conçue pour gérer les comptes administrateurs. Cette page permet aux administrateurs d'afficher, de rechercher et de modifier les informations des comptes. Elle offre une vue détaillée des comptes avec des fonctionnalités pour trier et mettre à jour les données en temps réel.

#### Fonctionnalités Principales
1. **Afficher la liste des comptes**
2. **Rechercher des comptes**
3. **Modifier les informations des comptes**

#### Technologies Utilisées
- React
- NextUI
- API Intégrée

#### Explication détaillée des Fonctions Principales

##### 1. **Afficher la liste des comptes**
La page affiche une liste des comptes avec des colonnes pour l'identifiant, le nom, le prénom, le solde et le niveau d'accès. Les comptes sont triés par numéro de compte.

```jsx
useEffect(() => {
  async function fetchComptes() {
    const fetchedComptes = await getComptes();
    fetchedComptes.sort((a: Comptes, b: Comptes) => a.numCompte - b.numCompte); // Trie par ordre de numero de compte
    setComptes(fetchedComptes);
  }
  fetchComptes();
}, []);
```

##### 2. **Rechercher des comptes**
Les administrateurs peuvent rechercher des comptes en saisissant un terme de recherche. La recherche filtre les comptes par nom, prénom ou numéro de compte.

```jsx
const filteredComptes = comptes.filter((compte) =>
  compte.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
  compte.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
  compte.numCompte.toString().includes(searchTerm)
);
```

##### 3. **Modifier les informations des comptes**
La page permet aux administrateurs de modifier les informations des comptes, y compris le nom, le prénom, le solde et le niveau d'accès. Le `EditAccountModal` est utilisé pour saisir et soumettre les modifications.

```jsx
const onEditOpen = (user: Comptes) => {
  setCurrentUser(user);
  setIsModalOpen(true);
};

const onEditClose = () => {
  setIsModalOpen(false);
  setCurrentUser(null);
};

const onSubmit = async (nom: string, prenom: string, montant: number, acces: number) => {
  if (currentUser && comptes) {
    const editedListeUtilisateurs = comptes.map((compte) =>
      compte.numCompte === currentUser.numCompte ? { ...compte, nom, prenom, montant, acces } : compte
    );
    setComptes(editedListeUtilisateurs);

    const updatedUser = { ...currentUser, nom, prenom, montant, acces };

    try {
      await postEditCompte(updatedUser); // Appel à l'API pour enregistrer les modifications
      console.log("User updated successfully in the API");
    }
    catch (error) {
      console.error("Error updating user:", error);
    }
  }
  onEditClose();
};
```

##### Rendu des cellules du tableau
Les cellules du tableau sont rendues en fonction de la clé de colonne. Chaque colonne a une représentation spécifique, par exemple, le solde est coloré en fonction de sa valeur et le niveau d'accès est affiché avec un `Chip` coloré.

```jsx
const renderCell = React.useCallback((compte: Comptes, columnKey: ColumnKeys) => {
  const cellValue = compte[columnKey as keyof Comptes];

  switch (columnKey) {
    case "numCompte":
      return <div className="flex flex-col"><p className="text-bold text-sm capitalize">{cellValue}</p></div>;
    case "nom":
      return <div className="flex flex-col"><p className="text-bold text-sm capitalize">{cellValue}</p></div>;
    case "prenom":
      return <div className="flex flex-col"><p className="text-bold text-sm capitalize">{cellValue}</p></div>;
    case "montant":
      return (
        <div className="flex flex-col">
          <p className={`text-bold text-sm capitalize ${colorSolde(cellValue as number)}`}>
            {typeof cellValue === 'number' ? parseFloat(cellValue.toFixed(2)).toFixed(2) : cellValue} €
          </p>
        </div>
      );
    case "acces":
      return (
        <Chip className="capitalize" color={accessColorMap(compte)} size="sm" variant="flat">
          {cellValue === 0 ? "user" : cellValue === 1 ? "serveur" : cellValue === 2 ? "admin" : "error"}
        </Chip>
      );
    case "modifier":
      return (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Modifier">
            <span onClick={() => onEditOpen(compte)} className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Tooltip>
        </div>
      );
    default:
      return cellValue;
  }
}, [onEditOpen]);
```

#### Utilisation
Ce composant est conçu pour être utilisé dans un tableau de bord administratif, accessible uniquement aux utilisateurs autorisés. Il permet de gérer les comptes utilisateurs de manière efficace et sécurisée.

