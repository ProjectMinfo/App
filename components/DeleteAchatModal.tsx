import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";


interface DeleteAchatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
}


export default function DeleteAchatModal ({
    isOpen,
    onClose,
    onSubmit,
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
