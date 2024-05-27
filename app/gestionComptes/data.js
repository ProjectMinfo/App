const columns = [
  {name: "IDENTIFIANT", uid: "idCompte"},
  {name: "NOM", uid: "nom"},
  {name: "PRENOM", uid: "prenom"},
  {name: "SOLDE", uid: "montant"},
  {name: "ACCES", uid: "acces"},
  {name: "MODIFIER", uid: "modifier"}
];


const listeUtilisateurs = [
  {
      idCompte: 652,
      nom: "CHARPENTIER",
      prenom: "Clovis",
      montant: 40,
      acces: 0, // user
      email: "clovis.charpentier@example.com",
      mdp: "password123",
      numCompte: 12345,
      promo: 2024,
      resetToken: "",
      tokenExpiration: ""
  },
  {
      idCompte: 478,
      nom: "HAGE",
      prenom: "Rémi",
      montant: -10,
      acces: 1, // serveur
      email: "remi.hage@example.com",
      mdp: "password123",
      numCompte: 12346,
      promo: 2024,
      resetToken: "",
      tokenExpiration: ""
  },
  {
      idCompte: 622,
      nom: "MONTUORI",
      prenom: "Milo",
      montant: 3.20,
      acces: 0, // user
      email: "milo.montuori@example.com",
      mdp: "password123",
      numCompte: 12347,
      promo: 2024,
      resetToken: "",
      tokenExpiration: ""
  },
  {
      idCompte: 587,
      nom: "LAMBERT",
      prenom: "Edouard",
      montant: 0,
      acces: 2, // admin
      email: "edouard.lambert@example.com",
      mdp: "password123",
      numCompte: 12348,
      promo: 2024,
      resetToken: "",
      tokenExpiration: ""
  },
  {
      idCompte: 423,
      nom: "HOSTE",
      prenom: "Matthos",
      montant: 3.30,
      acces: 0, // user
      email: "matthos.hoste@example.com",
      mdp: "password123",
      numCompte: 12349,
      promo: 2024,
      resetToken: "",
      tokenExpiration: ""
  },
  {
      idCompte: 828,
      nom: "T'SERSTEVENS",
      prenom: "Eva",
      montant: 0.40,
      acces: 0, // user
      email: "eva.tserstevens@example.com",
      mdp: "password123",
      numCompte: 12350,
      promo: 2024,
      resetToken: "",
      tokenExpiration: ""
  }
];

export { columns, listeUtilisateurs };
