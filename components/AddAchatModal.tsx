import React, { useState, useEffect } from "react";
import { Button, CalendarDate, DateInput, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Radio, RadioGroup, Select, SelectItem } from "@nextui-org/react";
import moment from 'moment';
import { parseDate } from "@internationalized/date";

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

interface AddAchatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newAchat: Achat) => void;
}


export default function AddAchatModal({
    isOpen,
    onClose,
    onSubmit
}: AddAchatModalProps) {

    const [nomArticle, setNomArticle] = useState<string>();
    const [categorie, setCategorie] = useState<number>();
    const [numLot, setNumLot] = useState<string>();
    const [nbPortions, setNbPortions] = useState<number>();
    const [dateOuverture, setDateOuverture] = useState<Date>();
    const [dateFermeture, setDateFermeture] = useState<Date>();
    const [dlc, setDlc] = useState<any>();
    const [formatDlc, setFormatDlc] = useState();
    const [etat, setEtat] = useState<number>();
    const [typeValue, setTypeValue] = useState<string | null>(null);

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedKey = event.target.value;
        console.log('Selected value:', selectedKey);
    }

    const handleNumLotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumLot(event.target.value);
    };

    const handleSubmit = () => {
        // const newAchat: Achat = {
        //     idAchat: 0,
        //     categorie: 0,
        //     dateFermeture: null,
        //     dateOuverture: null,
        //     dlc: new Date(),
        //     etat: 0,
        //     idProduit: 0,
        //     nbPortions: 0,
        //     nomArticle: "",
        //     numLot: "test",
        //     qtePerimee: 0
        // }
        // onSubmit(newAchat);
        // onClose();
    };

    const typesAchat = [
        { key: "0", label: "Ingrédient" },
        { key: "1", label: "Viande" },
        { key: "2", label: "Boisson" },
        { key: "3", label: "Snack" }
    ];

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Ajouter un achat
                </ModalHeader>

                <ModalBody>

                    <Select
                        isRequired
                        label="Type article"
                        placeholder="Choisir le type de l'article acheté"
                        className="max-w-xs"
                        selectedKeys={typeValue ?? "all"}
                        onChange={handleTypeChange}
                    >
                        {typesAchat.map(type => (
                            <SelectItem key={type.key} value={type.key}>
                                {type.label}
                            </SelectItem>
                        ))}

                    </Select>

                    <Input
                        autoFocus
                        label="Numéro de lot"
                        type="string"
                        value={""}
                        onChange={handleNumLotChange}
                        variant="bordered"
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