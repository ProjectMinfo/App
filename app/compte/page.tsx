'use client'; // Indique que ce composant doit être rendu côté client.
import React, { useState, useEffect } from "react";
import { getUser, getCommandesByIdUser, getBoissons, getSnacks } from "@/config/api";
import { Card, Link } from "@nextui-org/react";

const Compte = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commandes, setCommandes] = useState([]);
  const [boissonsAll, setBoissonsAll] = useState([]);
  const [snacksAll, setSnacksAll] = useState([]);
  const [commandesAffichees, setCommandesAffichees] = useState(5);
  const userId = window.localStorage.getItem("numCompte");





  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedUser = await getUser(userId);
        setUser(fetchedUser);
        const fetchedCommandes = await getCommandesByIdUser(userId);
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

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  const toDate = (dateNumber) => {
    const date = new Date(Number(dateNumber));
    const jour = ('0' + date.getDate()).slice(-2); // Obtient le jour avec un zéro initial si nécessaire
    const mois = ('0' + (date.getMonth() + 1)).slice(-2); // Obtient le mois avec un zéro initial si nécessaire
    const annee = date.getFullYear(); // Obtient l'année
    return `${jour}/${mois}/${annee}`;
  };

  const countPlats = (plats) => {
    const platCounts = new Map();
    plats.forEach(plat => {
      platCounts.set(plat, (platCounts.get(plat) || 0) + 1);
    });
    return platCounts;
  };

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
      boissonsAffiche = boissonsAffiche.slice(0, -1); // Supprimer la dernière virgule
    }

    let snacksAffiche = "";
    if (commande.snacks && commande.snacks.length !== 0) {
      snacksAffiche = "Snack(s) :";
      for (const snackElem of commande.snacks) {
        snacksAffiche += ` ${snackElem[1]} ${snacksAll[snackElem[0]].nom},`;
      }
      snacksAffiche = snacksAffiche.slice(0, -1); // Supprimer la dernière virgule
    }

    return [platsAffiche, boissonsAffiche, snacksAffiche].filter(Boolean).join("<br>");
  };

  const handleShowMore = () => {
    setCommandesAffichees(prevCount => Math.min(prevCount + 5, commandes.length));
  };

  const handleShowLess = () => {
    setCommandesAffichees(prevCount => Math.max(prevCount - 5, 5));
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="flex flex-col lg:flex-row w-full lg:space-x-8">
        <Card className="lg:w-1/3 h-full w-full mb-4 lg:mb-0">
          <h2 className="text-2xl font-semibold mb-4 text-center">Mes informations personnelles</h2>
          <p className="mb-4">Pour modifier ces informations, merci de vous rendre au comptoir.</p>
          <div className="space-y-2 m-2">
            <div className="text-left"><span className="font-bold">Nom :  </span>{user.nom}</div>
            <div className="text-left"><span className="font-bold">Prénom :  </span>{user.prenom}</div>
            <div className="text-left"><span className="font-bold">Identifiant :  </span>{user.numCompte}</div>
            <div className="text-left"><span className="font-bold">Adresse mail :  </span>{user.email}</div>
            <div className="text-left"><span className="font-bold">Promo :  </span>{user.promo}</div>
          </div>
          <button className="bg-red-500 text-white py-2 px-4 rounded">
            <Link className="text-white" href="/connexion">
              Déconnexion
            </Link>
          </button>
        </Card>
        <div className="lg:w-2/3 w-full flex flex-col items-center">
          <div className="flex justify-between items-center mb-4 w-full">
            <h2 className="text-xl lg:text-2xl font-semibold text-left">Mes transactions  </h2>
            <Card className="px-7 py-2 rounded">
              <span className="text-base base:text-xl font-bold">Solde actuel :</span>
              <span className="text-lg lg:text-xl font-bold text-red-600">{user.montant.toFixed(2)} €</span>
            </Card>
          </div>
          <table className="min-w-full shadow-md rounded-lg mb-4 table-auto">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-600 text-center">Date</th>
                <th className="py-2 px-4 border-b border-gray-600 text-left">Contenu</th>
                <th className="py-2 px-4 border-b border-gray-600 text-center">Prix</th>
              </tr>
            </thead>
            <tbody>
              {commandes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-2 px-4 border-b border-gray-600 text-center">Aucune commande passée</td>
                </tr>
              ) : (
                commandes
                  .filter(commande => commande.prix > 0)
                  .slice(0, commandesAffichees)
                  .map((commande) => {
                    const contenu = commandeContenu(commande);
                    const prix = commande.prix.toFixed(2);
                    return (
                      <tr key={commande.id}>
                        <td className="py-2 px-4 border-b border-gray-600 text-center whitespace-nowrap">{toDate(commande.date.$date.$numberLong)}</td>
                        <td className="py-2 px-4 border-b border-gray-600 text-left whitespace-normal" dangerouslySetInnerHTML={{ __html: contenu }}></td>
                        <td className="py-2 px-4 border-b border-gray-600 text-center whitespace-nowrap">{prix} €</td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
          <div className="flex justify-between w-full mt-4">
            {commandesAffichees < commandes.length && (
              <button
                onClick={handleShowMore}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Afficher plus
              </button>
            )}
            {commandesAffichees > 5 && (
              <button
                onClick={handleShowLess}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Afficher moins
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compte;
