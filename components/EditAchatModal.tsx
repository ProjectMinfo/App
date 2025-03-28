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
        dateOuverture: Date | null,
        dateFermeture: Date | null,
        dlc: Date,
        etat: number
    ) => void;
    currentNomArticle: string;
    currentCategorie: number;
    currentNumLot: string;
    currentNbPortions: number;
    currentDateOuverture: Date | null;
    currentdateFermeture: Date | null;
    currentDlc: Date;
    currentEtat: number;
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

const formatDate = (date: any) => {
    // if (date && date.$date) {
    const timestamp = parseInt(date.$date.$numberLong); // récupère le timestamp de la date
    const dateObj = new Date(timestamp); // crée une nouvelle date avec ce timestamp
    return (moment(dateObj)).format('YYYY-MM-DD')
    // }
};


export default function EditAchatModal({
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
    const [dateOuverture, setDateOuverture] = useState<Date | null>(currentDateOuverture);
    const [dateFermeture, setDateFermeture] = useState<Date | null>(currentdateFermeture);
    const [dlc, setDlc] = useState<any>(currentDlc);
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

    const handleDlcChange = (newDate: CalendarDate) => {

        // Mettre à jour l'état formatDlc avec la nouvelle date
        setFormatDlc(newDate);

        // Convertir l'objet CalendarDate en une instance de Date standard
        const jsDate = new Date(newDate.year, newDate.month - 1, newDate.day)
        const timestampDate = jsDate.getTime();

        // Mettre à jour l'état dlc avec la date standard JavaScript
        setDlc({ "$date": { $numberLong: timestampDate.toString() } });

    };

    const isEtatSelected = (accessSelected: string) => {
        const selectedEtat = Number(accessSelected);
        setEtat(selectedEtat);
        if (selectedEtat === EtatAchat.NonEntame) {
            setDateOuverture(null); // Set the opening date to null
            setDateFermeture(null); // Set the closing date to null
        }
        if (selectedEtat === EtatAchat.Ouvert) {
            setDateFermeture(null); // Set the closing date to null
        }
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
                    {categorie === CategorieAchat.Ingrédient ? "Ingrédient"
                        : categorie === CategorieAchat.Viande ? "Viande"
                            : categorie === CategorieAchat.Boisson ? "Boisson"
                                : categorie === CategorieAchat.Snack ? "Snack"
                                    : "Catégorie inconnue"}
                    : {nomArticle}
                    <Input
                        autoFocus
                        label="Numéro de lot"
                        type="string"
                        variant="bordered"
                        value={numLot}
                        onChange={handleNumLotChange}
                    />

                    <Input
                        label="Quantité de l'article"
                        type="number"
                        variant="bordered"
                        value={String(nbPortions)}
                        onChange={handleNbPortionsChange}
                    />

                    <RadioGroup
                        isRequired
                        defaultValue={String(etat)}
                        onValueChange={isEtatSelected}
                    >
                        <div className="flex gap-4">
                            <Radio value={(EtatAchat.NonEntame).toString()}> Non entamé </Radio>
                            <Radio value={(EtatAchat.Ouvert).toString()}> Ouvert </Radio>
                            <Radio value={(EtatAchat.Consomme).toString()}> Consommé </Radio>
                            <Radio value={(EtatAchat.Perime).toString()}> Périmé </Radio>
                        </div>
                    </RadioGroup>

                    <DateInput
                        label="Date limite de consommation :"
                        variant="faded"
                        value={formatDlc}
                        onChange={handleDlcChange}
                    />

                </ModalBody>

                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        Annuler
                    </Button>

                    <Button color="primary" onPress={handleSubmit}>
                        Valider
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    );
}