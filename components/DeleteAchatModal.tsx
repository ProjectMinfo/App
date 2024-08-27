import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";


interface DeleteAchatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    currentIdAchat: number;
    currentNomArticle: string;
    currentCategorie: number;
    currentNumLot: string;
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


export default function DeleteAchatModal({
    isOpen,
    onClose,
    onSubmit,
    currentIdAchat,
    currentNomArticle,
    currentCategorie,
    currentNumLot,
    currentEtat
}: DeleteAchatModalProps) {

    const deleteSubmit = () => {
        onSubmit();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Êtes-vous certains de vouloir supprimer cet achat ?
                </ModalHeader>
                <ModalBody>
                    <p>
                        {currentCategorie === CategorieAchat.Ingrédient ? "Ingrédient"
                            : currentCategorie === CategorieAchat.Viande ? "Viande"
                                : currentCategorie === CategorieAchat.Boisson ? "Boisson"
                                    : currentCategorie === CategorieAchat.Snack ? "Snack"
                                        : "Catégorie inconnue"} : {currentNomArticle}
                    </p>

                    <p>
                        Numéro de lot : {currentNumLot}
                    </p>

                    <p>
                        État : {currentCategorie === EtatAchat.NonEntame ? "Non entamé"
                            : currentCategorie === EtatAchat.Ouvert ? "Ouvert"
                                : currentCategorie === EtatAchat.Consomme ? "Consommé"
                                    : currentCategorie === EtatAchat.Perime ? "Périmé"
                                        : currentCategorie === EtatAchat.Perte ? "Perte"
                                            : "Inconnu"}
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" variant="light" onPress={onClose}>
                        ANNULER
                    </Button>
                    <Button color="danger" onPress={deleteSubmit}>
                        CONFIRMER
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
