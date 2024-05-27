'use client';
import React, { Key, useState, useEffect } from "react";
import { Chip, Table, TableBody, TableHeader, TableColumn, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import { getComptes } from "@/config/api";
import { columns, listeUtilisateurs } from "./data.js";
import { EditIcon } from "../../public/EditIcon.jsx";
import EditAccountModal from "@/components/EditAccountModal"

// Define types for users
type User = {
  acces: number;
  email: string;
  idCompte: number;
  mdp: string;
  montant: number;
  nom: string;
  numCompte: number;
  prenom: string;
  promo: number;
  resetToken: string;
  tokenExpiration: string;
};

function accessColorMap(user: User) {
  switch (user.acces) {
    case 0:
      return "success"; // Affiche les clients en vert
    case 1:
      return "primary"; // Affiche les serveurs en bleu
    case 2:
      return "danger"; // Affiche les admin en rouge
    default:
      return "warning"; // Affiche les rôles imprévu en orange
  }
};

function colorSolde(solde: number) {
  return solde < 0 ? "text-danger" // Affiche le solde en rouge si dans le négatif,
    : solde == 0 ? "text-default" // en gris si le compte est à 0,
      : solde < 3.30 ? "text-warning" // en orange s'il passera dans le négatif à l'achat d'un menu à 3.30 €,
        : "text-success"; // en vert si largement dans le positif
}

export default function GestionComptePage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(listeUtilisateurs); // State for users
  const [comptes, setComptes] = useState<User[]>([]);

  useEffect(() => {
    async function fetchComptes() {
      const fetchedComptes = await getComptes();
      setComptes(fetchedComptes);
    }
    fetchComptes();
    console.log(comptes);
  }, []);

  const onEditOpen = (user: User) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const onEditClose = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const onSubmit = (nom: string, prenom: string, montant: number, acces: number) => {
    // Modification sur l'utilisateur
    if (currentUser) {
      const editedListeUtilisateurs = users.map((user) =>
        user.idCompte === currentUser.idCompte ? { ...user, nom, prenom, montant, acces } : user
      );
      setUsers(editedListeUtilisateurs); // Update liste des utilisateurs
    }
    onEditClose();
  };

  const renderCell = React.useCallback((user: User, columnKey: Key) => {
    const cellValue = user[columnKey as keyof User];

    switch (columnKey) {
      case "idCompte":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {cellValue}
            </p>
          </div>
        )
      case "nom":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {cellValue}
            </p>
          </div>
        )
      case "prenom":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {cellValue}
            </p>
          </div>
        )
      case "montant":
        return (
          <div className="flex flex-col">
            <p className={`text-bold text-sm capitalize ${colorSolde(cellValue as number)}`}>
              {cellValue + " €"}
            </p>
          </div>
        );
      case "acces":
        return (
          <Chip
            className="capitalize"
            color={accessColorMap(user)}
            size="sm"
            variant="flat"
          >
            {cellValue === 0 ? "user" : cellValue === 1 ? "serveur" : cellValue === 2 ? "admin" : "error"}
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
            </TableColumn>)}
        </TableHeader>

        <TableBody items={users}>
          {(item) => (
            <TableRow key={item.idCompte}>
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
          currentName={currentUser.nom}
          currentFirstname={currentUser.prenom}
          currentSolde={currentUser.montant}
          currentAccess={currentUser.acces}
        />
      )}
    </div>
  );
}
