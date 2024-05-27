import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

interface EditQuantityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (quantity: number) => void;
  currentQuantity: number;
}

export default function EditQuantityModal({ isOpen, onClose, onSubmit, currentQuantity }: EditQuantityModalProps) {
  const [quantity, setQuantity] = useState<string>(currentQuantity.toString());

  useEffect(() => {
    setQuantity(currentQuantity.toString());
  }, [currentQuantity]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(Number(quantity));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
      <ModalContent>
        <>
          <ModalHeader>Modifier la quantité</ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="Quantité"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              variant="bordered"
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Annuler</Button>
            <Button onClick={handleSubmit}>Valider</Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
