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
    const [tempItem, setTempItem] = useState<MenuItem>({ ...item }); // State temporaire pour les modifications non sauvegardées
    const [listIngredients, setListIngredients] = useState<Ingredients[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showIngredientModal, setShowIngredientModal] = useState<boolean>(false);
    const [showAddIngredientModal, setShowAddIngredientModal] = useState<boolean>(false);
    const [selectedIngredient, setSelectedIngredient] = useState<Ingredients | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseIngredients = await getIngredients();
                const responseViandes = await getViandes();
                setListIngredients([...responseIngredients, ...responseViandes]);
            } catch (error) {
                console.error('Error fetching ingredients:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Synchroniser tempItem avec l'item actuel chaque fois que le modal s'ouvre
            setTempItem({ ...item });
        }
    }, [isOpen, item]);

    const handleChange = (field: string, value: any) => {
        setTempItem((prev) => ({ ...prev, [field]: value }));
    };

    const handleIngredientChange = (index: number, field: string, value: any) => {
        const newIngredients = [...(tempItem as Plats).ingredients];
        newIngredients[index] = { ...newIngredients[index], [field]: value };
        setTempItem((prev) => ({ ...prev, ingredients: newIngredients }));
    };

    const handleSave = () => {
        onSave(tempItem); // Sauvegarder les modifications faites dans tempItem
        setUpdatedItem(tempItem); // Mettre à jour updatedItem avec les modifications sauvegardées
        onClose();
    };

    const handleIngredientClick = (ingredient: Ingredients, index: number) => {
        setSelectedIngredient(ingredient);
        setSelectedIndex(index);
        setShowIngredientModal(true);
    };

    const handleDeleteIngredient = () => {
        setTempItem((prev) => ({
            ...prev,
            ingredients: (prev as Plats).ingredients.filter((_, i) => i !== selectedIndex),
        }));
        setShowIngredientModal(false);
    };

    const handleAddIngredient = (ingredient: Ingredients) => {
        const newIngredient = { ingredient: ingredient, qmin: 0, qmax: 0 };
        setTempItem((prev) => ({
            ...prev,
            ingredients: [...(prev as Plats).ingredients, newIngredient],
        }));
        setShowAddIngredientModal(false);
    };

    const CustomSelect = ({ selectedIngredient, index }: { selectedIngredient: Ingredients; index: number }) => {
        return (
            <div className="relative">
                <div
                    className="border p-2 z-10 cursor-pointer"
                    onClick={() => handleIngredientClick(selectedIngredient, index)}
                >
                    {selectedIngredient.nom || 'Sélectionner un ingrédient'}
                </div>
            </div>
        );
    };

    // Filtrer les ingrédients disponibles qui ne sont pas déjà dans la liste d'ingrédients du plat
    const availableIngredients = listIngredients.filter((ingredient) => {
        const isInList = (tempItem as Plats).ingredients.some((item) => item.ingredient.id === ingredient.id);
        return !isInList && ingredient.dispo;
    });

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>
                        <h2>Modifier {item.nom}</h2>
                    </ModalHeader>
                    <ModalBody>
                        <Input
                            label="Nom"
                            value={tempItem.nom}
                            onChange={(e) => handleChange('nom', e.target.value)}
                        />
                        <Switch
                            defaultChecked={tempItem.dispo}
                            onChange={(e) => handleChange('dispo', e.target.checked)}
                        >
                            Disponible
                        </Switch>

                        {('prix' && 'prixServeur') in tempItem && (
                            <div className="flex gap-4">
                                <Input
                                    label="Prix"
                                    type="number"
                                    value={tempItem.prix}
                                    onChange={(e) => handleChange('prix', parseFloat(e.target.value))}
                                />
                                <Input
                                    label="Prix Serveur"
                                    type="number"
                                    value={tempItem.prixServeur}
                                    onChange={(e) => handleChange('prixServeur', parseFloat(e.target.value))}
                                />
                            </div>
                        )}

                        {'quantite' in tempItem && (
                            <Input
                                label="Quantité"
                                type="number"
                                value={tempItem.quantite}
                                onChange={(e) => handleChange('quantite', parseInt(e.target.value))}
                            />
                        )}
                        {'quantitePlat' in tempItem && (
                            <>
                                <Input
                                    label="Quantité Boisson"
                                    type="number"
                                    value={tempItem.quantiteBoisson}
                                    onChange={(e) => handleChange('quantiteBoisson', parseInt(e.target.value))}
                                />
                                <Input
                                    label="Quantité Plat"
                                    type="number"
                                    value={tempItem.quantitePlat}
                                    onChange={(e) => handleChange('quantitePlat', parseInt(e.target.value))}
                                />
                                <Input
                                    label="Quantité Snack"
                                    type="number"
                                    value={tempItem.quantiteSnack}
                                    onChange={(e) => handleChange('quantiteSnack', parseInt(e.target.value))}
                                />
                            </>
                        )}
                        {'ingredients' in tempItem && (
                            <>
                                <p>Ingrédients:</p>
                                <div className="flex flex-wrap gap-2">
                                    {(tempItem as Plats).ingredients.map((ingredient, index) => (
                                        <div key={index} className="flex flex-col gap-2 items-center">
                                            <CustomSelect selectedIngredient={ingredient.ingredient} index={index} />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        {'ingredients' in tempItem && (
                            <Button onPress={() => setShowAddIngredientModal(true)}>Ajouter ingrédient</Button>
                        )}
                        <Button onPress={handleSave} color="success">
                            Sauvegarder
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {showIngredientModal && selectedIngredient && (
                <Modal isOpen={showIngredientModal} onClose={() => setShowIngredientModal(false)}>
                    <ModalContent>
                        <ModalHeader>
                            <h2>{selectedIngredient.nom}</h2>
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                label="Quantité min"
                                type="number"
                                value={(tempItem as Plats).ingredients[selectedIndex!].qmin}
                                onChange={(e) =>
                                    handleIngredientChange(selectedIndex!, 'qmin', parseInt(e.target.value))
                                }
                            />
                            <Input
                                label="Quantité max"
                                type="number"
                                value={(tempItem as Plats).ingredients[selectedIndex!].qmax}
                                onChange={(e) =>
                                    handleIngredientChange(selectedIndex!, 'qmax', parseInt(e.target.value))
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onPress={handleDeleteIngredient}>
                                Supprimer
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}

            {showAddIngredientModal && (
                <Modal isOpen={showAddIngredientModal} onClose={() => setShowAddIngredientModal(false)}>
                    <ModalContent>
                        <ModalHeader>
                            <h2>Ajouter un Ingrédient</h2>
                        </ModalHeader>
                        <ModalBody>
                            <div className="grid grid-cols-2 gap-4">
                                {availableIngredients.map((ingredient) => (
                                    <Button
                                        key={ingredient.id}
                                        onPress={() => handleAddIngredient(ingredient)}
                                    >
                                        {ingredient.nom}
                                    </Button>
                                ))}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
}
