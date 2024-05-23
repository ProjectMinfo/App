import { Button } from "@nextui-org/button";
import { useState } from "react";
import EditQuantityModal from "@/components/EditQuantityModal";
import AddItemModal from "@/components/AddItemModal";
import { useDisclosure } from "@nextui-org/modal";

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
}

const initialIngredients: Ingredient[] = [
  { id: 1, name: "Tomato", quantity: 10 },
  { id: 2, name: "Lettuce", quantity: 5 },
  { id: 3, name: "Cheese", quantity: 7 },
];

interface IngredientsProps {
  onValidate: (updatedIngredients: Ingredient[]) => void;
}

export default function Ingredients({ onValidate }: IngredientsProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  const handleModify = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    onEditOpen();
  };

  const handleDelete = (id: number) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const handleEditSubmit = (quantity: number) => {
    if (selectedIngredient) {
      setIngredients(
        ingredients.map(ingredient =>
          ingredient.id === selectedIngredient.id ? { ...ingredient, quantity } : ingredient
        )
      );
    }
  };

  const handleAddSubmit = (name: string, quantity: number) => {
    const newIngredient: Ingredient = { id: ingredients.length + 1, name, quantity };
    setIngredients([...ingredients, newIngredient]);
  };

  const handleValidate = () => {
    onValidate(ingredients);
  };

  return (
    <div>
      <h2>Liste des Ingrédients</h2>
      <div className="flex justify-between mb-4">
      <Button onClick={handleValidate}>Valider</Button>
      <Button onClick={onAddOpen}>+</Button>
      </div>
      <div className="flex justify-center mt-4  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-center gap-4 ">
        {ingredients.map(ingredient => (
          <div key={ingredient.id} className=" border p-4 flex flex-col justify-between  gap-4 rounded-2xl">
            <div>
              <h3>{ingredient.name}</h3>
              <p>Quantité: {ingredient.quantity}</p>
            </div>
            <div className="flex justify-center mt-4 ">
              <Button onClick={() => handleModify(ingredient)}>Modifier</Button>
              <Button color="warning" onClick={() => handleDelete(ingredient.id)}>Supprimer</Button>
            </div>
          </div>
        ))}
      </div>
      {selectedIngredient && (
        <EditQuantityModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          onSubmit={handleEditSubmit}
          currentQuantity={selectedIngredient.quantity}
        />
      )}
      <AddItemModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        onSubmit={handleAddSubmit}
      />
    </div>
  );
}
