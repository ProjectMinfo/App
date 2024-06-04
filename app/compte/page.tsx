'use client'; // Indique que ce composant doit être rendu côté client.
import React, { useState, useEffect } from "react";
import { getUser, getCommandesByIdUser } from "@/config/api";

const Compte = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commandes, setCommandes] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedUser = await getUser(587);
        setUser(fetchedUser);
        const fetchedCommandes = await getCommandesByIdUser(587);
        setCommandes(fetchedCommandes);
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
    const dateFormatted = `${jour}/${mois}/${annee}`;
    return dateFormatted;
  };

  const commandeContenu = (commande) => {
    const items = commande.contenu
      .split("//")
      .map(item => item.trim().split(":")[0]) // Prend seulement le nom du plat avant les ingrédients
      .filter(item => item !== "");

    const itemCounts = {};
    items.forEach(item => {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    });

    return itemCounts;
  };

  return (
    <div className="min-h-screen flex flex-col p-8">
      <h1 className="text-3xl font-bold mb-6">Compte</h1>
      <div className="flex-grow flex w-full space-x-8">
        <div id="gauche" className="w-1/2 p-6 shadow-md rounded-lg border-2 border-red-500">
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">Mes informations personnelles</h2>
          <p className="mb-4">Pour modifier ces informations, merci de vous rendre au comptoir.</p>
          <div className="space-y-2">
            <p><strong>Nom : {user.nom}</strong> </p>
            <p><strong>Prénom : {user.prenom}</strong> </p>
            <p><strong>Identifiant : {user.numCompte}</strong> </p>
            <p><strong>Adresse mail : {user.email}</strong> </p>
            <p><strong>Promo : {user.promo}</strong> </p>
          </div>
          <button className="mt-4 px-4 py-2 border-2 border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition">Me déconnecter</button>
        </div>
        <div id="droite" className="w-1/2 p-6 shadow-md rounded-lg border-2 border-red-500">
          <h2 className="text-2xl font-semibold mb-4 border-b-2 border-red-500 pb-2">Mes transactions</h2>
          <p className="mb-4">Solde actuel : {user.montant.toFixed(2)} €</p>
          <ul>
            {commandes.map((commande) => {
              const itemCounts = commandeContenu(commande);
              return (
                <li key={commande.id} className="mb-2">
                  <p className="font-semibold">{toDate(commande.date.$date.$numberLong)} :</p>
                  <ul>
                    {Object.entries(itemCounts).map(([item, count]) => (
                      <li key={item}>{count} {item}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Compte; // Exporte le composant Compte par défaut.
