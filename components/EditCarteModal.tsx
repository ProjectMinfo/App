import { use, useEffect, useState } from 'react';
import { Button, Modal, Input, ModalHeader, ModalBody, ModalFooter, ModalContent, Switch, Select, SelectItem } from '@nextui-org/react';
import { Menus, Boissons, Plats, Snacks, Ingredients } from '@/types/index';
import { TrashIcon } from '@/public/TrashIcon';
import { getIngredients } from '@/config/api';

type MenuItem = Menus | Boissons | Plats | Snacks;

interface EditModalProps {
    item: MenuItem;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedItem: MenuItem) => void;
}

export default function EditCarteModal({ item, isOpen, onClose, onSave }: EditModalProps) {
    const [updatedItem, setUpdatedItem] = useState<MenuItem>({ ...item });

    const handleChange = (field: string, value: any) => {
        setUpdatedItem((prev) => ({ ...prev, [field]: value }));
    };

    const handleIngredientChange = (index: number, field: string, value: any) => {
        const newIngredients = [...updatedItem.ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setUpdatedItem((prev) => ({ ...prev, ingredients: newIngredients }));
    };

    const handleSave = () => {
        console.log('updatedItem:', updatedItem);
        
        onSave(updatedItem);
        onClose();
    };

    const addIngredient = () => {
        setUpdatedItem((prev) => ({
            ...prev,
            ingredients: [...prev.ingredients, { id: 0, qmin: 0, qmax: 0 }],
        }));
    }

    const [listIngredients, setListIngredients] = useState<Ingredients[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getIngredients();
                setListIngredients(response);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader>
                    <h2>Modifier {item.nom}</h2>
                </ModalHeader>
                <ModalBody>
                    <Input
                        label="Nom"
                        value={updatedItem.nom}
                        onChange={(e) => handleChange('nom', e.target.value)}
                    />
                    <Switch
                        defaultSelected={updatedItem.dispo}
                        onChange={(e) => handleChange('dispo', e.target.checked)}>
                        Disponible
                    </Switch>
                    <div className="flex gap-4">
                        <Input
                            label="Prix"
                            type="number"
                            value={updatedItem.prix}
                            onChange={(e) => handleChange('prix', parseFloat(e.target.value))}
                        />
                        <Input
                            label="Prix Serveur"
                            type="number"
                            value={updatedItem.prixServeur}
                            onChange={(e) => handleChange('prixServeur', parseFloat(e.target.value))}
                        />
                    </div>

                    {'quantite' in updatedItem && (
                        <Input
                            label="Quantité"
                            type="number"
                            value={updatedItem.quantite}
                            onChange={(e) => handleChange('quantite', parseInt(e.target.value))}
                        />
                    )}
                    {'quantitePlat' in updatedItem && (
                        <>
                            <Input
                                label="Quantité Boisson"
                                type="number"
                                value={updatedItem.quantiteBoisson}
                                onChange={(e) => handleChange('quantiteBoisson', parseInt(e.target.value))}
                            />
                            <Input
                                label="Quantité Plat"
                                type="number"
                                value={updatedItem.quantitePlat}
                                onChange={(e) => handleChange('quantitePlat', parseInt(e.target.value))}
                            />
                            <Input
                                label="Quantité Snack"
                                type="number"
                                value={updatedItem.quantiteSnack}
                                onChange={(e) => handleChange('quantiteSnack', parseInt(e.target.value))}
                            />
                        </>
                    )}
                    {'ingredients' in updatedItem && (
                        <>
                            <p>Ingrédients:</p>
                            {updatedItem.ingredients.map((ingredient, index) => (
                                <div key={index} className='flex gap-2'>
                                    <Select
                                        label="Ingrédient"
                                        className="relative w-[1000px]"
                                        defaultSelectedKeys={[ingredient.id]}
                                        onChange={(e) => handleIngredientChange(index, 'id', parseInt(e.target.value))}
                                    >
                                        {listIngredients.filter(ingredient => ingredient.dispo).map((ingredient) => (
                                            <SelectItem key={ingredient.id} className='w-[100%]' value={ingredient.id}>
                                                {ingredient.nom}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Input
                                        label={`Quantité min ${index + 1}`} 
                                        type="number"
                                        value={ingredient.qmin}
                                        onChange={(e) => handleIngredientChange(index, 'qmin', parseInt(e.target.value))}
                                    />
                                    <Input
                                        label={`Quantité max ${index + 1}`}
                                        type="number"
                                        value={ingredient.qmax}
                                        onChange={(e) => handleIngredientChange(index, 'qmax', parseInt(e.target.value))}
                                    />
                                    <Button isIconOnly color='danger' onPress={() => setUpdatedItem((prev) => ({
                                        ...prev,
                                        ingredients: prev.ingredients.filter((_, i) => i !== index),
                                    }))}>
                                        <TrashIcon className="text-default-900" />
                                    </Button>
                                </div>
                            ))}

                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    {'ingredients' in updatedItem && (
                    <Button onPress={addIngredient}>Ajouter ingrédient</Button>
                    )}
                    <Button onPress={handleSave} color='success'>Sauvegarder</Button>
                    <Button onPress={onClose}>Annuler</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
