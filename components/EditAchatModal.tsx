import React, { useState, useEffect } from "react";
import { CalendarDate, DateInput, Radio, RadioGroup, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import moment from 'moment';
import { parseDate } from "@internationalized/date";


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
        return (moment(dateObj)).format('YYYY-MM-DD')
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
    const [formatDlc, setFormatDlc] = useState(parseDate("2024-04-04"));
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
        setFormatDlc(parseDate(formatDate(dlc)));
        setEtat(currentEtat);
    }, [currentNomArticle, currentCategorie, currentNumLot, currentNbPortions, currentDateOuverture, currentdateFermeture, currentDlc, currentEtat]);

    const handleNumLotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumLot(event.target.value);
    };

    const handleNbPortionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNbPortions(Number(event.target.value));
    };

    const handleDlcChange = (date: CalendarDate) => {
        // Convertir l'objet CalendarDate en une instance de Date standard
        const jsDate = new Date(date.year, date.month - 1, date.day);

        // Mettre à jour l'état formatDlc avec la nouvelle date
        setFormatDlc(date);

        // Mettre à jour l'état dlc avec la date standard JavaScript
        setDlc(jsDate);
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

                    <DateInput
                        label="Date limite de consommation :"
                        value={formatDlc}
                        onChange={handleDlcChange}
                    />

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