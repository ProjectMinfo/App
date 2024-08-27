import React, { useState, useEffect } from "react";
import { Button, DateInput, DateValue, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getIngredients, getViandes, getBoissons, getSnacks } from "@/config/api";

type Achat = {
    idAchat: number;
    categorie: number;
    dateFermeture: null;
    dateOuverture: null;
    dlc: any;
    etat: number;
    idProduit: number;
    nbPortions: number;
    nomArticle: string;
    numLot: string;
    qtePerimee: number;
}

interface AddAchatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (newAchat: Achat, duplication: number) => void;
}

type Produit = {
    id: number;
    nom: string;
    quantite: number;
    dispo: boolean;
    commentaire: string;
}

const typesAchat = [
    { key: 0, label: "Ingrédient" },
    { key: 1, label: "Viande" },
    { key: 2, label: "Boisson" },
    { key: 3, label: "Snack" }
];


export default function AddAchatModal({
    isOpen,
    onClose,
    onSubmit
}: AddAchatModalProps) {

    const [nomArticle, setNomArticle] = useState<string>("");
    const [categorie, setCategorie] = useState<number>(-1);
    const [numLot, setNumLot] = useState<string>("");
    const [nbPortions, setNbPortions] = useState<number>(0);
    const [dlc, setDlc] = useState<any>(null);
    const [ingredients, setIngredients] = useState<Produit[]>([]);
    const [viandes, setViandes] = useState<Produit[]>([]);
    const [boissons, setBoissons] = useState<Produit[]>([]);
    const [snacks, setSnacks] = useState<Produit[]>([]);
    const [idProduit, setIdProduit] = useState<number>(-1);
    const [selectedProduit, setSelectedProduit] = useState<Produit | null>(null);
    const [duplication, setDuplication] = useState<number>(1);
    const [isTypeValid, setIsTypeValid] = useState<boolean>(false);
    const [isNumLotValid, setIsNumLotValid] = useState<boolean>(false);
    const [isDlcValid, setIsDlcValid] = useState<boolean>(false);
    const [isNbPortionsValid, setIsNbPortionsValid] = useState<boolean>(false);
    const [isDuplicationValid, setIsDuplicationValid] = useState<boolean>(true);

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const listeIngredients: Produit[] = await getIngredients(); // Appel à l'API pour récuperer la liste des ingrédients les modifications
                const listeViandes: Produit[] = await getViandes(); // Appel à l'API pour récuperer la liste des viandes les modifications
                const listeBoissons: Produit[] = await getBoissons(); // Appel à l'API pour récuperer la liste des boissons les modifications
                const listeSnacks: Produit[] = await getSnacks(); // Appel à l'API pour récuperer la liste des snacks les modifications
                setIngredients(listeIngredients);
                setViandes(listeViandes);
                setBoissons(listeBoissons);
                setSnacks(listeSnacks);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchProduits();
    }, []);

    useEffect(() => {
        if (isOpen) { resetForm() }
    }, [isOpen]);

    const resetForm = () => {
        setNomArticle("");
        setCategorie(-1);
        setNumLot("");
        setNbPortions(0);
        setDlc(null);
        setIdProduit(-1);
        setSelectedProduit(null);
        setDuplication(1);
    };


    const handleTypeChange = (event: SelectChangeEvent) => {
        const newCategory = Number(event.target.value);
        setCategorie(newCategory);
        const defaultProduit = (
            newCategory === 0 ? ingredients
                : newCategory === 1 ? viandes
                    : newCategory === 2 ? boissons
                        : snacks)[0]; // Choisissez le premier produit de la nouvelle catégorie
        setSelectedProduit(defaultProduit);
        setNomArticle(defaultProduit.nom);
        setIdProduit(defaultProduit.id);
        setIsTypeValid(true);
    };

    const handleProduitChange = (event: SelectChangeEvent) => {
        const newIdProduit = Number(event.target.value)
        setIdProduit(newIdProduit);

        // Trouvez le produit correspondant à l'ID sélectionné
        const selectedProduct = (
            categorie === 0 ? ingredients
                : categorie === 1 ? viandes
                    : categorie === 2 ? boissons
                        : snacks
        ).find(produit => produit.id === newIdProduit);

        if (selectedProduct) {
            setSelectedProduit(selectedProduct); // Mettre à jour le produit sélectionné
            setNomArticle(selectedProduct.nom); // Mettre à jour le nom de l'article avec le nom du produit sélectionné
        } else {
            setSelectedProduit(null);
            setNomArticle("");
        }
    };

    const handleNumLotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumLot(event.target.value);
        if (event.target.value === "") { setIsNumLotValid(false) }
        else { setIsNumLotValid(true) }
    };

    const handleDlcChange = (newDate: DateValue) => {
        if (newDate && newDate.year >= 1900 && newDate.year <= 2099) {
            // Convertir l'objet CalendarDate en une instance de Date standard
            const jsDate = new Date(newDate.year, newDate.month - 1, newDate.day)

            // Vérifie si la date est valide
            if (!isNaN(jsDate.getTime())) {
                const timestampDate = jsDate.getTime();
                setDlc({ "$date": { $numberLong: timestampDate.toString() } }); // Mettre à jour l'état dlc avec la date standard JavaScript
                setIsDlcValid(true);
            }
            else { setIsDlcValid(false) }
        }
        else { setIsDlcValid(false) }
    };

    const handleNbPortionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNbPortions(Number(event.target.value));
        if (Number(event.target.value) > 0) { setIsNbPortionsValid(true) }
        else { setIsNbPortionsValid(false) }
    };

    const handleDuplicationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDuplication(Number(event.target.value));
        if (Number(event.target.value) > 0) { setIsDuplicationValid(true) }
        else { setIsDuplicationValid(false) }
    };

    const handleSubmit = () => {
        if (categorie >= 0 && categorie <= 3 && idProduit && dlc && nbPortions && numLot) {
            const newAchat: Achat = {
                idAchat: -1,
                categorie: categorie,
                dateFermeture: null,
                dateOuverture: null,
                dlc: dlc,
                etat: 0, // L'article est initialement fermé
                idProduit: idProduit,
                nbPortions: nbPortions,
                nomArticle: nomArticle,
                numLot: numLot,
                qtePerimee: 0
            };
            onSubmit(newAchat, duplication);
        }
        onClose();
    };


    return (
        <Modal isOpen={isOpen} hideCloseButton={true} placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Ajouter un achat
                </ModalHeader>

                <ModalBody>

                    <FormControl required fullWidth>
                        <InputLabel id="demo-simple-select-required-labelinput1">Catégorie</InputLabel>
                        <Select
                            labelId="demo-simple-select-required-labelinput1"
                            id="input1"
                            value={categorie.toString()}
                            label="Catégorie"
                            onChange={handleTypeChange}
                        >
                            {typesAchat.map((type, index) => (
                                <MenuItem key={index} value={type.key}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {categorie !== -1 ? (
                        <FormControl required fullWidth>
                            <InputLabel id="demo-simple-select-required-labelinput2">Selection du produit</InputLabel>
                            <Select
                                labelId="demo-simple-select-required-labelinput2"
                                id="input2"
                                value={idProduit.toString()}
                                label="Selection du produit"
                                onChange={handleProduitChange}
                            >
                                {(categorie === 0 ? ingredients
                                    : categorie === 1 ? viandes
                                        : categorie === 2 ? boissons
                                            : snacks).map((produit, index) => (
                                                <MenuItem key={index} value={produit.id}>
                                                    {produit.nom}
                                                </MenuItem>
                                            ))}
                            </Select>
                        </FormControl>
                    ) : <div>Veuillez sélectionner une catégorie</div>}

                    <Input
                        isRequired
                        label="Numéro de lot"
                        type="string"
                        onChange={handleNumLotChange}
                        variant="bordered"
                    />

                    <DateInput
                        label="Date limite de consommation :"
                        variant="faded"
                        onChange={handleDlcChange}
                    />

                    <p>
                        {selectedProduit ? selectedProduit.commentaire : ""}
                    </p>

                    <Input
                        label="Quantité de produits"
                        type="number"
                        variant="bordered"
                        onChange={handleNbPortionsChange}
                    />

                    <Input
                        label="Dupliquer l'achat"
                        type="number"
                        variant="bordered"
                        value={duplication.toString()}
                        onChange={handleDuplicationChange}
                    />

                </ModalBody>

                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        Annuler
                    </Button>

                    <Button color="primary" onPress={handleSubmit} isDisabled={!isTypeValid || !isNumLotValid || !isDlcValid || !isNbPortionsValid || !isDuplicationValid}>
                        Valider
                    </Button>
                </ModalFooter>

            </ModalContent>

        </Modal>
    );
}