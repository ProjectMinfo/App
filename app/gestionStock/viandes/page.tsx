import { Button } from "@nextui-org/button";
import { useState, useEffect } from "react";
import EditQuantityModal from "@/components/EditQuantityModal";
import AddItemModal from "@/components/AddItemModal";
import { useDisclosure } from "@nextui-org/modal";
import { getViandes, postViandes } from "@/config/api"; // Assurez-vous que le chemin est correct

interface Meat {
  id: number;
  commentaire: string;
  dispo: boolean;
  nom: string;
  quantite: number;
}

interface ViandesProps {
  onValidate: (updatedMeats: Meat[]) => void;
}

const Viandes = ({ onValidate }: ViandesProps) => {
  const [meats, setMeats] = useState<Meat[]>([]);
  const [selectedMeat, setSelectedMeat] = useState<Meat | null>(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const viandes = await getViandes();
        setMeats(viandes);
      } catch (error) {
        console.error('Error fetching viandes:', error);
      }
    };
    fetchData();
  }, []);

  const handleModify = (meat: Meat) => {
    setSelectedMeat(meat);
    onEditOpen();
  };

  const handleDelete = (id: number) => {
    setMeats(meats.filter(meat => meat.id !== id));
  };

  const handleEditSubmit = async (quantite: number) => {
    if (selectedMeat) {
      const updatedMeat = { ...selectedMeat, quantite };
      try {
        await postViandes(updatedMeat); // Appel à l'API pour mettre à jour la viande
        setMeats(
          meats.map(meat =>
            meat.id === selectedMeat.id ? updatedMeat : meat
          )
        );
      } catch (error) {
        console.error('Error updating meat:', error);
      }
      onEditClose(); // Fermer la modal après la soumission
    }
  };

  const handleAddSubmit = async (nom: string, quantite: number) => {
    const newMeat: Meat = { id: -1, nom, quantite, dispo: true, commentaire: ""};
    try {
      await postViandes(newMeat); // Appel à l'API pour ajouter la nouvelle viande
      setMeats([...meats, newMeat]);
    } catch (error) {
      console.error('Error adding meat:', error);
    }
    onAddClose(); // Fermer la modal après l'ajout
  };

  const handleValidate = async () => {
    try {
      await Promise.all(meats.map(meat => postViandes(meat))); // Appel à l'API pour mettre à jour toutes les viandes
      onValidate(meats); // Redirection vers la page GestionStock
    } catch (error) {
      console.error('Error validating meats:', error);
    }
  };

  return (
    <div>
      <h2>Liste des Viandes</h2>
      <div className="flex justify-between mb-4">
        <Button onClick={handleValidate}>Valider</Button>
        <Button onClick={onAddOpen}>+</Button>
      </div>
      <div className="flex justify-center mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meats.map(meat => (
          <div key={meat.id} className="border p-4 flex flex-col justify-between gap-4 rounded-2xl">
            <div>
              <h3>{meat.nom}</h3>
              <p>Quantité: {meat.quantite}</p>
            </div>
            <div className="flex justify-center mt-4 gap-2">
              <Button onClick={() => handleModify(meat)}>Modifier</Button>
              <Button color="warning" onClick={() => handleDelete(meat.id)}>Supprimer</Button>
            </div>
          </div>
        ))}
      </div>
      {selectedMeat && (
        <EditQuantityModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          onSubmit={handleEditSubmit}
          currentQuantity={selectedMeat.quantite}
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


export default Viandes;
