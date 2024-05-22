import { Button } from "@nextui-org/button";
import { useState } from "react";
import EditQuantityModal from "@/components/EditQuantityModal";
import AddItemModal from "@/components/AddItemModal";
import { useDisclosure } from "@nextui-org/modal";

interface Snack {
  id: number;
  name: string;
  quantity: number;
}

const initialSnacks: Snack[] = [
  { id: 1, name: "Chips", quantity: 50 },
  { id: 2, name: "Cookies", quantity: 30 },
  { id: 3, name: "Candy", quantity: 100 },
];

interface SnackProps {
  onValidate: (updatedSnacks: Snack[]) => void;
}

const Snack = ({ onValidate }: SnackProps) => {
  const [snacks, setSnacks] = useState<Snack[]>(initialSnacks);
  const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  const handleModify = (snack: Snack) => {
    setSelectedSnack(snack);
    onEditOpen();
  };

  const handleDelete = (id: number) => {
    setSnacks(snacks.filter(snack => snack.id !== id));
  };

  const handleEditSubmit = (quantity: number) => {
    if (selectedSnack) {
      setSnacks(
        snacks.map(snack =>
          snack.id === selectedSnack.id ? { ...snack, quantity } : snack
        )
      );
    }
  };

  const handleAddSubmit = (name: string, quantity: number) => {
    const newSnack: Snack = { id: snacks.length + 1, name, quantity };
    setSnacks([...snacks, newSnack]);
  };

  const handleValidate = () => {
    onValidate(snacks);
  };

  return (
    <div>
      <h2>Liste des Snacks</h2>
      <div className="flex justify-between mb-4">
      <Button onClick={handleValidate}>Valider</Button>
      <Button onClick={onAddOpen}>+</Button>
      </div>
      <div className="flex justify-center mt-4  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-center gap-4">
        {snacks.map(snack => (
          <div key={snack.id} className=" border p-4 flex flex-col justify-between  gap-4 rounded-2xl">
            <div>
              <h3>{snack.name}</h3>
              <p>Quantité: {snack.quantity}</p>
            </div>
            <div className="flex justify-center mt-4 ">
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
          currentQuantity={selectedSnack.quantity}
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

export default Snack;
