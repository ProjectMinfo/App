'use client';
import { Card, Button } from '@nextui-org/react';
import { Menus, Boissons, Plats, Snacks } from '@/types/index';


type MenuItem = Menus | Boissons | Plats | Snacks;
interface ModifyCardProps {
  item: MenuItem;
}

export default function ModifyCard({ item }: ModifyCardProps) {
  return (
    <Card className="p-4 pb-0 relative my-3">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold">{item.nom}</p>
          <div className="flex gap-2">
            <Button >
              Modifier
            </Button>
            <Button color="danger">
              Supprimer
            </Button>
          </div>
        </div>
        <div className=" p-4 rounded-md">
          <p className="text-gray-700"><strong>Disponibilité:</strong> {item.dispo ? 'Oui' : 'Non'}</p>
          <p className="text-gray-700"><strong>Prix:</strong> {item.prix} €</p>
          <p className="text-gray-700"><strong>Prix Serveur:</strong> {item.prixServeur} €</p>
          
          {'quantitePlat' in item && (
            <>
              <p className="text-gray-700"><strong>Quantité Boisson:</strong> {item.quantiteBoisson}</p>
              <p className="text-gray-700"><strong>Quantité Plat:</strong> {item.quantitePlat}</p>
              <p className="text-gray-700"><strong>Quantité Snack:</strong> {item.quantiteSnack}</p>
            </>
          )}
          
          {'quantite' in item && !('ingredients' in item) && (
            <p className="text-gray-700"><strong>Quantité:</strong> {item.quantite}</p>
          )}
          
          {'ingredients' in item && (
            <>
              <p className="text-gray-700"><strong>Quantité:</strong> {item.quantite}</p>
              <p className="text-gray-700"><strong>Ingrédients:</strong></p>
              <ul className="text-gray-700 ml-4">
                {item.ingredients.map((ingredient) => (
                  <li key={ingredient.id}>ID: {ingredient.id}, Qmin: {ingredient.qmin}, Qmax: {ingredient.qmax}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
