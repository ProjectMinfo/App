import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Ingredients, Viandes, Snacks, Boissons } from "@/types";

type AllTypes = Ingredients | Viandes | Snacks | Boissons;

interface EditQuantityModalProps {
  isOpen: boolean;
  onClose: (quantite: string) => void;
  ingredient: AllTypes | null;
}

export default function EditQuantityModal({ isOpen, onClose, ingredient }: EditQuantityModalProps) {
  const [quantity, setQuantity] = useState<string>("");

  useEffect(() => {
    if (ingredient)
    setQuantity(ingredient.quantite.toString());
  }, [ingredient]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  const handleSubmit = () => {
    onClose(quantity);
  };

  return (
    <Modal isOpen={isOpen} onClose={ () => onClose("") }>
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
            <Button onClick={ () => onClose("") }>Annuler</Button>
            <Button onClick={handleSubmit}>Valider</Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}