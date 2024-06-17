'use client';
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from 'next/navigation';
import { ChevronDown } from "./iconNavbar.jsx";
import Link from 'next/link';
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { ThemeSwitch } from "@/components/theme-switch";

const Navbarr = () => {
  const activePath = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} height={undefined} width={undefined} />,
    menu: <MenuIcon className="h-6 w-6 " />,
    close: <XIcon className="h-6 w-6 text-white" />,
  };

  const isActive = (path: string) => activePath === path ? 'border-y-3 font-semibold' : '';

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  const handleLinkClick = () => {
    setIsDropdownOpen(false);
    setIsNavOpen(false); // Fermer également la navbar en mode téléphone
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex z-50 max-md:w-0 w-1/6">
      {/* Navbar */}
      <div className={`fixed top-0 left-0 h-full bg-red-500 text-white py-4 px-4 w-64 md:w-1/6 z-10 transform ${isNavOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 overflow-y-auto `}>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-center h-32">
            <Link href="/" className="flex flex-col items-center justify-center space-y-2" onClick={handleLinkClick}>
              <img src="logo.png" alt="Logo" className="h-16 w-auto" />
              <h2 className=" text-4xl font-semibold">CHTI'MI</h2>
            </Link>
          </div>

          <div className="flex flex-col space-y-6 text-center text-lg">
            <div className={isActive('/commande')}>
              <Link href="/commande" onClick={handleLinkClick}>
                Commande
              </Link>
            </div>


            <div className={isActive('/priseCommande')}>
              <Link href="/priseCommande" onClick={handleLinkClick}>
                Prise commande
              </Link>
            </div>

            <div className={isActive('/carte')}>
              <Link href="/carte" onClick={handleLinkClick}>
                Carte
              </Link>
            </div>

            <div className={isActive('/affichageCuisine')}>
              <Link href="/affichageCuisine" onClick={handleLinkClick}>
                Affichage cuisine
              </Link>
            </div>

            <div className={isActive('/planningServeur')}>
              <Link href="/planningServeur" onClick={handleLinkClick}>
                Planning serveur
              </Link>
            </div>

            <div ref={dropdownRef} className="relative cursor-pointer">
              <div
                className={`flex items-center justify-center p-2 transition-colors duration-200 ${isActive('/gestionStock') || isActive('/gestionAchats') || isActive('/gestionComptes') || isActive('/gestionTemp') ? 'border-y-3 font-semibold' : ''}`}
                onClick={toggleDropdown}
              >
                Gestions
                <span className="ml-2">{icons.chevron}</span>
              </div>
              {isDropdownOpen && (
                <div className="absolute top-12 left-0 bg-red-500 border-3 border-red-800 shadow-lg rounded-lg mt-2 z-10  text-left w-full text-base p-2">
                  <div className="py-2 space-y-2">
                    <div className={isActive('/gestionStock')}>
                      <Link href="/gestionStock" onClick={handleLinkClick}>Gestion des stocks</Link>
                    </div>
                    <div className={isActive('/gestionAchats')}>
                      <Link href="/gestionAchats" onClick={handleLinkClick}>Gestion des achats</Link>
                    </div>
                    <div className={isActive('/gestionComptes')}>
                      <Link href="/gestionComptes" onClick={handleLinkClick}>Gestion des comptes</Link>
                    </div>
                    <div className={isActive('/gestionTemps')}>
                      <Link href="/gestionTemps" onClick={handleLinkClick}>Gestion des températures</Link>
                    </div>
                    <div className={isActive('/gestionCarte')}>
                      <Link href="/gestionCarte" onClick={handleLinkClick}>
                        Modifications cartes
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>



            <div className={isActive('/dashboard')}>
              <Link href="/dashboard" onClick={handleLinkClick}>
                Dashboard
              </Link>
            </div>

            <div className={isActive('/compte')}>
              <Link href="/compte" onClick={handleLinkClick}>
                Compte
              </Link>
            </div>

            <div className={isActive('/parametre')}>
              <Link href="/parametre" onClick={handleLinkClick}>
                Paramètres
              </Link>
            </div>

            <div className="flex items-center justify-center">
              <ThemeSwitch />
            </div>

          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className={`flex-1 p-4 md:ml-64 md:w-5/6`}>
        <div className="md:hidden fixed top-0 left-0 z-20 p-4">
          <button onClick={() => setIsNavOpen(!isNavOpen)}>
            {isNavOpen ? icons.close : icons.menu}
          </button>
        </div>
        {/* Placez ici le contenu de votre page */}
        <div>
          {/* Votre contenu ici */}
        </div>
      </div>
    </div>
  );
};

export default Navbarr;
