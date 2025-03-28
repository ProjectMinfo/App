'use client';
import React, { useState, useEffect } from "react";
import { Chip, Table, TableBody, TableHeader, TableColumn, TableRow, TableCell, Tooltip, Input } from "@nextui-org/react";
import { getComptes, postEditCompte } from "@/config/api";
import { EditIcon } from "@/public/EditIcon.jsx";
import EditAccountModal from "@/components/EditAccountModal";
import { Comptes } from "@/types/index.js";
import './styles.css';



type ColumnKeys = 'numCompte' | 'nom' | 'prenom' | 'montant' | 'acces' | 'modifier';

const columns: { name: string, uid: ColumnKeys }[] = [
  { name: "IDENTIFIANT", uid: "numCompte" },
  { name: "NOM", uid: "nom" },
  { name: "PRENOM", uid: "prenom" },
  { name: "SOLDE", uid: "montant" },
  { name: "ACCES", uid: "acces" },
  { name: "MODIFIER", uid: "modifier" }
];

function accessColorMap(user: Comptes) {
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
  const [currentUser, setCurrentUser] = useState<Comptes | null>(null);
  const [comptes, setComptes] = useState<Comptes[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // État pour stocker le terme de recherche

  useEffect(() => {
    async function fetchComptes() {
      const fetchedComptes = await getComptes();
      fetchedComptes.sort((a: Comptes, b: Comptes) => a.numCompte - b.numCompte); // Trie par ordre de numero de compte
      setComptes(fetchedComptes);
    }
    fetchComptes();
  }, []);

  const onEditOpen = (user: Comptes) => {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const onEditClose = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const onSubmit = async (userCompte: Comptes) => {

    // Modification sur l'utilisateur
    if (currentUser && comptes) {

      const editedListeUtilisateurs = comptes.find((compte) => compte.numCompte === currentUser.numCompte) ?
        comptes.map((compte) =>
          compte.numCompte === currentUser.numCompte ? { ...userCompte } : compte
        ) : [...comptes, userCompte];
      setComptes(editedListeUtilisateurs);

      // Mettre à jour l'utilisateur courant avec les nouvelles données avant de l'envoyer à l'API
      const updatedUser = { ...userCompte };

      try {
        await postEditCompte(updatedUser); // Appel à l'API pour enregistrer les modifications
        console.log("User updated successfully in the API");
      }
      catch (error) {
        console.error("Error updating user:", error);
      }
    }
    onEditClose();
  };

  const renderCell = React.useCallback((compte: Comptes, columnKey: ColumnKeys) => {
    const cellValue = compte[columnKey as keyof Comptes];

    switch (columnKey) {
      case "numCompte":
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
              {typeof cellValue === 'number' ? parseFloat(cellValue.toFixed(2)).toFixed(2) : cellValue} €
            </p>
          </div>
        );
      case "acces":
        return (
          <Chip
            className="capitalize"
            color={accessColorMap(compte)}
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
                onClick={() => onEditOpen(compte)}
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
  }, [onEditOpen]);

  // Filtrer les comptes en fonction du terme de recherche
  const filteredComptes = comptes.filter((compte) =>
    compte.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compte.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compte.numCompte.toString().includes(searchTerm)
  );

  return (
    <div>
      <div className="mb-4">
        <Input
          autoFocus
          placeholder="Rechercher..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table aria-label="Liste des comptes">

        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} className="center-text">
              {column.name}
            </TableColumn>)}
        </TableHeader>

        <TableBody items={filteredComptes}>
          {(item) => (
            <TableRow key={item.numCompte}>
              {(columnKey) =>
                <TableCell>
                  {renderCell(item, columnKey as ColumnKeys)}
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
          userCompte={currentUser}
        />
      )}
    </div>
  );
}
