import React, { useState, useEffect } from "react";
import { DateInput, Radio, RadioGroup, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

interface EditAchatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        nomArticle: string,
        categorie: number,
        numLot: string,
        nbPortions: number,
        dateOuverture: Date,
        dateFermeture: Date,
        dlc: Date,
        etat: number
    ) => void;
    currentNomArticle: string;
    currentCategorie: number;
    currentNumLot: string;
    currentNbPortions: number;
    currentDateOuverture: Date;
    currentdateFermeture: Date;
    currentDlc: Date;
    currentEtat: number;
}

const formatDate = (date: any) => {
    if (date && date.$date) {
      const timestamp = parseInt(date.$date.$numberLong); // récupère le timestamp de la date
      const dateObj = new Date(timestamp); // crée une nouvelle date avec ce timestamp
      return dateObj; // affiche la date au format string
    }
    else {
        console.log("merde")
    }
  };

export default function EditAccountModal({
    isOpen,
    onClose,
    onSubmit,
    currentNomArticle,
    currentCategorie,
    currentNumLot,
    currentNbPortions,
    currentDateOuverture,
    currentdateFermeture,
    currentDlc,
    currentEtat
}: EditAchatModalProps) {

    const [nomArticle, setNomArticle] = useState<string>(currentNomArticle);
    const [categorie, setCategorie] = useState<number>(currentCategorie);
    const [numLot, setNumLot] = useState<string>(currentNumLot);
    const [nbPortions, setNbPortions] = useState<number>(currentNbPortions);
    const [dateOuverture, setDateOuverture] = useState<Date>(currentDateOuverture);
    const [dateFermeture, setDateFermeture] = useState<Date>(currentdateFermeture);
    const [dlc, setDlc] = useState<Date>(currentDlc);
    const [etat, setEtat] = useState<number>(currentEtat);

    // Initialize variables with the values from the database on startup
    useEffect(() => {
        setNomArticle(currentNomArticle);
        setCategorie(currentCategorie);
        setNumLot(currentNumLot);
        setNbPortions(currentNbPortions);
        setDateOuverture(currentDateOuverture);
        setDateFermeture(currentdateFermeture);
        setDlc(currentDlc);
        setEtat(currentEtat);
    }, [currentNomArticle, currentCategorie, currentNumLot, currentNbPortions, currentDateOuverture, currentdateFermeture, currentDlc, currentEtat]);

    const handleNumLotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumLot(event.target.value);
    };

    const handleNbPortionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNbPortions(Number(event.target.value));
    };

    // const handleDateOuvertureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setDateOuverture(event.target.value);
    // };

    // const handleDateFermetureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setDateFermeture(event.target.value);
    // };

    const handleDlcChange = (date: Date | null) => {
        setDlc(date || new Date()); // Ensure date is not null
    };

    const isEtatSelected = (accessSelected: string) => {
        setEtat(Number(accessSelected)); // Update the selected access
    }

    const handleSubmit = () => {
        onSubmit(nomArticle, categorie, numLot, nbPortions, dateOuverture, dateFermeture, dlc, etat);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Modifier l'achat
                </ModalHeader>

                <ModalBody>
                    {categorie === 0 ? "Ingrédient" : categorie === 1 ? "Viande" : categorie === 2 ? "Boisson" : categorie === 3 ? "Snack" : "Catégorie inconnue"} : {nomArticle}
                    <Input
                        autoFocus
                        label="Numéro de lot"
                        type="string"
                        value={numLot}
                        onChange={handleNumLotChange}
                        variant="bordered"
                    />

                    <Input
                        autoFocus
                        label="Quantité de l'article"
                        type="number"
                        value={String(nbPortions)}
                        onChange={handleNbPortionsChange}
                        variant="bordered"
                    />

                    <RadioGroup
                        isRequired
                        defaultValue={String(etat)}
                        onValueChange={isEtatSelected}
                    >
                        <div className="flex gap-4">
                            <Radio value="0"> Non entamé </Radio>
                            <Radio value="1"> Ouvert </Radio>
                            <Radio value="2"> Consommé </Radio>
                            <Radio value="3"> Périmé </Radio>
                        </div>
                    </RadioGroup>

                    <div className="flex flex-col">
                        <DateInput
                        label="Date limite de consommation :"
                        selectedDate={formatDate(dlc)}
                        onChange={handleDlcChange}
                        dateFormat="dd/MM/yyyy"
                        />
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        Annuler
                    </Button>

                    <Button color="primary" onPress={handleSubmit}
                    >
                        Valider
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    );
}