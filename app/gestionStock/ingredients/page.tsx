import { Button } from "@nextui-org/button";
import { useState, useEffect } from "react";
import EditQuantityModal from "@/components/EditQuantityModal";
import AddItemModal from "@/components/AddItemModal";
import { useDisclosure } from "@nextui-org/modal";
import { getIngredients, postIngredients, deleteIngredients } from "@/config/api"; // Assurez-vous que le chemin est correct

interface Ingredient {
  id: number;
  commentaire: string;
  dispo: boolean;
  nom: string;
  quantite: number;
}

interface IngredientsProps {
  onValidate: (updatedIngredients: Ingredient[]) => void;
}

const Ingredients = ({ onValidate }: IngredientsProps) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ingredients = await getIngredients();
        setIngredients(ingredients);
      } catch (error) {
        console.error('Error fetching ingredients:', error);
      }
    };
    fetchData();
  }, []);

  const handleModify = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    onEditOpen();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteIngredients(id); // Appel à l'API pour supprimer l'ingrédient
      setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    } catch (error) {
      console.error('Error deleting ingredient:', error);
    }
  };

  const handleEditSubmit = (quantite: number) => {
    if (selectedIngredient) {
      const updatedIngredient = { ...selectedIngredient, quantite };
      setIngredients(
        ingredients.map(ingredient =>
          ingredient.id === selectedIngredient.id ? updatedIngredient : ingredient
        )
      );
      onEditClose(); // Fermer la modal après la soumission
    }
  };

  const handleAddSubmit = (nom: string, quantite: number) => {
    const newIngredient: Ingredient = { id: Date.now(), nom, quantite, dispo: true, commentaire: ""};
    setIngredients([...ingredients, newIngredient]);
    onAddClose(); // Fermer la modal après l'ajout
  };

  const handleValidate = async () => {
    try {
      await Promise.all(ingredients.map(ingredient => postIngredients(ingredient))); // Appel à l'API pour mettre à jour tous les ingrédients
      onValidate(ingredients); // Redirection vers la page GestionStock
    } catch (error) {
      console.error('Error validating ingredients:', error);
    }
  };

  return (
    <div>
      <h2>Liste des Ingrédients</h2>
      <div className="flex justify-between mb-4">
        <Button onClick={handleValidate}>Valider</Button>
        <Button onClick={onAddOpen}>+</Button>
      </div>
      <div className="flex justify-center mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ingredients.map(ingredient => (
          <div key={ingredient.id} className="border p-4 flex flex-col justify-between gap-4 rounded-2xl">
            <div>
              <h3>{ingredient.nom}</h3>
              <p>Quantité: {ingredient.quantite}</p>
            </div>
            <div className="flex justify-center mt-4 gap-2">
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
          currentQuantity={selectedIngredient.quantite}
        />
      )}
      <AddItemModal
        isOpen={isAddOpen}
        onClose={onAddClose}
        onSubmit={handleAddSubmit}
      />
    </div>
  );
};

export default Ingredients;
