import { postIngredients } from "@/config/api";
import { Ingredients } from "@/types";
import { Modal, ModalBody, ModalHeader, ModalContent, Input, Button } from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";

interface GestionBaguetteModalProps {
    isOpen: boolean;
    onClose: (newBaguetteCount: Ingredients, allBaguetteCount: Ingredients) => void;
    nbBaguette: Ingredients;
    nbAllBaguette: Ingredients;
}

export default function GestionBaguetteModal({ isOpen, onClose, nbBaguette, nbAllBaguette }: GestionBaguetteModalProps) {
    const [newBaguetteCount, setNewBaguetteCount] = useState<number>(0);
    const [allBaguetteCount, setAllBaguetteCount] = useState<number>(0);

    const handleChangeNewBaguetteCount = (e: ChangeEvent<HTMLInputElement>) => {
        setNewBaguetteCount(parseInt(e.target.value));
    }
    
    const handleChangeAllBaguetteCount = (e: ChangeEvent<HTMLInputElement>) => {
        setAllBaguetteCount(parseInt(e.target.value));
    }

    useEffect(() => {
        setNewBaguetteCount(nbBaguette.quantite);
        setAllBaguetteCount(nbAllBaguette.quantite);
    }, [nbBaguette, nbAllBaguette]);


    function handleValidate() {
        const nextBaguette = { ...nbBaguette, quantite: newBaguetteCount }; 
        postIngredients(nextBaguette);
        const nextAllBaguette = { ...nbAllBaguette, quantite: allBaguetteCount };
        postIngredients(nextAllBaguette);

        onClose(nextBaguette, nextAllBaguette);
    }

    return (
        <>
            <Modal isOpen={isOpen} className="max-w-xl">
                <ModalContent>
                    <ModalHeader>Gestion des Baguettes</ModalHeader>
                    <ModalBody className="gap-6 mb-5">
                        <Input
                            label="Nombre de demi-baguettes achetées"
                            labelPlacement="outside"
                            placeholder="Combien de nouvelles demi-baguettes ?"
                            type="number"
                            value={newBaguetteCount.toString()}
                            onChange={(e) => handleChangeNewBaguetteCount(e)}
                        />
                        <Input
                            label="Nombre de demi-baguettes total"
                            labelPlacement="outside"
                            placeholder="Combien de demi-baguettes (hier et aujourd'hui) ?"
                            type="number"
                            value={allBaguetteCount.toString()}
                            onChange={(e) => handleChangeAllBaguetteCount(e)}
                        />
                        <Button
                            onClick={handleValidate}
                        >
                            Valider
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
