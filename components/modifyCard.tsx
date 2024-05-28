'use client';
import { Card, Button } from '@nextui-org/react';
import { Menus, Boissons, Plats, Snacks } from '@/types/index';
import { EditIcon } from '@/public/EditIcon';
import { TrashIcon } from '@/public/TrashIcon';

type MenuItem = Menus | Boissons | Plats | Snacks;
interface ModifyCardProps {
  item: MenuItem;
}

export default function ModifyCard({ item }: ModifyCardProps) {
  const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";
  return (
    <Card className="p-4 pb-0 relative my-3">
      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-xl font-semibold">{item.nom}</p>
          <div className="p-4 rounded-md text-left">
            <p className="text-gray-500"><strong>Disponibilité:</strong> {item.dispo ? 'Oui' : 'Non'}</p>
            <p className="text-gray-500"><strong>Prix:</strong> {item.prix} €</p>
            <p className="text-gray-500"><strong>Prix Serveur:</strong> {item.prixServeur} €</p>
            
            {'quantitePlat' in item && (
              <>
                <p className="text-gray-500"><strong>Quantité Boisson:</strong> {item.quantiteBoisson}</p>
                <p className="text-gray-500"><strong>Quantité Plat:</strong> {item.quantitePlat}</p>
                <p className="text-gray-500"><strong>Quantité Snack:</strong> {item.quantiteSnack}</p>
              </>
            )}
            
            {'quantite' in item && !('ingredients' in item) && (
              <p className="text-gray-500"><strong>Quantité:</strong> {item.quantite}</p>
            )}
            
            {'ingredients' in item && (
              <>
                <p className="text-gray-500"><strong>Quantité:</strong> {item.quantite}</p>
                <p className="text-gray-500"><strong>Ingrédients:</strong></p>
                <ul className="text-gray-500 ml-4">
                  {item.ingredients.map((ingredient) => (
                    <li key={ingredient.id}>ID: {ingredient.id}, Qmin: {ingredient.qmin}, Qmax: {ingredient.qmax}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-1/6 flex-shrink-0 items-center justify-center mb-4 mr-3">
          <Button className="h-1/2 w-full">
            <EditIcon className={iconClasses} />
          </Button>
          <Button color="danger" className="h-1/2 w-full">
            <TrashIcon className={iconClasses} />
          </Button>
        </div>
      </div>
    </Card>
  );
}

