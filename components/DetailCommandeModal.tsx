import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Ingredients, Plats, Viandes } from "@/types";

type NewPlats = {
  id: number;
  type: "plat";
  plat: Plats;
  menuId?: number;
};
interface DetailCommandeModalProps {
  isOpen: boolean;
  onClose: (data: {viandes: Viandes[], ingredients: Ingredients[], plat : NewPlats}) => any;
  options: {
    ingredients: Ingredients[];
    viandes: Viandes[];
    currentPlat: NewPlats;
  };
    // Add this line
};


export default function DetailCommandeModal({ isOpen, onClose, options }: DetailCommandeModalProps) {
  const [selectedViande, setSelectedViande] = useState<Viandes[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredients[]>([]);
  const [step, setStep] = useState(1);

  const handleViandeClick = (viande: Viandes) => {
    setSelectedViande((prevSelected) =>
      prevSelected.includes(viande)
        ? prevSelected.filter((opt) => opt !== viande)
        : [...prevSelected, viande]
    );
  };

  const handleIngredientClick = (ingredient: Ingredients) => {
    setSelectedIngredients((prevSelected) =>
      prevSelected.includes(ingredient)
        ? prevSelected.filter((opt) => opt !== ingredient)
        : [...prevSelected, ingredient]
    );
  };

  const reset = () => {
    setSelectedViande([]);
    setSelectedIngredients([]);
    setStep(1);
  }

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const handleValidateClick = () => {
    if (step === 1 && selectedViande.length > 0) {
      setStep(2);
    } else if (step === 2) {
      const result = { viandes: selectedViande, ingredients: selectedIngredients, plat : options.currentPlat};
      reset();
      onClose(result);
    }
  };

  const handleClose = () => {
    reset();
    onClose({ viandes: [], ingredients: [] , plat : options.currentPlat});
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement="top-center"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      className="max-md:my-auto"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {step === 1 ? "Sélectionnez une Viande" : "Sélectionnez des Ingrédients"}
            </ModalHeader>
            <ModalBody className="grid grid-cols-3 gap-2">
              {step === 1
                ? options.viandes.filter((option) => option.dispo).map((option, index) => (
                    <Button
                      color="primary"
                      variant={selectedViande.includes(option) ? "flat" : "ghost"}
                      key={index}
                      onPress={() => handleViandeClick(option)}
                    >
                      {option.nom}
                    </Button>
                  ))
                : options.ingredients.filter((option) => option.dispo).map((option, index) => (
                    <Button
                      color="primary"
                      variant={selectedIngredients.includes(option) ? "flat" : "ghost"}
                      key={index}
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
