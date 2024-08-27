'use client';
import React, { useState, useEffect } from "react";
import { getCommande, getComptes } from "@/config/api";
import { NewCommandes } from "@/types";

type ColoredCommande = NewCommandes & { color: string } & { nom: string };

const CommandesCuisine = () => {
  const [commandes, setCommandes] = useState<ColoredCommande[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(true);

  const toDate = (dateNumber: number) => {
    const date = new Date(Number(dateNumber));
    const jour = ('0' + date.getDate()).slice(-2); // Obtient le jour avec un zéro initial si nécessaire
    const mois = ('0' + (date.getMonth() + 1)).slice(-2); // Obtient le mois avec un zéro initial si nécessaire
    const annee = date.getFullYear(); // Obtient l'année
    return `${annee}-${mois}-${jour}`;
  };

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const fetchCommandes = await getCommande();
        const comptes = await getComptes();

        const resultCommandes: ColoredCommande[] = fetchCommandes
          .filter((commande: ColoredCommande) => commande.payee && commande.contenu)
          .map((commande: ColoredCommande) => ({
            ...commande,
            color: generateRandomColor(commande.id),
            nom: comptes.find((client: { numCompte: number; }) => client.numCompte === commande.numCompte)?.nom || commande.commentaire.split("::")[0] || "Inconnu",
          }))
          .filter(
            (commande: ColoredCommande) => {
              if (
                toDate(commande.date.$date.$numberLong) == new Date().toISOString().split('T')[0] &&
                commande.distribuee == false
              ) { return commande; }
            }
          )

        setCommandes(resultCommandes);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes ou des comptes :", error);
      } finally {
        setLoading(false);
      }
    };

    setInterval(fetchCommandes, 5000);

    // Mettre à jour l'heure chaque seconde
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const colors = [
    '#FF5733', '#33FF57', '#33AFFF', '#FF33A1', '#FF8333',
    '#33FFF5', '#F5FF33', '#8D33FF', '#33FF8D', '#FF3385',
  ];

  const generateRandomColor = (id: number) => {
    const color = colors[(colors.length + id) % colors.length];
    return color; // Ajouter une transparence de 50%
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
  useEffect(() => {
    toggleFullscreen();
  } , []);
  
  if (loading) {
    return <div>Chargement...</div>;
  }



  return (
    <div className={`flex flex-col h-screen overflow-hidden max-w-full ${isFullscreen ? "fixed top-0 left-0 w-full h-full bg-white z-50" : ""}`}>
      <header className="w-full bg-gray-800  p-2 text-center fixed top-0 max-md:top-10">
        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 bg-blue-500  rounded hover:bg-blue-600"
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
            {commandes.filter(commande => (commande.contenu.includes('Sandwich') || commande.contenu.includes('Hot-Dog'))).slice(0, 10).map((commande, index) => {
              const produitsFroids = commande.contenu.split('//').filter(part => part.includes('Sandwich') || part.includes('Hot-Dog'));
              return produitsFroids.map((produit, idx) => (
                <div key={`${index}-${idx}`} className="p-2 rounded shadow-lg text-black" style={{ backgroundColor: commande.color, width: '95%' }}>
                  <h3 className="text-md truncate">{commande.nom}</h3>
                  <p className="text-md font-semibold truncate">{produit}</p>
                  <p className="text-sm text-black truncate">{commande.commentaire.includes("::") ? commande.commentaire.split('::')[1] : commande.commentaire}</p>
                </div>
              ));
            })}
          </div>
        </div>
        <div className="w-1/2 p-2 overflow-hidden">
          <h2 className="text-2xl text-red-800 font-bold mb-4">Paninis et Croque-Monsieur</h2>
          <div className="grid grid-cols-1 gap-2">
            {commandes.filter(commande => (commande.contenu.includes('Panini') || commande.contenu.includes('Croque-Monsieur'))).slice(0, 10).map((commande, index) => {
              const produitsChauds = commande.contenu.split('//').filter(part => part.includes('Panini') || part.includes('Croque-Monsieur'));
              return produitsChauds.map((produit, idx) => (
                <div key={`${index}-${idx}`} className="p-2 rounded shadow-lg text-black" style={{ backgroundColor: commande.color, width: '95%' }}>
                  <h3 className="text-md truncate">{commande.nom}</h3>
                  <p className="text-md font-semibold truncate">{produit}</p>
                  <p className="text-sm text-black truncate">{commande.commentaire.includes("::") ? commande.commentaire.split('::')[1] : commande.commentaire}</p>
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
