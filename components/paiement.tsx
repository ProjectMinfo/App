import { button as buttonStyles } from "@nextui-org/theme";

import { prepareCommande } from "@/config/logic";
import { Menus, Plats, Snacks, Boissons, Viandes, Comptes } from "@/types";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader, Divider, Input, Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
import { getUser, postEditCompte } from "@/config/api";
import ListeComptesModal from "./listeCompteModal";
import { redirect } from "next/navigation";

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
  serveurView: boolean;
};

export default function Paiement({ repas, allViandes, serveurView }: PaiementProps) {
  const [currentAccount, setCurrentAccount] = useState<Comptes>();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [prixCommande, setPrixCommande] = useState(0);

  // 1 = compteMi / 2 = comptoir
  const [typePaiement, setTypePaiement] = useState(0);

  const [currentComment, setCurrentComment] = useState("");

  const [isModalCompteOpen, setIsModalCompteOpen] = useState<boolean>(false);

  const [isModalNoAcc, setIsModalNoAcc] = useState<boolean>(false);

  const [userName, setUserName] = useState<string>("");



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
        if (serveurView === undefined || !serveurView) {
          setCurrentAccount(fetchedUser);
        }
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

              <Input label="Commentaire ? (ou pas)" onChange={(e) => setCurrentComment(e.target.value)} />

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

  function setName() {
    setIsModalNoAcc(false);

    const nom = userName;
    const newCompte : Comptes = {
      nom: nom,
      prenom: "",
      montant: 0,
      numCompte: -1,
      acces: 0,
      email: "",
      mdp: "",
      promo: 0,
      resetToken: "",
      tokenExpiration: ""
    }
    setCurrentAccount(newCompte);
  }

  const choixServeur = () => {

    return (
      <>
        <Card className="w-full p-4">
          <CardHeader className="flex items-center justify-center">
            <h2>Réglement</h2>
          </CardHeader>
          <Divider />
          {isLoading ? (
            <p>Chargement...</p>
          ) : (
            <>
              <CardBody className="flex gap-3">

                <Input label="Commentaire ? (ou pas)" onChange={(e) => setCurrentComment(e.target.value)} />

                <Button className={buttonStyles({ variant: "bordered", radius: "full", size: "md" })} onClick={() => setIsModalCompteOpen(true)}>
                  Choisir un compte
                </Button>

                <Button className={buttonStyles({ variant: "bordered", radius: "full", size: "md" })} onClick={() => setIsModalNoAcc(true)}>
                  Pas de compte
                </Button>

                {isModalCompteOpen && (
                  <ListeComptesModal
                    isOpen={isModalCompteOpen}
                    onClose={(compte) => { setIsModalCompteOpen(false); setCurrentAccount(compte) }}
                    serveurView={true}
                  />
                )}
                {currentAccount && currentAccount !== undefined && (
                  <>
                    <Divider className="mt-5" />
                    <Card className="px-7 py-2 rounded">
                      <span className="text-base base:text-xl font-bold">Solde de {currentAccount.prenom}:</span>
                      {currentAccount && (
                        <span className={`text-lg lg:text-xl font-bold ` + (prixCommande > currentAccount.montant ? "text-danger" : "text-success")}>
                          {currentAccount.montant.toFixed(2)} €
                        </span>
                      )}
                    </Card>

                    <Button className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
                      isDisabled={Boolean(prixCommande > currentAccount.montant)}
                      onClick={() => {
                        setTypePaiement(1);
                        setCurrentStep(1);
                      }}
                    >
                      Payer avec le compte de {currentAccount.prenom}
                    </Button>
                    <Button
                      className={buttonStyles({ variant: "bordered", radius: "full", size: "lg" })}
                      onClick={() => {
                        setTypePaiement(2);
                        setCurrentStep(1);
                      }}
                    >
                      Payer au comptoir
                    </Button>
                  </>
                )}
              </CardBody>
            </>
          )}
        </Card>
        {isModalNoAcc && (
          <Modal isOpen={isModalNoAcc} onClose={() => setIsModalNoAcc(false)}>
            <ModalContent>
              <ModalHeader>
                <h2>Choisir un nom</h2>
              </ModalHeader>
              <ModalBody>
                <Input label="Nom" onChange={(e) => setUserName(e.target.value)} />
                <Button onClick={() => setName()}>
                  Valider
                </Button>
              </ModalBody>
            </ModalContent>
          </Modal >
        )}
      </>
    );
  }


  useEffect(() => {
    if (currentStep === 1 && typePaiement === 1) {
      if (currentAccount) {
        currentAccount.montant -= prixCommande;
        postEditCompte(currentAccount);
      }
      prepareCommande(repas, allViandes, true, prixCommande, currentComment, currentAccount);
      // console.log("Commande Compte MI prête à être payée");
    }
    if (currentStep === 1 && typePaiement === 2) {
      prepareCommande(repas, allViandes, false, prixCommande, currentComment, currentAccount);
      // console.log("Commande Comptoir prête à être payée");
    }

    if (currentStep === 1 && serveurView) {
      redirect("/priseCommande");
    }
  }, [currentStep, typePaiement]);


  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 max-md:py-0">

      <div className="inline-block max-w-lg text-center justify-center">
        <p className="text-md">
          Tu as plusieurs moyens de paiement à ta disposition. <br />Si tu n'as plus d'argent sur ton compte MI, tu peux aller au comptoir pour créditer ton compte.
        </p>
      </div>

      {currentStep === 0 && !serveurView && (
        choixPaiement()
      )}

      {currentStep === 0 && serveurView && (
        choixServeur()
      )}        

      {currentStep === 1 && typePaiement === 1 && (
        <Card className="w-full p-4">
          {(serveurView === undefined || !serveurView) ? (
            <CardBody className="flex flex-col items-center justify-center gap-4">
              <p>
                Parfait ! Ta commande a bien été prise en compte.
              </p>
              <Divider />
              <p className="text-sm font-bold">
                Merci de te rendre à la MI <span className="text-danger">très prochainement </span>pour récupérer ta commande.
              </p>
            </CardBody>
          ) : (
            <CardBody className="flex flex-col items-center justify-center gap-4">
              <p>
                Parfait ! La commande de {currentAccount?.prenom} a bien été prise en compte.
              </p>
              <Divider />
            </CardBody>
          )}

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
