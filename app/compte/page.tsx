'use client'; // Indique que ce composant doit être rendu côté client.
import React, { useState, useEffect } from "react";
import { getUser, getCommandesByIdUser, getBoissons, getSnacks } from "@/config/api";
import { Card } from "@nextui-org/react";

const Compte = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commandes, setCommandes] = useState([]);
  const [boissonsAll, setBoissonsAll] = useState([]);
  const [snacksAll, setSnacksAll] = useState([]);
  const [commandesAffichees, setCommandesAffichees] = useState(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedUser = await getUser(587);
        setUser(fetchedUser);
        const fetchedCommandes = await getCommandesByIdUser(587);
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
    <div className="container mx-auto p-4 bg-black text-white min-h-screen">
      <div className="flex-grow flex w-full space-x-8">
        <Card className="w-1/3 h-3/4">
          <h2 className="text-2xl font-semibold mb-4 text-center">Mes informations personnelles</h2>
          <p className="mb-4">Pour modifier ces informations, merci de vous rendre au comptoir.</p>
          <div className="space-y-2 m-2">
            <div className="text-left"><a className="font-bold">Nom :  </a>{user.nom}</div>
            <div className="text-left"><a className="font-bold">Prénom :  </a>{user.prenom}</div>
            <div className="text-left"><a className="font-bold">Identifiant :  </a>{user.numCompte}</div>
            <div className="text-left"><a className="font-bold">Adresse mail :  </a>{user.email}</div>
            <div className="text-left"><a className="font-bold">Promo :  </a>{user.promo}</div>
          </div>
          <button className="bg-red-500 text-white py-2 px-4 rounded">Me déconnecter</button>
        </Card>
        <div className="w-2/3">
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-semibold mb-4 text-left">Mes transactions</h2>
            <div className="bg-green-500 text-white px-7 p-4 rounded">Solde actuel : {user.montant.toFixed(2)} €</div>
          </div>
          <table className="min-w-full bg-black text-white shadow-md rounded-lg mb-4">
            <thead className="bg-gray-700">
              <tr>
                <th className="py-2 px-4 border-b border-gray-600 text-center">Date</th>
                <th className="py-2 px-4 border-b border-gray-600 text-left">Contenu</th>
                <th className="py-2 px-4 border-b border-gray-600 text-center">Prix</th>
              </tr>
            </thead>
            <tbody>
              {commandes
                .filter(commande => commande.prix > 0)
                .slice(0, commandesAffichees)
                .map((commande) => {
                  const contenu = commandeContenu(commande);
                  const prix = commande.prix.toFixed(2);
                  return (
                    <tr key={commande.id} className="hover:bg-gray-600 cursor-pointer">
                      <td className="py-2 px-4 border-b border-gray-600 text-center">{toDate(commande.date.$date.$numberLong)}</td>
                      <td className="py-2 px-4 border-b border-gray-600 text-left" dangerouslySetInnerHTML={{ __html: contenu }}></td>
                      <td className="py-2 px-4 border-b border-gray-600 text-center">{prix} €</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          <div className="flex justify-between mt-4">
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
