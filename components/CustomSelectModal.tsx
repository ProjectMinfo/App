import { useState } from 'react';
import { Button, Dropdown, DropdownMenu, DropdownItem, DropdownTrigger } from '@nextui-org/react';
import { Ingredients } from '@/types/index';

interface CustomSelectProps {
    selectedIngredient: Ingredients;
    index: number;
    listIngredients: Ingredients[];
    handleIngredientChange: (index: number, field: string, value: any) => void;
}

export const CustomSelect = ({ selectedIngredient, index, listIngredients, handleIngredientChange }: CustomSelectProps) => {
    const [selected, setSelected] = useState<string | null>(selectedIngredient.nom || null);

    const handleSelect = (ingredient: Ingredients) => {
        setSelected(ingredient.nom);
        handleIngredientChange(index, 'ingredient', ingredient);
    };

    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="flat">{selected || "Select Ingredient"}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Ingredients">
                {listIngredients.filter(ingredient => ingredient.dispo).map((ingredient) => (
                    <DropdownItem key={ingredient.id} onClick={() => handleSelect(ingredient)}>
                        {ingredient.nom}
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};

export default CustomSelect;
