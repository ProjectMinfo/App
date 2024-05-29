import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Ingredients, Viandes } from "@/types";

interface DetailCommandeModalProps {
  isOpen: boolean;
  onClose: (data: {viandes: Viandes[], ingredients: Ingredients[]}) => any;
  options: {
    ingredients: Ingredients[];
    viandes: Viandes[];
  }
}

export default function DetailCommandeModal({ isOpen, onClose, options }: DetailCommandeModalProps) {
  const [selectedViande, setSelectedViande] = useState<Viandes[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredients[]>([]);
  const [step, setStep] = useState(1);

  const handleViandeClick = (viande: Viandes) => {
    setSelectedViande([viande]);
  };

  const handleIngredientClick = (ingredient: Ingredients) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredient)
        ? prevSelected.filter((opt) => opt !== ingredient)
        : [...prevSelected, ingredient]
    );
  };

  const handleValidateClick = () => {
    if (step === 1 && selectedViande.length > 0) {
      setStep(2);
    } else if (step === 2) {
      onClose({ viandes: selectedViande, ingredients: selectedIngredients });
    }
  };

  const handleClose = () => {
    setSelectedViande([]);
    setSelectedIngredients([]);
    setStep(1);
    onClose({ viandes: [], ingredients: [] });
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement="top-center"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {step === 1 ? "Sélectionnez une Viande" : "Sélectionnez des Ingrédients"}
            </ModalHeader>
            <ModalBody className="grid grid-cols-3 gap-2">
              {step === 1
                ? options.viandes.map((option) => (
                    <Button
                      color="primary"
                      variant={selectedViande.includes(option) ? "flat" : "ghost"}
                      key={option.id}
                      onPress={() => handleViandeClick(option)}
                    >
                      {option.nom}
                    </Button>
                  ))
                : options.ingredients.map((option) => (
                    <Button
                      color="primary"
                      variant={selectedIngredients.includes(option) ? "flat" : "ghost"}
                      key={option.id}
                      onPress={() => handleIngredientClick(option)}
                    >
                      {option.nom}
                    </Button>
                  ))}
            </ModalBody>
            <ModalFooter>
              <Button color="success" variant="flat" onPress={handleValidateClick}>
                {step === 1 ? "Suivant" : "Valider"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
