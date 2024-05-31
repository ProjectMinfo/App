'use client';
import React, { Key, useState, useEffect } from "react";
import { Chip, Checkbox, Table, TableBody, TableHeader, TableColumn, TableRow, TableCell, Tooltip, Input } from "@nextui-org/react";
import { getAchats, postEditAchat } from "@/config/api";
import { EditIcon } from "../../public/EditIcon.jsx";
import EditAchatModal from "@/components/EditAchatModal";

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
  { name: "ARTICLE", uid: "nomArticle" },
  { name: "CATEGORIE", uid: "categorie" },
  { name: "NUMERO DE LOT", uid: "numLot" },
  { name: "QUANTITE", uid: "nbPortions" },
  { name: "OUVERTURE", uid: "dateOuverture" },
  { name: "FIN DE CONSO", uid: "dateFermeture" },
  { name: "DATE LIMITE", uid: "dlc" },
  { name: "ETAT", uid: "etat" },
  { name: "ACTION", uid: "action" }
];

function accessColorMap(achat: Achat) {
  switch (achat.etat) {
    case 0:
      return "primary"; // Affiche les articles non consommés en bleu
    case 1:
      return "success"; // Affiche les articles ouverts en vert
    case 2:
      return "warning"; // Affiche les articles consommés en orange
    case 3:
      return "danger"; // Affiche les articles perimés en rouge
    default:
      return "secondary" // Affiche les articles imprévus en violet
  }
};

const formatDate = (date: any) => {
  if (date && date.$date) {
    const timestamp = parseInt(date.$date.$numberLong); // récupère le timestamp de la date
    const dateObj = new Date(timestamp); // crée une nouvelle date avec ce timestamp
    return dateObj.toLocaleDateString("fr"); // affiche la date au format string
  }
  else {
    return "-"
  }
};

function isDateExpired(achat: any) {
  const dlcTimestamp = parseInt(achat.dlc.$date.$numberLong);
  const dlcDate = new Date(dlcTimestamp); // On converti le timestamp en date
  dlcDate.setHours(0, 0, 0, 0); // On met à 0 les heures et les minutes (seul le jour nous interesse)

  const today = new Date();
  today.setHours(0, 0, 0, 0); // On met à 0 les heures et les minutes (seul le jour nous interesse)

  if (today.getTime() > dlcDate.getTime()) { return 1 } // Date expirée
  if (today.getTime() === dlcDate.getTime()) { return 2 } // Dernier jour avant expiration
  return 0 // Date non expirée
}


