import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export interface ChatLayoutProps {
  who: string;
  mainSentence: string;
  buttons?: string[];
  nextChat?: JSX.Element;
  setRepas: (repas: string) => void;
}
export interface Carte {
  ref: string;
  nom: string;
}


// TOUT CE QUI EST DANS LA BASE DE DONNEES : 
export interface Achats {
  idAchat: number;
  categorie: number;
  dateFermeture: string;
  dateOuverture: string;
  dlc: string;
  etat: number;
  idProduit: number;
  nbPortions: number;
  nomArticle: string;
  numLot: string;
  qtePerimee: number;
}

export interface Actus {
  idActu: number;
  content: string;
  titre: string;
}


export interface Articles {
  idArticle: number;
  commentaire: string;
  nom: string;
  qte: number;
  typeIngredient: number;
}


export interface Boissons {
  dispo: boolean;
  id: number;
  nom: string;
  quantite: number;
  prix: number;
  prixServeur: number;
}

export interface Cartes {
  idCarte: number;
  ingredientsPossibles: string;
  label: string;
  nom: string;
  prix: number;
  prixServeur: number;
  ref: string;
  typePlat: number;
}


export interface Commandes {
  idCommande: number;
  chaud: string;
  commandeIn: string;
  commandeOut: string;
  commentaire: string;
  date: string;
  etat: number;
  froid: string;
  menu: string;
  nom: string;
  numCompte: number;
  numTransaction: number;
  prix: number;
  retireStock: string;
  stock: string;
  typepaiement: number;
}


export interface Comptes {
  idCompte: number;
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

export interface Ingredients {
  commentaire: string;
  dispo: boolean;
  id: number;
  nom: string;
  quantite: number;
}


export interface Menus {
  dispo: boolean;
  id: number;
  nom: string;
  prix: number;
  prixServeur: number;
  quantitePlat: number;
  quantiteBoisson: number;
  quantiteSnack: number;
}


export interface Nettoyages {
  date: string;
  explication: string;
  nomMembre: string;
  nettoyageId: number;
}


export interface Plannings {
  idPlanning: number;
  date: string;
  idUser: number;
  nom: string;
  numPoste: number;
  numSemaine: number;
  poste: number;
  prenom: string;
  tab: number;
}


export interface PlanningCourses {
  id: number;
  date: string;
  idUser: number;
  numSemaine: number;
  prenom: string;
}


export interface Plats {
  dispo: boolean;
  id: number;
  nom: string;
  prix: number;
  prixServeur: number;
  quantite: number;
  ingredients: { ingredient: Ingredients,
    qmin: number, 
    qmax: number }[];
}


export interface Parametres {
  id: number;
  param: string;
  value: number;
}

export interface Snacks {
  dispo: boolean;
  id: number;
  nom: string;
  quantite: number;
  prix: number;
  prixServeur: number;
}


export interface Temperatures {
  temperatureId: number;
  date: string;
  nomMembre: string;
  tmp1: number;
  tmp2: number;
}

export interface Transactions {
  idTransaction: number;
  date: {
    $date: string;
  };
  idServeur: number;
  montant: number;
  numCompte: number;
  type: number;
}

export interface Viandes {
  commentaire: string;
  dispo: boolean;
  id: number;
  nom: string;
  quantite: number;
}


export interface Repas {
  menu: Menus[];
  plat: Plats[];
  snack: Snacks[];
  boisson: Boissons[];
  complete: boolean;
  join: () => any;
}