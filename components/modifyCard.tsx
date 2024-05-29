'use client';
import { Card, Button } from '@nextui-org/react';
import { Menus, Boissons, Plats, Snacks } from '@/types/index';
import { EditIcon } from '@/public/EditIcon';
import { TrashIcon } from '@/public/TrashIcon';
import { useState } from 'react';
import EditCarteModal from './EditCarteModal';

type MenuItem = Menus | Boissons | Plats | Snacks;
interface ModifyCardProps {
  item: MenuItem;
}

export default function ModifyCard({ item }: ModifyCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(item);

  const handleSave = (updatedItem: MenuItem) => {
    setCurrentItem(updatedItem);
  };

  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  return (
    <>
    <Card className="p-4 pb-0 relative my-3">
      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-xl font-semibold">{currentItem.nom}</p>
          <div className="p-4 rounded-md text-left">
            <p className="text-gray-500"><strong>Disponibilité:</strong> {currentItem.dispo ? 'Oui' : 'Non'}</p>
            <p className="text-gray-500"><strong>Prix:</strong> {currentItem.prix} €</p>
            <p className="text-gray-500"><strong>Prix Serveur:</strong> {currentItem.prixServeur} €</p>

            {'quantitePlat' in currentItem && (
              <>
                <p className="text-gray-500"><strong>Quantité Boisson:</strong> {currentItem.quantiteBoisson}</p>
                <p className="text-gray-500"><strong>Quantité Plat:</strong> {currentItem.quantitePlat}</p>
                <p className="text-gray-500"><strong>Quantité Snack:</strong> {currentItem.quantiteSnack}</p>
              </>
            )}

            {'quantite' in currentItem && !('ingredients' in currentItem) && (
              <p className="text-gray-500"><strong>Quantité:</strong> {currentItem.quantite}</p>
            )}

            {'ingredients' in currentItem && (
              <>
                <p className="text-gray-500"><strong>Quantité:</strong> {currentItem.quantite}</p>
                <p className="text-gray-500"><strong>Ingrédients:</strong></p>
                <ul className="text-gray-500 ml-4">
                  {currentItem.ingredients.map((ingredient) => (
                    <li key={ingredient.ingredient.id}>ID: {ingredient.ingredient.id}, Qmin: {ingredient.qmin}, Qmax: {ingredient.qmax}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-1/6 flex-shrink-0 items-center justify-center mr-2 mb-4">
            <Button className="h-1/2 w-full" onPress={() => setIsModalOpen(true)}>
              <EditIcon className={iconClasses} />
            </Button>
            <Button color="danger" className="h-1/2 w-full">
              <TrashIcon className={iconClasses} />
            </Button>
          </div>
        </div>
      </Card>
      <EditCarteModal 
        item={currentItem} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
      />
    </>
  );
}