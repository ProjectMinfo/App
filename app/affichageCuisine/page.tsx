'use client';
import React, { useState, useEffect } from "react";
import { getCommande, postCommandeById } from "@/config/api"; // Assurez-vous que le chemin est correct pour vos appels API

interface CommandesWithColor {
  idCommande: number;
  chaud: string;
  commandeIn: string;
  commandeOut: string;
  commentaire: string;
  date: string;
  etat: number;
  froid: string;
  menu: string;
  nom: string;
  numCompte: number;
  numTransaction: number;
  prix: number;
  retireStock: string;
  stock: string;
  typepaiement: number;
  color: string;
}

const CommandesCuisine = () => {
  const [commandes, setCommandes] = useState<CommandesWithColor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const commandes = await getCommande();
        const commandesWithColors = commandes.map((commande: CommandesWithColor) => ({
          ...commande,
          color: generateRandomColor(),
        }));
        setCommandes(commandesWithColors);
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommandes();
  }, []);

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color + '80'; // Ajouter une transparence de 50%
  };

  // Fonction pour valider un élément d'une commande
  const handleValiderElement = async (idCommande: number, type: 'chaud' | 'froid') => {
    try {
      const updatedCommandes = commandes.map(commande => {
        if (commande.idCommande === idCommande) {
          if (type === 'chaud') {
            postCommandeById(idCommande, { chaud: '' });
            return { ...commande, chaud: '' };
          } else {
            postCommandeById(idCommande, { froid: '' });
            return { ...commande, froid: '' };
          }
        }
        return commande;
      }).filter(commande => commande.chaud || commande.froid); // Filtrer les commandes vides

      setCommandes(updatedCommandes);
    } catch (error) {
      console.error("Erreur lors de la validation de l'élément :", error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex h-screen p-4 overflow-hidden max-w-full">
      <div className="w-1/2 p-2 border-r border-gray-300 overflow-hidden">
        <h2 className="text-2xl font-bold mb-4">Sandwichs et Hot-Dogs</h2>
        <div className="grid grid-cols-1 gap-2">
          {commandes.filter(commande => commande.froid).slice(0, 10).map((commande, index) => (
            <div key={index} className="p-2 rounded shadow-lg bg-white bg-opacity-80 text-black" style={{ backgroundColor: commande.color, height: '80px', width: '95%' }}>
              <h3 className="text-md font-semibold truncate">{commande.nom}</h3>
              <p className="text-sm mt-1 truncate">{commande.froid}</p>
              <p className="text-xs text-black mt-1 truncate">{commande.commentaire}</p>
              <button
                className="mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                onClick={() => handleValiderElement(commande.idCommande, 'froid')}
              >
                Valider
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/2 p-2 overflow-hidden">
        <h2 className="text-2xl font-bold mb-4">Paninis et Croque-Monsieur</h2>
        <div className="grid grid-cols-1 gap-2">
          {commandes.filter(commande => commande.chaud).slice(0, 10).map((commande, index) => (
            <div key={index} className="p-2 rounded shadow-lg bg-white bg-opacity-80 text-black" style={{ backgroundColor: commande.color, height: '80px', width: '95%' }}>
              <h3 className="text-md font-semibold truncate">{commande.nom}</h3>
              <p className="text-sm mt-1 truncate">{commande.chaud}</p>
              <p className="text-xs text-black mt-1 truncate">{commande.commentaire}</p>
              <button
                className="mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                onClick={() => handleValiderElement(commande.idCommande, 'chaud')}
              >
                Valider
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommandesCuisine;
