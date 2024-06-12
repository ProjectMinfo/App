'use client';
import React, { useState, useEffect } from "react";
import { getCommande, getComptes } from "@/config/api"; // Assurez-vous que le chemin est correct pour vos appels API
import { NewCommandes, Comptes } from "@/types"; // Assurez-vous que le chemin est correct pour vos types

type ColoredCommande = NewCommandes & { color: string } & { nom: string };

const CommandesCuisine = () => {
  const [commandes, setCommandes] = useState<ColoredCommande[]>([]);
  const [clients, setClients] = useState<Comptes[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const fetchCommandes = await getCommande();
        const comptes = await getComptes();

        const resultCommandes: ColoredCommande[] = fetchCommandes
          .filter((commande: ColoredCommande) => commande.payee && commande.contenu)
          .map((commande: ColoredCommande) => ({
            ...commande,
            color: generateRandomColor(),
            nom: comptes.find((client: { numCompte: number; }) => client.numCompte === commande.numCompte)?.nom || "Inconnu",
          }));

        setCommandes(resultCommandes);
        setClients(comptes);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes ou des comptes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();

    // Mettre à jour l'heure chaque seconde
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8333',
    '#33FFF5', '#F5FF33', '#8D33FF', '#33FF8D', '#FF3385',
    '#FF5733CC', '#33FF57CC', '#3357FFCC', '#FF33A1CC', '#FF8333CC',
    '#33FFF5CC', '#F5FF33CC', '#8D33FFCC', '#33FF8DCC', '#FF3385CC'
  ];

  let colorIndex = 0;

  const generateRandomColor = () => {
    const color = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
    return color + '80'; // Ajouter une transparence de 50%
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className={`flex flex-col h-screen overflow-hidden max-w-full ${isFullscreen ? "fixed top-0 left-0 w-full h-full bg-white z-50" : ""}`}>
      <header className="w-full bg-gray-800 text-white p-2 text-center fixed top-0 max-md:top-10">
        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              toggleFullscreen();
            }}
          >
            {isFullscreen ? "Quitter le plein écran" : "Plein écran"}
          </button>
          <div className="text-xl">{currentTime.toLocaleTimeString()}</div>
        </div>
      </header>
      <div className="flex flex-1 p-4 pt-16 overflow-hidden max-w-full">
        <div className="w-1/2 p-2 border-r border-gray-300 overflow-hidden">
          <h2 className="text-2xl text-blue-800 font-bold mb-4">Sandwichs et Hot-Dogs</h2>
          <div className="grid grid-cols-1 gap-2">
            {commandes.filter(commande => commande.contenu.includes('Sandwich') || commande.contenu.includes('Hot-Dog')).slice(0, 10).map((commande, index) => {
              const produitsFroids = commande.contenu.split('//').filter(part => part.includes('Sandwich') || part.includes('Hot-Dog'));
              return produitsFroids.map((produit, idx) => (
                <div key={`${index}-${idx}`} className="p-2 rounded shadow-lg bg-white bg-opacity-80 text-black" style={{ backgroundColor: commande.color, height: '80px', width: '95%' }}>
                  <h3 className="text-md font-semibold truncate">{commande.nom}</h3>
                  <p className="text-sm mt-1 truncate">{produit}</p>
                  <p className="text-xs text-black mt-1 truncate">{commande.commentaire}</p>
                </div>
              ));
            })}
          </div>
        </div>
        <div className="w-1/2 p-2 overflow-hidden">
          <h2 className="text-2xl text-red-800 font-bold mb-4">Paninis et Croque-Monsieur</h2>
          <div className="grid grid-cols-1 gap-2">
            {commandes.filter(commande => commande.contenu.includes('Panini') || commande.contenu.includes('Croque-Monsieur')).slice(0, 10).map((commande, index) => {
              const produitsChauds = commande.contenu.split('//').filter(part => part.includes('Panini') || part.includes('Croque-Monsieur'));
              return produitsChauds.map((produit, idx) => (
                <div key={`${index}-${idx}`} className="p-2 rounded shadow-lg bg-white bg-opacity-80 text-black" style={{ backgroundColor: commande.color, height: '80px', width: '95%' }}>
                  <h3 className="text-md font-semibold truncate">{commande.nom}</h3>
                  <p className="text-sm mt-1 truncate">{produit}</p>
                  <p className="text-xs text-black mt-1 truncate">{commande.commentaire}</p>
                </div>
              ));
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandesCuisine;
