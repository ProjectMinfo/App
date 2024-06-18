import { button as buttonStyles } from "@nextui-org/theme";

import { prepareCommande } from "@/config/logic";
import { Menus, Plats, Snacks, Boissons, Viandes, Comptes } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import { getUser, postEditCompte } from "@/config/api";

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

type PaiementProps = {
  repas: NewRepas;
  allViandes: Viandes[];
};

export default function Paiement({ repas, allViandes }: PaiementProps) {
  const [currentAccount, setCurrentAccount] = useState<Comptes>();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [prixCommande, setPrixCommande] = useState(0);

  // 1 = compteMi / 2 = comptoir
  const [typePaiement, setTypePaiement] = useState(0);


  function calculPrix() {
    let total = 0;
    repas.menu.forEach(menu => {
      total += menu.menu.prix;
    });
    repas.plat.forEach(plat => {
      total += plat.plat.prix;
    });
    repas.snack.forEach(snack => {
      total += snack.snack.prix;
    });
    repas.boisson.forEach(boisson => {
      total += boisson.boisson.prix;
    });

    setPrixCommande(total);
  }

  useEffect(() => {
    async function fetchData() {
      if (typeof window !== "undefined") {
        const fetchedUser = await getUser(parseInt(window.localStorage.getItem("numCompte")) || -1);
        setCurrentAccount(fetchedUser);
      }
      setIsLoading(false);
    }
    fetchData();
    calculPrix();
  }, []);


  const choixPaiement = () => {
    return (
      <Card className="w-full p-4">
        <CardHeader className="flex items-center justify-center">
          <h2>Réglement avec ton Compte MI</h2>
        </CardHeader>
        <Divider />
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          <>
            <CardBody className="flex gap-3">
              <Card className="px-7 py-2 rounded">
                <span className="text-base base:text-xl font-bold">Solde actuel :</span>
                {currentAccount && (
                  <span className={`text-lg lg:text-xl font-bold ` + (prixCommande > currentAccount.montant ? "text-danger" : "text-success")}>
                    {currentAccount.montant.toFixed(2)} €
                  </span>
                )}
              </Card>
              <Button
                isDisabled={Boolean(prixCommande > currentAccount.montant)}
                className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
                onClick={() => {
                  setTypePaiement(1);
                  setCurrentStep(1);
                }}
              >
                Payer avec mon Compte MI
              </Button>
              {(prixCommande > currentAccount.montant) && (
                <>
                  <p className="text-danger text-sm font-bold">
                    Tu n'as pas assez d'argent sur ton compte MI pour régler ta commande.
                  </p>
                  <p>
                    Tu peux aller au comptoir pour créditer ton compte. <br />(et/ou payer ta commande)
                  </p>
                </>
              )}
              <Button
                className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
                onClick={() => {
                  setTypePaiement(2);
                  setCurrentStep(1);
                }}
              >
                Payer au comptoir
              </Button>
            </CardBody>
          </>
        )}
      </Card>
    );
  }


  useEffect(() => {
    if (currentStep === 1 && typePaiement === 1) {
      if (currentAccount) {
        currentAccount.montant -= prixCommande;
        postEditCompte(currentAccount);

      }
      prepareCommande(repas, allViandes, true, prixCommande);
      console.log("Commande Compte MI prête à être payée");
    }
    if (currentStep === 1 && typePaiement === 2) {
      prepareCommande(repas, allViandes, false, prixCommande);
      console.log("Commande Comptoir prête à être payée");
    }
  }, [currentStep, typePaiement]);


  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 max-md:py-0">

      <div className="inline-block max-w-lg text-center justify-center">
        <p className="text-md">
          Tu as plusieurs moyens de paiement à ta disposition. <br />Si tu n'as plus d'argent sur ton compte MI, tu peux aller au comptoir pour créditer ton compte.
        </p>
      </div>

      {currentStep === 0 && (
        choixPaiement()
      )}

      {currentStep === 1 && typePaiement === 1 && (
        <Card className="w-full p-4">
          <CardBody className="flex flex-col items-center justify-center gap-4">
            <p>
              Parfait ! Ta commande a bien été prise en compte.
            </p>
            <Divider />
            <p className="text-sm font-bold">
              Merci de te rendre à la MI <span className="text-danger">très prochainement </span>pour récupérer ta commande.
            </p>
          </CardBody>
          <CardFooter>
            <span className="text-base font-bold">Nouveau solde :</span>
            {currentAccount && (
              <span className={`font-bold`}>
                {(currentAccount.montant - prixCommande).toFixed(2)} €
              </span>
            )}
          </CardFooter>

        </Card>
      )}


      {currentStep === 1 && typePaiement === 2 && (
        <Card className="w-full p-4">
          <div className="flex flex-col items-center justify-center gap-4">
            <p>
              Parfait ! Rendez-vous au comptoir pour régler ta commande.
            </p>
            <Divider />
            <p className="text-sm font-bold">
              Tant que tu n'as pas réglé ta commande, elle ne sera pas prise en compte.
            </p>
          </div>
        </Card>
      )}

    </section>
  );
}
