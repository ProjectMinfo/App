import { Button } from "@nextui-org/button";
import { useState, useEffect } from "react";
import EditQuantityModal from "@/components/EditQuantityModal";
import AddItemModal from "@/components/AddItemModal";
import { useDisclosure } from "@nextui-org/modal";
import { getBoissons, postBoissons, deleteBoissons } from "@/config/api"; // Assurez-vous que le chemin est correct

interface Boisson {
  id: number;
  dispo: boolean;
  nom: string;
  quantite: number;
  prix: number;
  prixServeur: number;
}

interface BoissonProps {
  onValidate: (updatedBoissons: Boisson[]) => void;
}

const Boissons = ({ onValidate }: BoissonProps) => {
  const [boissons, setBoissons] = useState<Boisson[]>([]);
  const [selectedBoisson, setSelectedBoisson] = useState<Boisson | null>(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const boissons = await getBoissons();
        setBoissons(boissons);
      } catch (error) {
        console.error('Error fetching boissons:', error);
      }
    };
    fetchData();
  }, []);

  const handleModify = (boisson: Boisson) => {
    setSelectedBoisson(boisson);
    onEditOpen();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBoissons(id); // Appel à l'API pour supprimer la boisson
      setBoissons(boissons.filter(boisson => boisson.id !== id));
    } catch (error) {
      console.error('Error deleting boisson:', error);
    }
  };

  const handleEditSubmit = (quantite: number) => {
    if (selectedBoisson) {
      const updatedBoisson = { ...selectedBoisson, quantite };
      setBoissons(
        boissons.map(boisson =>
          boisson.id === selectedBoisson.id ? updatedBoisson : boisson
        )
      );
      onEditClose(); // Fermer la modal après la soumission
    }
  };

  const handleAddSubmit = (nom: string, quantite: number) => {
    const newBoisson: Boisson = { id: Date.now(), nom, quantite, dispo: true, commentaire: ""};
    setBoissons([...boissons, newBoisson]);
    onAddClose(); // Fermer la modal après l'ajout
  };

  const handleValidate = async () => {
    try {
      await Promise.all(boissons.map(boisson => postBoissons(boisson))); // Appel à l'API pour mettre à jour toutes les boissons
      onValidate(boissons); // Redirection vers la page GestionStock
    } catch (error) {
      console.error('Error validating boissons:', error);
    }
  };

  return (
    <div>
      <h2>Liste des Boissons</h2>
      <div className="flex justify-between mb-4">
        <Button onClick={handleValidate}>Valider</Button>
        <Button onClick={onAddOpen}>+</Button>
      </div>
      <div className="flex justify-center mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boissons.map(boisson => (
          <div key={boisson.id} className="border p-4 flex flex-col justify-between gap-4 rounded-2xl">
            <div>
              <h3>{boisson.nom}</h3>
              <p>Quantité: {boisson.quantite}</p>
            </div>
            <div className="flex justify-center mt-4 gap-2">
              <Button onClick={() => handleModify(boisson)}>Modifier</Button>
              <Button color="warning" onClick={() => handleDelete(boisson.id)}>Supprimer</Button>
            </div>
          </div>
        ))}
      </div>
      {selectedBoisson && (
        <EditQuantityModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          onSubmit={handleEditSubmit}
          currentQuantity={selectedBoisson.quantite}
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

export default Boissons;
