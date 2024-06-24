import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";


interface ClearOldAchatsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}


export default function DeleteAchatModal({
    isOpen,
    onClose,
    onSubmit
}: ClearOldAchatsModalProps) {

    const clearOldAchatsSubmit = () => {
        onSubmit();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 text-center">
                    Voulez-vous supprimer <span className="text-danger">DEFINITIVEMENT</span> les articles fermés depuis plus de 6 mois ?
                </ModalHeader>

                <ModalFooter>
                    <Button color="primary" variant="light" onPress={onClose}>
                        ANNULER
                    </Button>
                    <Button color="danger" onPress={clearOldAchatsSubmit}>
                        CONFIRMER
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
