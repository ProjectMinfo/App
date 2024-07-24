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
  onClose: (data: { viandes: Viandes[], ingredients: Ingredients[], extras: Ingredients[], plat: NewPlats }) => any;
  options: {
    ingredients: Ingredients[];
    viandes: Viandes[];
    extras: Ingredients[];
    currentPlat: NewPlats;
  };
};

export default function DetailCommandeModal({ isOpen, onClose, options }: DetailCommandeModalProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredients[]>([]);
  const [selectedViande, setSelectedViande] = useState<Viandes[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<Ingredients[]>([]);

  const [possibleIngredients, setPossibleIngredients] = useState<Ingredients[]>([]);
  const [possibleViandes, setPossibleViandes] = useState<Viandes[]>([]);
  const [possibleExtras, setPossibleExtras] = useState<Ingredients[]>([]);

  const [step, setStep] = useState(1);

  const handleViandeClick = (viande: Viandes) => {
    if (selectedViande.includes(viande)) {
      setSelectedViande(selectedViande.filter((opt) => opt !== viande));
    } else if (selectedViande.length === 0 && selectedIngredients.length < 2) {
      setSelectedViande([...selectedViande, viande]);
    }
  };

  const handleIngredientClick = (ingredient: Ingredients) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter((opt) => opt !== ingredient));
    } else if (selectedIngredients.length + selectedViande.length < 2) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleExtraClick = (extra: Ingredients) => {
    setSelectedExtras((prevSelected) =>
      prevSelected.includes(extra)
        ? prevSelected.filter((opt) => opt !== extra)
        : [...prevSelected, extra]
    );
  };

  const reset = () => {
    setSelectedViande([]);
    setSelectedIngredients([]);
    setSelectedExtras([]);
    setPossibleViandes([]);
    setPossibleIngredients([]);
    setPossibleExtras([]);
    setStep(1);
  }

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  const handleValidateClick = () => {
    if (step === 1 && (selectedViande.length > 0 || selectedIngredients.length > 0)) {
      setStep(2);
    } else if (step === 2) {
      const result = { viandes: selectedViande, ingredients: selectedIngredients, extras: selectedExtras, plat: options.currentPlat };
      reset();
      onClose(result);
    }
  };

  const handleClose = () => {
    reset();
    onClose({ viandes: [], ingredients: [], extras: [], plat: options.currentPlat });
  };

  const getPossibleItems = () => {
    const listIngredients: Ingredients[] = [];
    options.currentPlat.plat.ingredients.forEach((element) => {
      const ingredient = options.ingredients.find((ingredient) => ingredient.nom === element.ingredient.nom);
      if (ingredient) {
        listIngredients.push(ingredient);
      }
    });

    const listViandes: Viandes[] = [];
    options.currentPlat.plat.ingredients.forEach((element) => {
      const viande = options.viandes.find((viande) => viande.nom === element.ingredient.nom);
      if (viande) {
        listViandes.push(viande);
      }
    });

    const listExtras: Ingredients[] = [];
    options.currentPlat.plat.ingredients.forEach((element) => {
      const extra = options.extras.find((extra) => extra.nom === element.ingredient.nom);
      if (extra) {
        listExtras.push(extra);
      }
    });

    setPossibleIngredients(listIngredients);
    setPossibleViandes(listViandes);
    setPossibleExtras(listExtras);
  }

  if (isOpen && possibleIngredients.length == 0 && possibleViandes.length == 0) {
    getPossibleItems();
  }

  const viandeDisabled = selectedViande.length >= 1 || (selectedViande.length + selectedIngredients.length) >= 2;
  const ingredientDisabled = (selectedViande.length + selectedIngredients.length) >= 2;

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
              {step === 1 ? "Sélectionnez" : "Sélectionnez des Extras"}
            </ModalHeader>
            <ModalBody className="grid grid-cols-3 gap-2">
              {step === 1 ? (
                <>
                  <div className="col-span-3 font-bold">Viande</div>
                  {possibleViandes.map((option, index) => (
                    <Button
                      color={option.dispo ? "primary" : "warning"}
                      variant={selectedViande.includes(option) ? "solid" : "ghost"}
                      key={index}
                      onPress={() => handleViandeClick(option)}
                      isDisabled={viandeDisabled && !selectedViande.includes(option)}
                    >
                      {option.nom}
                    </Button>
                  ))}
                  <div className="col-span-3 font-bold">Ingrédient</div>
                  {possibleIngredients.filter((option) => option.dispo).map((option, index) => (
                    <Button
                      color={option.dispo ? "primary" : "warning"}
                      variant={selectedIngredients.includes(option) ? "solid" : "ghost"}
                      key={index}
                      onPress={() => handleIngredientClick(option)}
                      isDisabled={ingredientDisabled && !selectedIngredients.includes(option)}
                    >
                      {option.nom}
                    </Button>
                  ))}
                </>
              ) : (
                possibleExtras.filter((option) => option.dispo).map((option, index) => (
                  <Button
                    color={option.dispo ? "primary" : "warning"}
                    variant={selectedExtras.includes(option) ? "solid" : "ghost"}
                    key={index}
                    onPress={() => handleExtraClick(option)}
                  >
                    {option.nom}
                  </Button>
                ))
              )}
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
