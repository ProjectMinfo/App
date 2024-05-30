import React, { useState, useEffect } from "react";
import { Radio, RadioGroup, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

interface EditAchatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        nomArticle: string,
        // categorie: number,
        // numLot: string,
        // nbPortions: number,
        // dateOuverture: Date,
        // dateFermeture: Date,
        // dlc: Date,
        // etat: number
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

    const handleNomArticleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNomArticle(event.target.value);
    };

    const handleSubmit = () => {
        onSubmit(nomArticle);
        onClose();
      };


    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Modifier l'utilisateur
                </ModalHeader>

                <ModalBody>
                    Modifier le nom
                    <Input
                        autoFocus
                        label="Nom"
                        type="string"
                        value={nomArticle}
                        onChange={handleNomArticleChange}
                        variant="bordered"
                    />
                </ModalBody>

                {/* <ModalBody>
                    Modifier le prénom
                    <Input
                        autoFocus
                        label="Prénom"
                        type="string"
                        value={String(categorie)}
                        onChange={handleFirstnameChange}
                        variant="bordered"
                    />
                </ModalBody>

                <ModalBody>
                    Modifier le solde
                    <Input
                        autoFocus
                        label="Solde"
                        type="number"
                        value={numLot}
                        onChange={handleSoldeChange}
                        variant="bordered"
                    />
                </ModalBody> */}

                {/* <ModalBody>
                    Modifier l'accès
                    <RadioGroup
                        isRequired
                        isInvalid={isInvalidAccess}
                        defaultValue={String(nbPortions)}
                        onValueChange={isAccessSelected}
                    >
                        <Radio value="0"> User </Radio>
                        <Radio value="1"> Serveur </Radio>
                        <Radio value="2"> Admin </Radio>
                    </RadioGroup>
                </ModalBody> */}

                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        Annuler
                    </Button>

                    <Button color="primary" onPress={handleSubmit} /*isDisabled={isInvalidAccess}*/>
                        Valider
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    );
}