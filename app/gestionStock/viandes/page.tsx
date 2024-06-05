'use client';
import { Button } from "@nextui-org/button";
import { useState, useEffect } from "react";
import EditQuantityModal from "@/components/EditQuantityModal";
import AddItemModal from "@/components/AddItemModal";
import { useDisclosure } from "@nextui-org/modal";
import { getViandes, postViandes, deleteViandes } from "@/config/api"; // Assurez-vous que le chemin est correct

interface Meat {
  id: number;
  commentaire: string;
  dispo: boolean;
  nom: string;
  quantite: number;
}


const Viandes = () => {
  const [meats, setMeats] = useState<Meat[]>([]);
  const [newMeats, setNewMeats] = useState<Meat[]>([]); // Nouvel état pour les viandes ajoutées localement
  const [modifiedMeats, setModifiedMeats] = useState<Meat[]>([]); // Nouvel état pour les viandes modifiées localement
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

  const handleDelete = async (id: number) => {
    try {
      await deleteViandes(id); // Appel à l'API pour supprimer la viande
      setMeats(meats.filter(meat => meat.id !== id));
      setNewMeats(newMeats.filter(meat => meat.id !== id));
      setModifiedMeats(modifiedMeats.filter(meat => meat.id !== id));
    } catch (error) {
      console.error('Error deleting meat:', error);
    }
  };

  const handleEditSubmit = (quantite: number) => {
    if (selectedMeat) {
      const updatedMeat = { ...selectedMeat, quantite };
      setMeats(
        meats.map(meat =>
          meat.id === selectedMeat.id ? updatedMeat : meat
        )
      );
      // Ajouter à modifiedMeats si ce n'est pas un nouvel élément
      if (!newMeats.some(meat => meat.id === selectedMeat.id)) {
        setModifiedMeats([...modifiedMeats, updatedMeat]);
      }
      onEditClose(); // Fermer la modal après la soumission
    }
  };

  const handleAddSubmit = (nom: string, quantite: number) => {
    const newMeat: Meat = { id: -1, nom, quantite, dispo: true, commentaire: ""};
    setNewMeats([...newMeats, newMeat]);
    setMeats([...meats, newMeat]);
    onAddClose(); // Fermer la modal après l'ajout
  };

  const handleValidate = async () => {
    try {
      // Envoyer les nouveaux produits et les produits modifiés à l'API
      await Promise.all(newMeats.map(meat => postViandes(meat)));
      await Promise.all(modifiedMeats.map(meat => postViandes(meat)));

      // Réinitialiser les états des nouveaux produits et des produits modifiés après la validation
      setNewMeats([]);
      setModifiedMeats([]);
      
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
