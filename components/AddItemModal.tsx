import React, { useState } from "react";  // Import de React et du hook useState.
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } from "@nextui-org/react";  // Import des composants Modal, Button, Input, et useDisclosure de NextUI.

interface AddItemModalProps {
  isOpen: boolean;  // Propriété indiquant si le modal est ouvert.
  onClose: () => void;  // Fonction pour fermer le modal.
  onSubmit: (name: string, quantity: number) => void;  // Fonction pour soumettre les données du formulaire.
}

export default function AddItemModal({ isOpen, onClose, onSubmit }: AddItemModalProps) {
  const [name, setName] = useState<string>("");  // État pour stocker le nom de l'élément.
  const [quantity, setQuantity] = useState<string>("0");  // État pour stocker la quantité de l'élément.

  // Fonction pour gérer le changement du champ nom.
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  // Fonction pour gérer le changement du champ quantité.
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  // Fonction pour gérer la soumission du formulaire.
  const handleSubmit = () => {
    onSubmit(name, Number(quantity));  // Appelle la fonction onSubmit avec les valeurs actuelles.
    setName("");  // Réinitialise le champ nom.
    setQuantity("0");  // Réinitialise le champ quantité.
    onClose();  // Ferme le modal.
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Ajouter un élément</ModalHeader>  // En-tête du modal.
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
              <Button color="danger" variant="flat" onPress={onClose}>
                Annuler  // Bouton pour annuler et fermer le modal.
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Ajouter  // Bouton pour soumettre le formulaire et ajouter l'élément.
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
