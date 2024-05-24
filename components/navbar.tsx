'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import {ChevronDown} from "./iconNavbar.jsx";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu } from "@nextui-org/react";



const Navbarr = () => {
  // const router = useRouter();
  // const [activePath, setActivePath] = useState("");

  // useEffect(() => {
  //   setActivePath(router.pathname);
  // }, [router.pathname]);

  const icons = {
    chevron: <ChevronDown fill="currentColor" size={16} height={undefined} width={undefined} />,
  };

  
  return (
    <Navbar className="h-screen bg-dark-700 text-white py-4 px-4 w-1/6">
      {/* <div className="flex flex-col"> */}
        <div className="flex flex-col space-y-4">
          
          <NavbarBrand>
            <h2 className="text-white text-2xl font-semibold mb-4">CHTI'MI</h2>
          </NavbarBrand>
          
          <NavbarContent className="flex flex-col">
            
            <NavbarItem>
              <Link href="./" className="text-white">
                Home
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link href="./" className="text-white">
                Commande
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link href="./" className="text-white">
                Prise commande
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link href="./" className="text-white">
                Affichage cuisine
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link href="./" className="text-white">
                Planning serveur
              </Link>
            </NavbarItem>

            <Dropdown>
              <NavbarItem>
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
              </NavbarItem>
              <DropdownMenu
                aria-label="ACME features"
                className="w-[340px]"
                itemClasses={{
                  base: "gap-4",
                }} 
              >
                <DropdownItem>
                  <Link href="./" className="text-white">
                    Gestion des stocks
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link href="./" className="text-white">
                    Gestion des achats
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link href="./gestionCompte" className="text-white">
                    Gestion des comptes
                  </Link>
                </DropdownItem>
                <DropdownItem>
                  <Link href="./" className="text-white">
                    Gestion des températures
                  </Link>
                </DropdownItem>
              </DropdownMenu> 
            </Dropdown>



            <NavbarItem>
              <Link href="./" className="text-white">
                Modifications cartes
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link href="./" className="text-white">
                Trésorerie
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link href="./" className="text-white">
                Compte
              </Link>
            </NavbarItem>

            <NavbarItem>
              <Link href="./" className="text-white">
                Paramètres
              </Link>
            </NavbarItem>

          </NavbarContent>

        </div>
      {/* </div> */}

    </Navbar>
  );
};

export default Navbarr;