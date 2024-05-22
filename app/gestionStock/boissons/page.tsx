import { Button } from "@nextui-org/button";
import { useState } from "react";
import EditQuantityModal from "@/components/EditQuantityModal";
import AddItemModal from "@/components/AddItemModal";
import { useDisclosure } from "@nextui-org/modal";

interface Beverage {
  id: number;
  name: string;
  quantity: number;
}

const initialBeverages: Beverage[] = [
  { id: 1, name: "Water", quantity: 200 },
  { id: 2, name: "Soda", quantity: 150 },
  { id: 3, name: "Juice", quantity: 100 },
];

interface BoissonProps {
  onValidate: (updatedBeverages: Beverage[]) => void;
}

const Boisson = ({ onValidate }: BoissonProps) => {
  const [beverages, setBeverages] = useState<Beverage[]>(initialBeverages);
  const [selectedBeverage, setSelectedBeverage] = useState<Beverage | null>(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  const handleModify = (beverage: Beverage) => {
    setSelectedBeverage(beverage);
    onEditOpen();
  };

  const handleDelete = (id: number) => {
    setBeverages(beverages.filter(beverage => beverage.id !== id));
  };

  const handleEditSubmit = (quantity: number) => {
    if (selectedBeverage) {
      setBeverages(
        beverages.map(beverage =>
          beverage.id === selectedBeverage.id ? { ...beverage, quantity } : beverage
        )
      );
    }
  };

  const handleAddSubmit = (name: string, quantity: number) => {
    const newBeverage: Beverage = { id: beverages.length + 1, name, quantity };
    setBeverages([...beverages, newBeverage]);
  };

  const handleValidate = () => {
    onValidate(beverages);
  };

  return (
    <div>
      <h2>Liste des Boissons</h2>
      <div className="flex justify-between mb-4">
      <Button onClick={handleValidate}>Valider</Button>
      <Button onClick={onAddOpen}>+</Button>
      </div>
      <div className="flex justify-center mt-4  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  justify-center gap-4 ">
        {beverages.map(beverage => (
          <div key={beverage.id} className=" border p-4 flex flex-col justify-between  gap-4 rounded-2xl">
            <div>
              <h3>{beverage.name}</h3>
              <p>Quantité: {beverage.quantity}</p>
            </div>
            <div className="flex justify-center mt-4 ">
              <Button onClick={() => handleModify(beverage)}>Modifier</Button>
              <Button color="warning" onClick={() => handleDelete(beverage.id)}>Supprimer</Button>
            </div>
          </div>
        ))}
      </div>
      {selectedBeverage && (
        <EditQuantityModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          onSubmit={handleEditSubmit}
          currentQuantity={selectedBeverage.quantity}
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

export default Boisson;
