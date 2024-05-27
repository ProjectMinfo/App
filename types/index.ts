import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};


export interface ChatMenuProps {
  cartes: Carte[];
  repas: Repas;
  setRepas: (repas: string) => void;
}

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

export interface Repas {
  menu: string[];
  plat: string[], 
  snack: string[];
  boisson: string[];
  complete: boolean;
  join: () => string;
}
