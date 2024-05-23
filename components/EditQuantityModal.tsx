import React, { useState, useEffect } from "react";  // Import de React et des hooks useState et useEffect.
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure } from "@nextui-org/react";  // Import des composants Modal, Button, Input, et useDisclosure de NextUI.

interface EditQuantityModalProps {
  isOpen: boolean;  // Propriété indiquant si le modal est ouvert.
  onClose: () => void;  // Fonction pour fermer le modal.
  onSubmit: (quantity: number) => void;  // Fonction pour soumettre la nouvelle quantité.
  currentQuantity: number;  // Quantité actuelle à modifier.
}

export default function EditQuantityModal({ isOpen, onClose, onSubmit, currentQuantity }: EditQuantityModalProps) {
  const [quantity, setQuantity] = useState<string>(currentQuantity.toString());  // État pour stocker la quantité modifiée sous forme de chaîne de caractères.

  // Effet pour mettre à jour l'état de la quantité lorsque la quantité actuelle change.
  useEffect(() => {
    setQuantity(currentQuantity.toString());
  }, [currentQuantity]);

  // Fonction pour gérer le changement du champ quantité.
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  // Fonction pour gérer la soumission du formulaire.
  const handleSubmit = () => {
    onSubmit(Number(quantity));  // Appelle la fonction onSubmit avec la quantité convertie en nombre.
    onClose();  // Ferme le modal.
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">  // Modal centré en haut de l'écran.
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Modifier la quantité</ModalHeader>  // En-tête du modal.
            <ModalBody>
              <Input
                autoFocus  // Champ de saisie avec autofocus.
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
                Valider  // Bouton pour soumettre le formulaire et valider la quantité.
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
