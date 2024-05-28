import { Button } from "@nextui-org/button";
import { useState, useEffect } from "react";
import EditQuantityModal from "@/components/EditQuantityModal";
import AddItemModal from "@/components/AddItemModal";
import { useDisclosure } from "@nextui-org/modal";
import { getSnacks, postSnacks, deleteSnacks } from "@/config/api"; // Assurez-vous que le chemin est correct

interface Snack {
  id: number;
  dispo: boolean;
  nom: string;
  quantite: number;
  prix: number;
  prixServeur: number;
}

interface SnacksProps {
  onValidate: (updatedSnacks: Snack[]) => void;
}

const Snacks = ({ onValidate }: SnacksProps) => {
  const [snacks, setSnacks] = useState<Snack[]>([]);
  const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snacks = await getSnacks();
        setSnacks(snacks);
      } catch (error) {
        console.error('Error fetching snacks:', error);
      }
    };
    fetchData();
  }, []);

  const handleModify = (snack: Snack) => {
    setSelectedSnack(snack);
    onEditOpen();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSnacks(id); // Appel à l'API pour supprimer le snack
      setSnacks(snacks.filter(snack => snack.id !== id));
    } catch (error) {
      console.error('Error deleting snack:', error);
    }
  };

  const handleEditSubmit = (quantite: number) => {
    if (selectedSnack) {
      const updatedSnack = { ...selectedSnack, quantite };
      setSnacks(
        snacks.map(snack =>
          snack.id === selectedSnack.id ? updatedSnack : snack
        )
      );
      onEditClose(); // Fermer la modal après la soumission
    }
  };

  const handleAddSubmit = (nom: string, quantite: number) => {
    const newSnack: Snack = { id: Date.now(), nom, quantite, dispo: true, commentaire: ""};
    setSnacks([...snacks, newSnack]);
    onAddClose(); // Fermer la modal après l'ajout
  };

  const handleValidate = async () => {
    try {
      await Promise.all(snacks.map(snack => postSnacks(snack))); // Appel à l'API pour mettre à jour tous les snacks
      onValidate(snacks); // Redirection vers la page GestionStock
    } catch (error) {
      console.error('Error validating snacks:', error);
    }
  };

  return (
    <div>
      <h2>Liste des Snacks</h2>
      <div className="flex justify-between mb-4">
        <Button onClick={handleValidate}>Valider</Button>
        <Button onClick={onAddOpen}>+</Button>
      </div>
      <div className="flex justify-center mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {snacks.map(snack => (
          <div key={snack.id} className="border p-4 flex flex-col justify-between gap-4 rounded-2xl">
            <div>
              <h3>{snack.nom}</h3>
              <p>Quantité: {snack.quantite}</p>
            </div>
            <div className="flex justify-center mt-4 gap-2">
              <Button onClick={() => handleModify(snack)}>Modifier</Button>
              <Button color="warning" onClick={() => handleDelete(snack.id)}>Supprimer</Button>
            </div>
          </div>
        ))}
      </div>
      {selectedSnack && (
        <EditQuantityModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          onSubmit={handleEditSubmit}
          currentQuantity={selectedSnack.quantite}
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

export default Snacks;
