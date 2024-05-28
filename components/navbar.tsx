'use client';
import React from "react";
import { usePathname } from 'next/navigation'; // Importer useRouter de Next.js
import {ChevronDown} from "./iconNavbar.jsx";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu } from "@nextui-org/react";
import Link from 'next/link'; // Importation du bon Link



const Navbarr = () => {
  const activePath = usePathname();

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} height={undefined} width={undefined} />,
  };

  const isActive = (path: string) => activePath === path ? 'border-t border-b font-semibold' : '';
 
  return (
    <div className="h-screen bg-gray-900 text-white py-4 px-4 w-1/6">
        <div className="flex flex-col space-y-4">
          
          <div className="relative h-32 flex items-center ">
            <img src="logo.png" alt="Logo" className="h-16 w-auto" /> 
            <h2 className="text-white text-4xl font-semibold">CHTI'MI</h2>
          </div>
          
          <div className="flex flex-col space-y-6 text-center text-lg" >
            
            <div className={isActive('/')}>
              <Link href="/">
                Home
              </Link>
            </div>

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

            <Dropdown>
              <div className={isActive('/gestionStock') || isActive('/gestionAchats') || isActive('/gestionComptes') || isActive('/gestionTemp')}>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="p-0 bg-transparent data-[hover=true]:bg-transparent text-lg"
                    endContent={icons.chevron}
                    radius="sm"
                    variant="light"
                  >
                    Gestions
                  </Button>
                </DropdownTrigger>
              </div>
              <DropdownMenu
                aria-label="ACME features"
                className="w-[340px]"
                itemClasses={{
                  base: "gap-4",
                }} 
              >
                <DropdownItem>
                  <Link href="/gestionStock">
                    Gestion des stocks
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link href="/gestionAchats">
                    Gestion des achats
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link href="/gestionComptes">
                    Gestion des comptes
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link href="/gestionTemp">
                    Gestion des températures
                  </Link>
                </DropdownItem>
              </DropdownMenu> 
            </Dropdown>



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

