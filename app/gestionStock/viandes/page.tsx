import { Button } from "@nextui-org/button";  // Import du composant Button de NextUI.
import { useState } from "react";  // Import du hook useState de React pour gérer l'état.
import EditQuantityModal from "@/components/EditQuantityModal";  // Import du composant EditQuantityModal.
import AddItemModal from "@/components/AddItemModal";  // Import du composant AddItemModal.
import { useDisclosure } from "@nextui-org/modal";  // Import du hook useDisclosure de NextUI pour gérer l'ouverture et la fermeture des modals.

interface Meat {
  id: number;
  name: string;
  quantity: number;
}

// Données initiales pour les viandes.
const initialMeats: Meat[] = [
  { id: 1, name: "Chicken", quantity: 20 },
  { id: 2, name: "Beef", quantity: 15 },
  { id: 3, name: "Pork", quantity: 10 },
];

interface ViandesProps {
  onValidate: (updatedMeats: Meat[]) => void;  // Fonction de validation pour mettre à jour les viandes.
}

const Viandes = ({ onValidate }: ViandesProps) => {
  const [meats, setMeats] = useState<Meat[]>(initialMeats);  // État pour stocker les viandes.
  const [selectedMeat, setSelectedMeat] = useState<Meat | null>(null);  // État pour stocker la viande sélectionnée pour modification.
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();  // Gestion de l'état du modal d'édition.
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();  // Gestion de l'état du modal d'ajout.

  // Fonction pour gérer la modification d'une viande.
  const handleModify = (meat: Meat) => {
    setSelectedMeat(meat);
    onEditOpen();
  };

  // Fonction pour gérer la suppression d'une viande.
  const handleDelete = (id: number) => {
    setMeats(meats.filter(meat => meat.id !== id));
  };

  // Fonction pour gérer la soumission du formulaire de modification.
  const handleEditSubmit = (quantity: number) => {
    if (selectedMeat) {
      setMeats(
        meats.map(meat =>
          meat.id === selectedMeat.id ? { ...meat, quantity } : meat
        )
      );
    }
  };

  // Fonction pour gérer la soumission du formulaire d'ajout.
  const handleAddSubmit = (name: string, quantity: number) => {
    const newMeat: Meat = { id: meats.length + 1, name, quantity };
    setMeats([...meats, newMeat]);
  };

  // Fonction pour valider les modifications et mettre à jour les données.
  const handleValidate = () => {
    onValidate(meats);
  };

  return (
    <div>
      <h2>Liste des Viandes</h2>
      <div className="flex justify-between mb-4">
        <Button onClick={handleValidate}>Valider</Button>  // Bouton pour valider les modifications.
        <Button onClick={onAddOpen}>+</Button>  // Bouton pour ajouter une nouvelle viande.
      </div>
      <div className="flex justify-center mt-4  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-center gap-4">
        {meats.map(meat => (
          <div key={meat.id} className="border p-4 flex flex-col justify-between gap-4 rounded-2xl">
            <div>
              <h3>{meat.name}</h3>
              <p>Quantité: {meat.quantity}</p>
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={() => handleModify(meat)}>Modifier</Button>  // Bouton pour modifier une viande.
              <Button color="warning" onClick={() => handleDelete(meat.id)}>Supprimer</Button>  // Bouton pour supprimer une viande.
            </div>
          </div>
        ))}
      </div>
      {selectedMeat && (
        <EditQuantityModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          onSubmit={handleEditSubmit}
          currentQuantity={selectedMeat.quantity}
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

export default Viandes;  // Exporte le composant Viandes par défaut.
