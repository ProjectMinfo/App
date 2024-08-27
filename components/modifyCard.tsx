'use client';
import { Card, Button, Modal, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { Menus, Boissons, Plats, Snacks, Ingredients, Viandes } from '@/types/index';
import { EditIcon } from '@/public/EditIcon';
import { TrashIcon } from '@/public/TrashIcon';
import { useState } from 'react';
import EditCarteModal from './EditCarteModal';
import { deleteBoissons, deleteIngredients, deleteMenus, deletePlats, deleteSnacks, deleteViandes, postBoissons, postIngredients, postMenus, postPlats, postSnacks, postViandes } from '@/config/api';

type MenuItem = Menus | Boissons | Plats | Snacks | Ingredients | Viandes;
interface ModifyCardProps {
  type: string;
  item: MenuItem;
}

export default function ModifyCard({ item, type }: ModifyCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(item);

  const [isOpenDelete, setOpenDelete] = useState(false);
  const [rdyToDelete, setRdyToDelete] = useState(false);
  const [ingredientNames, setIngredientNames] = useState<{ [key: number]: string }>({});


  const handleSave = (updatedItem: MenuItem) => {
    setCurrentItem(updatedItem);

    if (type === 'menu') {
      postMenus(updatedItem);
    } else if (type === 'plat') {
      postPlats(updatedItem);
    } else if (type === 'boisson') {
      postBoissons(updatedItem);
    } else if (type === 'snack') {
      postSnacks(updatedItem);
    } else if (type === 'ingredient') {
      postIngredients(updatedItem);
    } else if (type === 'viande') {
      postViandes(updatedItem);
    }
  };

  const handleDelete = (id: number) => {
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    setRdyToDelete(true);
    if (type === 'menu') {
      deleteMenus(currentItem.id);
    } else if (type === 'plat') {
      deletePlats(currentItem.id);
    } else if (type === 'boisson') {
      deleteBoissons(currentItem.id);
    } else if (type === 'snack') {
      deleteSnacks(currentItem.id);
    } else if (type === 'ingredient') {
      deleteIngredients(currentItem.id);
    } else if (type === 'viande') {
      deleteViandes(currentItem.id);
    }
    setOpenDelete(false);
  };

  const cancelDelete = () => {
    setOpenDelete(false);
    setRdyToDelete(false);
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
              {( 'event' in currentItem) && (
                <p className="text-gray-500"><strong>Evenement:</strong> {currentItem.event ? 'Oui' : 'Non'}</p>
              )}
              {('prix' && 'prixServeur') in currentItem && (
                <>
                  <p className="text-gray-500"><strong>Prix:</strong> {currentItem.prix} €</p>
                  <p className="text-gray-500"><strong>Prix Serveur:</strong> {currentItem.prixServeur} €</p>
                </>
              )}

              {'quantitePlat' in currentItem && (
                <>
                  <p className="text-gray-500"><strong>Quantité Boisson:</strong> {currentItem.quantiteBoisson}</p>
                  <p className="text-gray-500"><strong>Quantité Plat:</strong> {currentItem.quantitePlat}</p>
                  <p className="text-gray-500"><strong>Quantité Snack:</strong> {currentItem.quantiteSnack}</p>
                </>
              )}


            </div>
          </div>
          <div className="flex flex-col gap-2 w-1/6 flex-shrink-0 items-center justify-center mr-2 mb-4">
            <Button className="h-1/2 w-full" onPress={() => setIsModalOpen(true)}>
              <EditIcon className={iconClasses} />
            </Button>
            <Button color="danger" className="h-1/2 w-full" onPress={() => { handleDelete(currentItem.id) }}>
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

      <Modal isOpen={isOpenDelete} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Vous êtes sûr de vouloir supprimer ?</ModalHeader>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={() => cancelDelete()}>
                  Non
                </Button>
                <Button color="danger" onPress={() => confirmDelete()}>
                  Oui
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
