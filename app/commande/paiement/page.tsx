import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";

import { subtitle } from "@/components/primitives";
import { prepareCommande } from "@/config/logic";
import { Menus, Plats, Snacks, Boissons, Viandes } from "@/types";


type NewMenus = {
  id: number;
  type: "menu";
  menu: Menus;
  menuId: number;
};

type NewPlats = {
  id: number;
  type: "plat";
  plat: Plats;
  menuId?: number;
};

type NewSnacks = {
  id: number;
  type: "snack";
  snack: Snacks;
  menuId?: number;
};

type NewBoissons = {
  id: number;
  type: "boisson";
  boisson: Boissons;
  menuId?: number;
};

type NewRepas = {
  menu: NewMenus[];
  plat: NewPlats[];
  snack: NewSnacks[];
  boisson: NewBoissons[];
  complete: boolean;
  remainingPlats: number;
  remainingBoissons: number;
  remainingSnacks: number;
  currentMenu?: NewMenus;
};

export default function Paiement() {  

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 max-md:py-0">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={subtitle({ class: "mt-4" })}>
          Tu as plusieurs moyens de paiement à ta disposition
        </h1>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
        >
          Compte MI
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
        >
          Liquide
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
        >
          Sum'Up
        </Link>
      </div>

      {/* <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div> */}
    </section>
  );
}
