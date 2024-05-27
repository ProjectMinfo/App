import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, quantity: number) => void;
}

export default function AddItemModal({ isOpen, onClose, onSubmit }: AddItemModalProps) {
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("0");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(name, Number(quantity));
    setName("");
    setQuantity("0");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
      <ModalContent>
        <>
          <ModalHeader>Ajouter un élément</ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="Nom"
              type="text"
              value={name}
              onChange={handleNameChange}
              variant="bordered"
            />
            <Input
              label="Quantité"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              variant="bordered"
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Annuler</Button>
            <Button onClick={handleSubmit}>Ajouter</Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}