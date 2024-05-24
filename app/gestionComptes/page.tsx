'use client';
import React, { Key, useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip} from "@nextui-org/react";
import {columns, listeUtilisateurs } from "./data.js";
import {EditIcon} from "../../public/EditIcon.jsx";
import EditAccountModal from "@/components/EditAccountModal"

// Define types for users

interface UserType {
  id: number;
  name: string;
  firstname: string;
  solde: number;
  access: string;
  [key: string]: any; // To handle dynamic keys
}


function accessColorMap(quelleCouleurPourLUtilisateur:UserType) {
  switch (quelleCouleurPourLUtilisateur.access) {
    case "user":
      return "success" // Affiche les clients en vert
    case "serveur":
      return "primary" // Affiche les serveurs en bleu
    case "admin":
      return "danger" // Affiche les admin en rouge
    default:
      return "warning" // Affiche les rôles imprévu en orange
  }
};

function colorSolde(soldeDuCompte:number) {
  return soldeDuCompte < 0 ? "text-danger" // Affiche le solde en rouge si dans le négatif,
        : soldeDuCompte == 0 ? "text-default" // en gris si le compte est à 0,
        : soldeDuCompte < 3.30 ? "text-warning" // en orange s'il passera dans le négatif à l'achat d'un menu à 3.30 €,
        : "text-success" // en vert si largement dans le positif
}

export default function gestionComptePage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [users, setUsers] = useState<UserType[]>(listeUtilisateurs); // State for users

  const onEditOpen = (user: UserType) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const onEditClose = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const onSubmit = (name: string) => {
    // Modification sur l'utilisateur
    if (currentUser) {
      const editedListeUtilisateurs = users.map((user) =>
        user.id === currentUser.id ? { ...user, name } : user
      );
      setUsers(editedListeUtilisateurs); // Update users state
    }
    onEditClose();
  };

  const renderCell = React.useCallback((user:UserType, columnKey:Key) => {
    const cellValue = user[columnKey as keyof UserType];

    switch (columnKey) {
      case "id":
      case "name":
      case "firstname":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {cellValue}
            </p>
          </div>
        );
      case "solde":
        return (
          <div className="flex flex-col">
            <p className={`text-bold text-sm capitalize ${colorSolde(cellValue)}`}>
              {cellValue + " €"}
            </p>
          </div>
        );
      case "access":
        return (
          <Chip
            className="capitalize"
            color={accessColorMap(user)}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
      );
      case "modifier":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Modifier">
              <span
                onClick={() => onEditOpen(user)}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <EditIcon />
              </span>
            </Tooltip>
          </div>
      );
      default:
        return cellValue;
    }
  }, []);

  return (
    <div>
      <Table aria-label="Liste des comptes">

        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>
              {column.name}
            </TableColumn> )}
        </TableHeader>

        <TableBody items={users}>
          {(item) => (
            <TableRow>
              {(columnKey) =>
                <TableCell>
                  {renderCell(item, columnKey)}
                </TableCell>}
            </TableRow>
          )}
        </TableBody>

      </Table>
      {currentUser && (
         <EditAccountModal
           isOpen={isModalOpen}
           onClose={onEditClose}
           onSubmit={onSubmit}
           currentName={currentUser.name}
         />
      )}
    </div>
  );
}
