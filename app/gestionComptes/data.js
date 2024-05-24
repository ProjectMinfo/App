const columns = [
    {name: "IDENTIFIANT", uid: "id"},
    {name: "NOM", uid: "name"},
    {name: "PRENOM", uid: "firstname"},
    {name: "SOLDE", uid: "solde"},
    {name: "ACCES", uid: "access"},
    {name: "MODIFIER", uid: "modifier"}
];

// Récuperer la liste des comptes dans la BDD
const listeUtilisateurs  = [
    {
      id: 652,
      name: "CHARPENTIER",
      firstname: "Clovis",
      solde: 40,
      access: "user",
    },
    {
      id: 478,
      name: "HAGE",
      firstname: "Rémi",
      solde: -10,
      access: "serveur",
    },
    {
      id: 622,
      name: "MONTUORI",
      firstname: "Milo",
      solde: 3.20,
      access: "user",
    },
    {
      id: 587,
      name: "LAMBERT",
      firstname: "Edouard",
      solde: 0,
      access: "admin",
    },
    {
        id: 423,
        name: "HOSTE",
        firstname: "Matthos",
        solde: 3.30,
        access: "user",
      },
    {
        id: 828,
        name: "T'SERSTEVENS",
        firstname: "Eva",
        solde: 0.40,
        access: "user",
      },
];

export {columns, listeUtilisateurs };