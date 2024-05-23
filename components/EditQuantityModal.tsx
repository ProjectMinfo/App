import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } from "@nextui-org/react";

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
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Modifier la quantité</ModalHeader>
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
              <Button color="danger" variant="flat" onPress={onClose}>
                Annuler
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Valider
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
