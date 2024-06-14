import { useEffect, useState } from 'react';
import { Button, Modal, Input, ModalHeader, ModalBody, ModalFooter, ModalContent, Switch } from '@nextui-org/react';
import { Menus, Boissons, Plats, Snacks, Ingredients, Viandes } from '@/types/index';
import { TrashIcon } from '@/public/TrashIcon';
import { getIngredients, getViandes } from '@/config/api';

type MenuItem = Menus | Boissons | Plats | Snacks | Ingredients | Viandes;

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
        const newIngredients = [...(updatedItem as Plats).ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setUpdatedItem((prev) => ({ ...prev, ingredients: newIngredients }));
    };

    const handleSave = () => {
        onSave(updatedItem);
        onClose();
    };

    const addIngredient = () => {
        setUpdatedItem((prev) => ({
            ...prev,
            ingredients: [...(prev as Plats).ingredients, { ingredient: { id: 0, nom: '', dispo: true, quantite: 0, commentaire: '' }, qmin: 0, qmax: 0 }],
        }));
    };

    const [listIngredients, setListIngredients] = useState<Ingredients[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseIngredients = await getIngredients();
                const responseViandes = await getViandes();
                setListIngredients([...responseIngredients, ...responseViandes])
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchData();
    }, []);

    const CustomSelect = ({ selectedIngredient, index }: { selectedIngredient: Ingredients, index: number }) => {
        const [showOptions, setShowOptions] = useState(false);

        return (
            <div className="relative">
                <div
                    className="border p-2 z-10 cursor-pointer"
                    onClick={() => setShowOptions(!showOptions)}
                >
                    {selectedIngredient.nom || "Select Ingredient"}
                </div>
                {showOptions && (
                    <div className="z-10 overflow-scroll">
                        {listIngredients.filter(ingredient => ingredient.dispo).map((ingredient) => (
                            <div
                                key={ingredient.id}
                                className="p-2 cursor-pointer"
                                onClick={() => {
                                    handleIngredientChange(index, 'ingredient', ingredient);
                                    setShowOptions(false);
                                }}
                            >
                                {ingredient.nom}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };


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
                    <div className="flex justify-between">
                        <Switch
                            isSelected={updatedItem.dispo}
                            onChange={(e) => handleChange('dispo', e.target.checked)}
                        >
                            Disponible
                        </Switch>

                        {'event' in updatedItem && (
                            <Switch
                                isSelected={updatedItem.event}
                                onChange={(e) => handleChange('event', e.target.checked)}
                            >
                                Evenement
                            </Switch>
                        )}
                    </div>

                    {('prix' && 'prixServeur') in updatedItem && (
                        <>
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
                        </>
                    )}

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
                            {(updatedItem as Plats).ingredients.map((ingredient, index) => (
                                <div key={index} className='flex gap-2'>
                                    <CustomSelect selectedIngredient={ingredient.ingredient} index={index} />
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
                                        ingredients: (prev as Plats).ingredients.filter((_, i) => i !== index),
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
