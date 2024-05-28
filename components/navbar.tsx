'use client';
import React, { useState, useEffect } from "react";
import {ChevronDown} from "./iconNavbar.jsx";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu } from "@nextui-org/react";
import Link from 'next/link'; // Importation du bon Link



const Navbarr = () => {

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} height={undefined} width={undefined} />,
  };
 
  return (
    <div className="h-screen bg-gray-900 text-white py-4 px-4 w-1/5">
        <div className="flex flex-col space-y-4 text-center">
          
          <div className="relative h-32 w-32 flex items-center">
            <img src="logo.png" alt="Logo" className="h-16 w-auto mb-2" /> 
            <h2 className="text-white text-4xl font-semibold">CHTI'MI</h2>
          </div>
          
          <div className="flex flex-col space-y-6" >
            
            <div>
              <Link href="/">
                Home
              </Link>
            </div>

            <div>
              <Link href="/">
                Commande
              </Link>
            </div>

            <div>
              <Link href="/">
                Prise commande
              </Link>
            </div>

            <div>
              <Link href="/">
                Affichage cuisine
              </Link>
            </div>

            <div>
              <Link href="/">
                Planning serveur
              </Link>
            </div>

            <Dropdown>
              <div>
                <DropdownTrigger>
                  <Button
                    disableRipple
                    className="p-0 bg-transparent data-[hover=true]:bg-transparent"
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
                  <Link href="/">
                    Gestion des stocks
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link href="/">
                    Gestion des achats
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link href="/gestionCompte">
                    Gestion des comptes
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link href="/">
                    Gestion des températures
                  </Link>
                </DropdownItem>
              </DropdownMenu> 
            </Dropdown>



            <div>
              <Link href="/">
                Modifications cartes
              </Link>
            </div>

            <div>
              <Link href="/">
                Trésorerie
              </Link>
            </div>

            <div>
              <Link href="/">
                Compte
              </Link>
            </div>

            <div>
              <Link href="/">
                Paramètres
              </Link>
            </div>

          </div>

        </div>
    </div>
  );
};

export default Navbarr;

