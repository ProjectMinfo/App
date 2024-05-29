'use client';
import React, { Key, useState, useEffect } from "react";
import { Chip, Table, TableBody, TableHeader, TableColumn, TableRow, TableCell, Tooltip, User } from "@nextui-org/react";
import { getAchats, postEditAchat } from "@/config/api";
import { EditIcon } from "../../public/EditIcon.jsx";

// Define types for achats
type Achat = {
  idAchat: number;
  categorie: number;
  dateFermeture: Date;
  dateOuverture: Date;
  dlc: Date;
  etat: number;
  idProduit: number;
  nbPortions: number;
  nomArticle: string;
  numLot: string;
  qtePerimee: number;
}

type ColumnKeys = 'nomArticle' | 'categorie' | 'numLot' | 'nbPortions' | 'dateOuverture' | 'dateFermeture' | 'dlc' | 'etat' | 'action';

const columns: { name: string, uid: ColumnKeys }[] = [
  { name: "NOM", uid: "nomArticle" },
  { name: "CATEGORIE", uid: "categorie" },
  { name: "NUMERO DE LOT", uid: "numLot" },
  { name: "QUANTITE", uid: "nbPortions" },
  { name: "DATE D'OUVERTURE", uid: "dateOuverture" },
  { name: "DATE DE FERMETURE", uid: "dateFermeture" },
  { name: "DATE LIMITE DE CONSOMMATION", uid: "dlc" },
  { name: "ETAT", uid: "etat" },
  { name: "ACTION", uid: "action" }
];

function isDateExpired(dateLimite: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // On met à 0 les heures et les minutes (seul le jour nous interesse)

  const targetDate = new Date(dateLimite);
  targetDate.setHours(0, 0, 0, 0);

  return today > targetDate;
}


export default function GestionAchatsPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAchat, setCurrentAchat] = useState<Achat | null>(null);
  const [achats, setAchats] = useState<Achat[]>([]);

  useEffect(() => {
    async function fetchAchats() {
      const fetchedAchats = await getAchats();
      fetchedAchats.sort((a: Achat, b: Achat) => a.idAchat - b.idAchat); // Trie par ordre de numero de compte
      setAchats(fetchedAchats);
    }
    fetchAchats();
  }, []);

  const onEditOpen = (achat: Achat) => {
    setCurrentAchat(achat);
    setIsModalOpen(true);
  };

  const onEditClose = () => {
    setIsModalOpen(false);
    setCurrentAchat(null);
  };

  const renderCell = React.useCallback((achat: Achat, columnKey: ColumnKeys) => {
    const cellValue = achat[columnKey as keyof Achat];

    switch (columnKey) {
      case "nomArticle":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {String(cellValue)}
            </p>
          </div>
        )
      case "categorie":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {String(cellValue)}
            </p>
          </div>
        )
      case "numLot":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {String(cellValue)}
            </p>
          </div>
        )
      case "nbPortions":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {String(cellValue)}
            </p>
          </div>
        )
      case "dateOuverture":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {String(cellValue)}
            </p>
          </div>
        )
      case "dateFermeture":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {String(cellValue)}
            </p>
          </div>
        )
      case "dlc":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {String(cellValue)}
            </p>
          </div>
        )
      case "etat":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {String(cellValue)}
            </p>
          </div>  
        )
      case "action":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Modifier">
              <span
                onClick={() => onEditOpen(achat)}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <EditIcon />
              </span>
            </Tooltip>
          </div>
        );
    }

  }, []);

  return (
    <div>
      <Table aria-label="Liste des achats">

        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>
              {column.name}
            </TableColumn>)}
        </TableHeader>

        <TableBody items={achats}>
          {(item) => (
            <TableRow key={item.idAchat}>
              {(columnKey) =>
                <TableCell>
                  {renderCell(item, columnKey as ColumnKeys)}
                </TableCell>}
            </TableRow>
          )}
        </TableBody>

      </Table>
      {/* {currentAchat && (
        <EditAchatModal
          isOpen={isModalOpen}
          onClose={onEditClose}
          onSubmit={onSubmit}
          currentName={currentAchat.nom}
          currentFirstname={currentAchat.prenom}
          currentSolde={currentAchat.montant}
          currentAccess={currentAchat.acces}
        />
      )} */}
    </div>
  );
}