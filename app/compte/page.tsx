'use client'; // Indique que ce composant doit être rendu côté client.
import React, { Key, useState, useEffect } from "react";
import { getUser, getCommandesByIdUser, getBoissonById} from "@/config/api";


const Compte = () => {
  const [user, setUser] = useState(null); // État pour stocker les informations de l'utilisateur
  const [isLoading, setIsLoading] = useState(true); // État pour indiquer si les données sont en cours de chargement
  const [commandes, setCommandes] = useState(null); // État pour stocker les informations des commandes
  const [boisson, setBoisson] = useState(null); // État pour stocker les informations des boissons



  useEffect(() => {
    async function fetchUser() {
      const fetchedUser = await getUser(587);
      setUser(fetchedUser);
      setIsLoading(false); // Indique que les données ont été chargées
    }

    async function fetchCommande(){
      const fetchedCommande = await getCommandesByIdUser(587);
      setCommandes(fetchedCommande);
      setIsLoading(false); // Indique que les données ont été chargées
    }

    async function fetchBoisson(idBoisson : number){
      const fetchedBoisson = await getBoissonById(idBoisson);
      setBoisson(fetchedBoisson);
      setIsLoading(false);//Indique que les données ont été chargées
    }


    fetchUser();
    fetchCommande();
  }, []);

  if (isLoading) {
    return <div>Chargement...</div>; // Affiche un message de chargement pendant le chargement des données
  }
  
  console.log(user)
  console.log(commandes) 

  for (let i in commandes){
    console.log(commandes[i])
  }

  
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
          <p className="mb-4">Solde actuel : {user.montant} €</p>
        </div>
      </div>
    </div>
  );

};

export default Compte; // Exporte le composant Compte par défaut.


