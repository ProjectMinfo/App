'use client';
import { Modal, ModalBody, ModalHeader, ModalContent, Button } from "@nextui-org/react";

interface TypePaiementModalProps {
  isOpen: boolean;
  onClose: (typePaiement: number) => void;
}

export default function TypePaiementModal({ isOpen, onClose }: TypePaiementModalProps) {

    function setTypePaiement(typePaiement: number) {
        onClose(typePaiement);
    }

    return (
        <>
            <Modal isOpen={isOpen} className="max-w-xl" isDismissable={false}  onClose={() => setTypePaiement(0)}>
                <ModalContent>
                    <ModalHeader>Gestion des types de paiement</ModalHeader>
                    <ModalBody className="gap-6 mb-5">
                        <Button
                            onClick={() => setTypePaiement(1)}
                            size="lg"
                            className="mt-4"
                        >
                            CB
                        </Button>
                        <Button
                            onClick={() => setTypePaiement(2)}
                            size="lg"
                            className="mt-4"
                        >
                            Espèce
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
