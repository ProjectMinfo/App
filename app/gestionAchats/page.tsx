'use client';
import React, { Key, useState, useEffect } from "react";
import { Button, Chip, Checkbox, Table, TableBody, TableHeader, TableColumn, TableRow, TableCell, Tooltip, Input } from "@nextui-org/react";
import { getAchats, postEditAchat, deleteAchats } from "@/config/api";
import { FaShoppingCart } from "react-icons/fa";
import { SlSocialDropbox } from "react-icons/sl";
import { BsBoxSeam } from "react-icons/bs";
import { FaSkullCrossbones } from "react-icons/fa6";
import { EditIcon } from "@/public/EditIcon.jsx";
import { DeleteIcon } from "@/public/DeleteIcon.jsx";
import { BiRevision } from "react-icons/bi";
import AddAchatModal from "@/components/AddAchatModal";
import EditAchatModal from "@/components/EditAchatModal";
import DeleteAchatModal from "@/components/DeleteAchatModal";

// Define types for achats
type Achat = {
  idAchat: number;
  categorie: number;
  dateFermeture: Date | null;
  dateOuverture: Date | null;
  dlc: Date;
  etat: number;
  idProduit: number;
  nbPortions: number;
  nomArticle: string;
  numLot: string;
  qtePerimee: number;
}

enum CategorieAchat {
  Ingrédient = 0,
  Viande = 1,
  Boisson = 2,
  Snack = 3
}

enum EtatAchat {
  NonEntame = 0,
  Ouvert = 1,
  Consomme = 2,
  Perime = 3,
  Perte = 4
}

enum Expiration {
  DateNonExpirée = 0,
  DateExpirée = 1,
  DateExpiréeDemain = 2
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
    case EtatAchat.NonEntame:
      return "primary"; // Affiche les articles non consommés en bleu
    case EtatAchat.Ouvert:
      return "success"; // Affiche les articles ouverts en vert
    case EtatAchat.Consomme:
      return "warning"; // Affiche les articles consommés en orange
    case EtatAchat.Perime:
      return "danger"; // Affiche les articles perimés (encore dans les stocks) en rouge
    case EtatAchat.Perte:
      return "secondary" // Affiche les articles perdu (perimés jetés) en violet
    default:
      return "default"
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

  if (today.getTime() > dlcDate.getTime()) { return Expiration.DateExpirée }
  if (today.getTime() === dlcDate.getTime()) { return Expiration.DateExpiréeDemain }
  return Expiration.DateNonExpirée
}

const convertDateToBDDFormat = (date: any) => {
  if (date === null) { return null; }
  if (date.$date) { return date }

  const newDate = new Date(date).toISOString();
  return {
    $date: {
      $numberLong: String(new Date(newDate).getTime())
    }
  };
};


