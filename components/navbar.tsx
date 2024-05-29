'use client';
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from 'next/navigation'; // Importer usePathname de Next.js pour obtenir le chemin actif
import { ChevronDown } from "./iconNavbar.jsx"; // Importation de l'icône ChevronDown
import Link from 'next/link'; // Importation de Link de Next.js

const Navbarr = () => {
  const activePath = usePathname(); // Obtenir le chemin actif pour déterminer quel lien est actif
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // État pour suivre si le menu déroulant est ouvert ou fermé
  const dropdownRef = useRef(null); // Référence pour le menu déroulant afin de détecter les clics en dehors

  // Définition des icônes utilisées dans le menu
  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} height={undefined} width={undefined} />,
  };

  // Fonction pour vérifier si un chemin est actif et appliquer des classes CSS conditionnelles
  const isActive = (path) => activePath === path ? 'border-y-3 font-semibold' : '';

  // Fonction pour basculer l'état du menu déroulant
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Fonction pour gérer les clics en dehors du menu déroulant et le fermer
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  // Fonction pour gérer le clic sur un lien du menu déroulant et le fermer
  const handleLinkClick = () => {
    setIsDropdownOpen(false);
  };

  // Ajouter un écouteur d'événements pour détecter les clics en dehors du menu déroulant
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen bg-red-500 text-white py-4 px-4 w-1/6 z-0">
      <div className="flex flex-col space-y-4">

        {/* Logo et titre */}
        <div>
          <Link href="/" className="relative h-32 flex items-center justify-center ">
            <img src="logo.png" alt="Logo" className="h-16 w-auto" />
            <h2 className="text-white text-4xl font-semibold">CHTI'MI</h2>
          </Link>
        </div>

        {/* Liens de navigation principaux */}
        <div className="flex flex-col space-y-6 text-center text-lg" >

          <div className={isActive('/commande')}>
            <Link href="/commande">
              Commande
            </Link>
          </div>

          <div className={isActive('/carte')}>
            <Link href="/carte">
              Carte
            </Link>
          </div>

          <div className={isActive('/priseCommande')}>
            <Link href="/priseCommande">
              Prise commande
            </Link>
          </div>

          <div className={isActive('/affichageCuisine')}>
            <Link href="/affichageCuisine">
              Affichage cuisine
            </Link>
          </div>

          <div className={isActive('/planningServeur')}>
            <Link href="/planningServeur">
              Planning serveur
            </Link>
          </div>

          {/* Menu déroulant pour les gestions */}
          <div ref={dropdownRef} className="relative cursor-pointer">
            <div
              className={`flex items-center justify-center p-2 transition-colors duration-200 ${isActive('/gestionStock') || isActive('/gestionAchats') || isActive('/gestionComptes') || isActive('/gestionTemp') ? 'border-y-3 font-semibold' : ''}`}
              onClick={toggleDropdown}
            >
              Gestions
              <span className="ml-2">{icons.chevron}</span>
            </div>
            {isDropdownOpen && (
              <div className="absolute top-12 left-3 bg-red-500 border-3 border-red-800 shadow-lg rounded-lg mt-2 z-10 text-white text-left w-1/1 text-base p-2">
                <div className="py-2 space-y-2">
                  <div className="">
                    <Link href="/gestionStock" onClick={handleLinkClick}>Gestion des stocks</Link>
                  </div>
                  <div className="">
                    <Link href="/gestionAchats" onClick={handleLinkClick}>Gestion des achats</Link>
                  </div>
                  <div className="">
                    <Link href="/gestionComptes" onClick={handleLinkClick}>Gestion des comptes</Link>
                  </div>
                  <div className="">
                    <Link href="/gestionTemp" onClick={handleLinkClick}>Gestion des températures</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={isActive('/gestionCarte')}>
            <Link href="/gestionCarte">
              Modifications cartes
            </Link>
          </div>

          <div className={isActive('/tresorerie')}>
            <Link href="/tresorerie">
              Trésorerie
            </Link>
          </div>

          <div className={isActive('/compte')}>
            <Link href="/compte">
              Compte
            </Link>
          </div>

          <div className={isActive('/parametre')}>
            <Link href="/parametre">
              Paramètres
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Navbarr;