export default function GestionAchatsPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAchat, setCurrentAchat] = useState<Achat | null>(null);
  const [achats, setAchats] = useState<Achat[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // État pour stocker le terme de recherche
  const [isAfficherLesAchatsConsommes, setIsAfficherLesAchatsConsommes] = useState<boolean>(false)
  const [currentAchatIndex, setCurrentAchatIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchAchats() {
      const fetchedAchats = await getAchats();
      fetchedAchats.sort((a: Achat, b: Achat) => a.idAchat - b.idAchat); // Trie par ordre de numero de compte
      setAchats(fetchedAchats);
    }
    fetchAchats();
  }, []);

  const onEditOpen = (achat: Achat, indexAchat: number) => {
    setCurrentAchatIndex(indexAchat);
    setCurrentAchat(achat);
    setIsModalOpen(true);
  };

  const onEditClose = () => {
    setIsModalOpen(false);
    setCurrentAchat(null);
  };

  const convertDateToBDDFormat = (date: any) => {
    if (date.$date) {
      return date
    }
    
    const newDate = new Date(date).toISOString();
    return {
      $date: newDate
    };
  };

  const onSubmit = async (nomArticle: string,
    categorie: number,
    numLot: string,
    nbPortions: number,
    dateOuverture: Date,
    dateFermeture: Date,
    dlc: Date,
    etat: number) => {

    // const newDate = convertDateToBDDFormat(nomArticle.dlc)
    const newCurrentAchat = {
      "nomArticle": nomArticle,
      "numLot": numLot,
      "nbPortions": nbPortions,
      "dateOuverture": dateOuverture,
      "dateFermeture": dateFermeture,
      "dlc": dlc,
      "etat": etat
    }

    // Modification sur l'utilisateur
    if (newCurrentAchat && achats) {

      // Mettre à jour l'utilisateur courant avec les nouvelles données avant de l'envoyer à l'API
      const updatedAchat: Achat = { ...currentAchat, ...newCurrentAchat, dlc: convertDateToBDDFormat(dlc) };

      const newListAchats = achats.filter(achat => achat.idAchat !== updatedAchat.idAchat)
      setAchats([...newListAchats, updatedAchat])

      try {
        await postEditAchat(updatedAchat); // Appel à l'API pour enregistrer les modifications
        console.log("Achat updated successfully in the API");
      }
      catch (error) {
        console.error("Error updating achat:", error);
      }

      if (currentAchatIndex !== null && achats) {
        const updatedAchatList = [...achats];
        updatedAchatList[currentAchatIndex] = updatedAchat;
        setAchats(updatedAchatList);
      }
    }

    onEditClose();
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
              {cellValue === 0 ? "Ingrédient"
                : cellValue === 1 ? "viande"
                  : cellValue === 2 ? "Boisson"
                    : cellValue === 3 ? "Snack"
                      : "error"}
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
              {formatDate(cellValue)}
            </p>
          </div>
        )
      case "dateFermeture":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">
              {formatDate(cellValue)}
            </p>
          </div>
        )
      case "dlc":
        return (
          <div className="flex flex-col">
            <p className={`text-bold text-sm capitalize ${achat.etat !== 2 && isDateExpired(achat) === 1 ? "text-danger" // Si l'achat perime le lendemain (et qu'il n'a pas été consommé)
              : achat.etat !== 2 && isDateExpired(achat) === 2 ? "text-warning" // Si l'achat est perimé (et qu'il n'a pas déjà été consommé)
                : "default"}`}>
              {formatDate(cellValue)}
            </p>
          </div>
        )
      case "etat":
        if (isDateExpired(achat) === 1 && (achat.etat === 0 || achat.etat === 1)) {
          achat.etat = 3;
        }
        return (
          <Chip
            className="capitalize"
            color={accessColorMap(achat)}
            size="sm"
            variant="flat"
          >
            {achat.etat === 0 ? "Non entamé"
              : achat.etat === 1 ? "Ouvert"
                : achat.etat === 2 ? "Consommé"
                  : achat.etat === 3 ? "Périmé"
                    : "error"}
          </Chip>
        )
      case "action":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Modifier">
              <span
                onClick={() => onEditOpen(achat, achat.idAchat)}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <EditIcon />
              </span>
            </Tooltip>
          </div>
        );
    }

  }, [onEditOpen]);


  const filteredAchats = achats.filter((achat) =>
    (isAfficherLesAchatsConsommes
      ? achat.etat === 2
      : achat.etat === 0 || achat.etat === 1 || achat.etat === 3) &&
    (achat.nomArticle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achat.numLot.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <div>
      <div className="mb-4">
        <Input
          isClearable
          placeholder="Rechercher par article / numéro de lot"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Checkbox onValueChange={setIsAfficherLesAchatsConsommes}>Afficher les articles consommé</Checkbox>

      <Table aria-label="Liste des achats">

        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>
              {column.name}
            </TableColumn>)}
        </TableHeader>

        <TableBody items={filteredAchats}>
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
      {currentAchat && (
        <EditAchatModal
          isOpen={isModalOpen}
          onClose={onEditClose}
          onSubmit={onSubmit}
          currentNomArticle={currentAchat.nomArticle}
          currentCategorie={currentAchat.categorie}
          currentNumLot={currentAchat.numLot}
          currentNbPortions={currentAchat.nbPortions}
          currentDateOuverture={currentAchat.dateOuverture}
          currentdateFermeture={currentAchat.dateFermeture}
          currentDlc={currentAchat.dlc}
          currentEtat={currentAchat.etat}
        />
      )}
    </div>
  );
}