import { Button } from "@nextui-org/button";
import { useState } from "react";
import EditQuantityModal from "@/components/EditQuantityModal";
import AddItemModal from "@/components/AddItemModal";
import { useDisclosure } from "@nextui-org/modal";

interface Meat {
  id: number;
  name: string;
  quantity: number;
}

const initialMeats: Meat[] = [
  { id: 1, name: "Chicken", quantity: 20 },
  { id: 2, name: "Beef", quantity: 15 },
  { id: 3, name: "Pork", quantity: 10 },
];

interface ViandesProps {
  onValidate: (updatedMeats: Meat[]) => void;
}

const Viandes = ({ onValidate }: ViandesProps) => {
  const [meats, setMeats] = useState<Meat[]>(initialMeats);
  const [selectedMeat, setSelectedMeat] = useState<Meat | null>(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  const handleModify = (meat: Meat) => {
    setSelectedMeat(meat);
    onEditOpen();
  };

  const handleDelete = (id: number) => {
    setMeats(meats.filter(meat => meat.id !== id));
  };

  const handleEditSubmit = (quantity: number) => {
    if (selectedMeat) {
      setMeats(
        meats.map(meat =>
          meat.id === selectedMeat.id ? { ...meat, quantity } : meat
        )
      );
    }
  };

  const handleAddSubmit = (name: string, quantity: number) => {
    const newMeat: Meat = { id: meats.length + 1, name, quantity };
    setMeats([...meats, newMeat]);
  };

  const handleValidate = () => {
    onValidate(meats);
  };

  return (
    <div>
      <h2>Liste des Viandes</h2>
      <div className="flex justify-between mb-4">
      <Button onClick={handleValidate}>Valider</Button>
      <Button onClick={onAddOpen}>+</Button>
      </div>
      <div className="flex justify-center mt-4  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-center gap-4 " >
        {meats.map(meat => (
          <div key={meat.id} className="border p-4 flex flex-col justify-between  gap-4 rounded-2xl">
            <div>
              <h3>{meat.name}</h3>
              <p>Quantité: {meat.quantity}</p>
            </div>
            <div className="flex justify-center mt-4 ">
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

export default Viandes;