export default function GestionAchatsPage() {

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAchat, setCurrentAchat] = useState<Achat | null>(null);
  const [achats, setAchats] = useState<Achat[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // État pour stocker le terme de recherche
  const [isAfficherLesAchatsConsommes, setIsAfficherLesAchatsConsommes] = useState<boolean>(false)
  const [currentAchatIndex, setCurrentAchatIndex] = useState<number>();

  useEffect(() => {
    async function fetchAchats() {
      const fetchedAchats = await getAchats();
      fetchedAchats.sort((a: Achat, b: Achat) => a.idAchat - b.idAchat); // Trie par ordre de numero de compte
      setAchats(fetchedAchats);
    }
    fetchAchats();
  }, []);


  // OUVRIR ACHAT

  const onChangementEtat = async (achat: Achat) => {
    const changedAchat = { ...achat };
    switch (achat.etat) {
      case EtatAchat.NonEntame:
        changedAchat.etat = EtatAchat.Ouvert; // Si l'achat est non entamé, on l'ouvre
        changedAchat.dateOuverture = convertDateToBDDFormat(new Date()); // On met la date d'ouverture à la date actuelle
        changedAchat.dateFermeture = convertDateToBDDFormat(null); // On met la date de fermeture à la date actuelle
        break;

      case EtatAchat.Ouvert:
        changedAchat.etat = EtatAchat.Consomme; // Si l'achat est ouvert, on le consomme
        changedAchat.dateFermeture = convertDateToBDDFormat(new Date()); // On met la date de fermeture à la date actuelle
        break;

      case EtatAchat.Consomme:
        changedAchat.etat = EtatAchat.NonEntame; // Si l'achat est consommé, on le remet en stock
        changedAchat.dateOuverture = convertDateToBDDFormat(null); // On met la date d'ouverture à null
        changedAchat.dateFermeture = convertDateToBDDFormat(null); // On met la date de fermeture à null
        break;

      case EtatAchat.Perime:
        changedAchat.etat = EtatAchat.Perte; // Si l'achat est perimé, on le déclare comme une perte
        changedAchat.dateFermeture = convertDateToBDDFormat(new Date()); // On met la date de fermeture à la date actuelle
        break;

      case EtatAchat.Perte:
        changedAchat.etat = EtatAchat.Perime; // Si l'achat est perdu, on le remet en stock
        changedAchat.dateOuverture = convertDateToBDDFormat(null); // On met la date d'ouverture à null
        changedAchat.dateFermeture = convertDateToBDDFormat(null); // On met la date de fermeture à null
        break;
    }
    // On retire l'achat courant de la liste
    const newListAchats = achats.filter(achat => achat.idAchat !== changedAchat.idAchat)

    // On ajoute l'achat modifié à la liste
    const updatedAchats = [...newListAchats, changedAchat];

    // On retrie la liste
    updatedAchats.sort((a: Achat, b: Achat) => a.idAchat - b.idAchat);

    // On met à jour la liste des achats
    setAchats(updatedAchats);

    try {
      await postEditAchat(changedAchat); // Appel à l'API pour enregistrer les modifications
      console.log("Achat updated successfully in the API");
    }
    catch (error) {
      console.error("Error updating achat:", error);
    }
  };

  // ADD //

  const onAddOpen = () => {
    setIsAddModalOpen(true);
  };

  const onAddClose = () => {
    setIsAddModalOpen(false);
  };

  const onAddSubmit = async (newAchat: Achat) => {
    if (newAchat && achats) {
      const updatedAchats = [...achats, newAchat]; // On ajoute l'achat à la liste
      updatedAchats.sort((a: Achat, b: Achat) => a.idAchat - b.idAchat); // On retrie la liste
      setAchats(updatedAchats); // On met à jour la liste des achats
      newAchat.idAchat = -1; // Pour créer un nouvel achat

      try {
        await postEditAchat(newAchat); // Appel à l'API pour enregistrer les modifications
        console.log("Achat added successfully in the API");
      }
      catch (error) {
        console.error("Error adding achat:", error);
      }
    }

    onAddClose();
  };






  // EDIT //

  const onEditOpen = (achat: Achat, indexAchat: number) => {
    setCurrentAchatIndex(indexAchat);
    setCurrentAchat(achat);
    setIsEditModalOpen(true);
  };

  const onEditClose = () => {
    setIsEditModalOpen(false);
    setCurrentAchat(null);
  };

  const onEditSubmit = async (
    nomArticle: string,
    categorie: number,
    numLot: string,
    nbPortions: number,
    dateOuverture: Date | null,
    dateFermeture: Date | null,
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

      // Mettre à jour l'achat courant avec les nouvelles données avant de l'envoyer à l'API
      const updatedAchat: Achat = {
        ...currentAchat,
        ...newCurrentAchat,
        dlc: convertDateToBDDFormat(dlc)
      };

      // On retire l'achat courant de la liste
      const newListAchats = achats.filter(achat => achat.idAchat !== updatedAchat.idAchat)

      // On ajoute l'achat modifié à la liste
      const updatedAchats = [...newListAchats, updatedAchat];

      // On retrie la liste
      updatedAchats.sort((a: Achat, b: Achat) => a.idAchat - b.idAchat);

      // On met à jour la liste des achats
      setAchats(updatedAchats);

      try {
        await postEditAchat(updatedAchat); // Appel à l'API pour enregistrer les modifications
        console.log("Achat updated successfully in the API");
      }
      catch (error) {
        console.error("Error updating achat:", error);
      }
    }

    onEditClose();
  };


  // DELETE //

  const onDeleteOpen = (achat: Achat) => {
    setCurrentAchat(achat)
    setIsDeleteModalOpen(true)
  }

  const onDeleteClose = () => {
    setIsDeleteModalOpen(false);
    setCurrentAchat(null);
  };

  const onDeleteSubmit = async () => {

    // Modification sur l'utilisateur
    if (currentAchat && achats) {

      // On retire l'achat courant de la liste
      const updatedAchats = achats.filter(achat => achat.idAchat !== currentAchat.idAchat)

      // On retrie la liste
      updatedAchats.sort((a: Achat, b: Achat) => a.idAchat - b.idAchat);

      // On met à jour la liste des achats
      setAchats(updatedAchats);

      try {
        await deleteAchats(currentAchat.idAchat); // Appel à l'API pour enregistrer les modifications
        console.log("Achat deleted successfully in the API");
      }
      catch (error) {
        console.error("Error deleting achat:", error);
      }
    }

    onDeleteClose();
  };


  const renderCell = React.useCallback((achat: Achat, columnKey: ColumnKeys, index: number) => {
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
              {cellValue === CategorieAchat.Ingrédient ? "Ingrédient"
                : cellValue === CategorieAchat.Viande ? "viande"
                  : cellValue === CategorieAchat.Boisson ? "Boisson"
                    : cellValue === CategorieAchat.Snack ? "Snack"
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
            <p className={`text-bold text-sm capitalize
            ${((achat.etat !== EtatAchat.Consomme && achat.etat !== EtatAchat.Perte) // Si l'achat n'est pas déjà consommé ou perdu
                && isDateExpired(achat) === Expiration.DateExpirée) // ET si l'achat est perimé
                ? "text-danger" // On affiche la date en rouge

                : ((achat.etat !== EtatAchat.Consomme && achat.etat !== EtatAchat.Perte) // Si l'achat n'est pas déjà consommé ou perdu
                  && isDateExpired(achat) === Expiration.DateExpiréeDemain) // ET si l'achat perime le lendemain
                  ? "text-warning" // On affiche la date en orange

                  : "default" // Sinon on affiche la date en default
              }`
            }>
              {formatDate(cellValue)}
            </p>
          </div>
        )
      case "etat":
        if (isDateExpired(achat) === Expiration.DateExpirée
          && (achat.etat === EtatAchat.NonEntame || achat.etat === EtatAchat.Ouvert)) {
          achat.etat = EtatAchat.Perime; // Si l'achat est périmé on l'affiche comme tel
        }
        if ((isDateExpired(achat) === Expiration.DateNonExpirée || isDateExpired(achat) === Expiration.DateExpiréeDemain)
          && achat.etat === EtatAchat.Perime) {
          achat.etat = EtatAchat.NonEntame; // Si l'achat n'était en fait pas perimé on l'affiche comme non entamé
        }
        return (
          <Chip
            className="capitalize"
            color={accessColorMap(achat)}
            size="sm"
            variant="flat"
          >
            {achat.etat === EtatAchat.NonEntame ? "Non entamé"
              : achat.etat === EtatAchat.Ouvert ? "Ouvert"
                : achat.etat === EtatAchat.Consomme ? "Consommé"
                  : achat.etat === EtatAchat.Perime ? "Périmé"
                    : achat.etat === EtatAchat.Perte ? "Perte"
                      : "error"}
          </Chip>
        )
      case "action":
        return (
          <div className="relative flex items-center gap-2">
            <span
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
              onClick={() => onChangementEtat(achat)}
            >
              {
                achat.etat === EtatAchat.NonEntame ? <SlSocialDropbox /> // Ouverture de l'achat
                  : achat.etat === EtatAchat.Ouvert ? <BsBoxSeam /> // Jeter l'achat
                    : achat.etat === EtatAchat.Perime ? <FaSkullCrossbones /> // Jeter l'achat perimé
                      : <BiRevision /> // Remettre l'achat en stock
              }
            </span>

            <span
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
              onClick={() => onEditOpen(achat, index)}
            >
              <EditIcon />
            </span>

            <span
              className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={() => onDeleteOpen(achat)}
            >
              <DeleteIcon />
            </span>
          </div>
        );
    }

  }, [achats]);


  const filteredAchats = achats.filter((achat) =>
    (isAfficherLesAchatsConsommes
      ? achat.etat === EtatAchat.Consomme || achat.etat === EtatAchat.Perte
      : achat.etat === EtatAchat.NonEntame || achat.etat === EtatAchat.Ouvert || achat.etat === EtatAchat.Perime) &&
    (achat.nomArticle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achat.numLot.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  return (
    <div>

      <div className="flex gap-4 mb-4">
        <Button
          variant="faded"
          aria-label="Ajouter un achat"
          onClick={() => onAddOpen()}
        >
          <AddAchatModal 
            isOpen={isAddModalOpen}
            onClose={onAddClose}
            onSubmit={onAddSubmit}>
          </AddAchatModal>

          <FaShoppingCart /> {/* Icone de caddie */}

        </Button>

        <Input
          autoFocus
          placeholder="Rechercher par article / numéro de lot"
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Checkbox onValueChange={setIsAfficherLesAchatsConsommes} style={{ whiteSpace: 'nowrap' }}>
          Afficher les achats consommés
        </Checkbox>
      </div>

      <Table aria-label="Liste des achats">

        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid}>
              {column.name}
            </TableColumn>)}
        </TableHeader>

        <TableBody items={filteredAchats}>
          {filteredAchats.map((item, index) =>
            <TableRow key={item.idAchat}>
              {(columnKey) =>
                <TableCell>
                  {renderCell(item, columnKey as ColumnKeys, index)}
                </TableCell>}
            </TableRow>
          )}
        </TableBody>

      </Table>
      {currentAchat && (
        <EditAchatModal
          isOpen={isEditModalOpen}
          onClose={onEditClose}
          onSubmit={onEditSubmit}
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
      {currentAchat && (
        <DeleteAchatModal
          isOpen={isDeleteModalOpen}
          onClose={onDeleteClose}
          onSubmit={onDeleteSubmit}
        />
      )}
    </div>
  );
}