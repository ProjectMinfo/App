import React, { useState, useEffect } from "react";
import { Button, CalendarDate, DateInput, DateValue, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Radio, RadioGroup } from "@nextui-org/react";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { parseDate } from "@internationalized/date";
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
    onSubmit: (newAchat: Achat) => void;
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
    const [dlc, setDlc] = useState<any>();
    const [ingredients, setIngredients] = useState<Produit[]>([]);
    const [viandes, setViandes] = useState<Produit[]>([]);
    const [boissons, setBoissons] = useState<Produit[]>([]);
    const [snacks, setSnacks] = useState<Produit[]>([]);
    const [idProduit, setIdProduit] = useState<number>(-1);
    const [selectedProduit, setSelectedProduit] = useState<Produit>();
    const [duplication, setDuplication] = useState<number>(1);
    const [isSubmitClicked, setIsSubmitClicked] = useState<boolean>(false);

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
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

    const resetForm = () => {
        setNomArticle("");
        setCategorie(-1);
        setNumLot("");
        setNbPortions(0);
        setDlc(undefined);
        setDuplication(1);
    };


    const handleTypeChange = (event: SelectChangeEvent) => {
        setCategorie(Number(event.target.value));
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
            // Mettre à jour le produit sélectionné
            setSelectedProduit(selectedProduct);

            // Mettre à jour le nom de l'article avec le nom du produit sélectionné
            setNomArticle(selectedProduct.nom);
        }

    };

    const handleNumLotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumLot(event.target.value);
    };

    const handleDlcChange = (newDate: DateValue) => {
        // Convertir l'objet CalendarDate en une instance de Date standard
        const jsDate = new Date(newDate.year, newDate.month - 1, newDate.day)

        const timestampDate = jsDate.getTime();

        // Mettre à jour l'état dlc avec la date standard JavaScript
        setDlc({ "$date": { $numberLong: timestampDate.toString() } });

    };

    const handleNbPortionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNbPortions(Number(event.target.value));
    };

    const handleDuplicationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDuplication(Number(event.target.value));
    };

    const handleSubmit = () => {
        setIsSubmitClicked(true);
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
        }
        onSubmit(newAchat);
        onClose();
    };


    return (
        <Modal isOpen={isOpen} placement="top-center">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    Ajouter un achat
                </ModalHeader>

                <ModalBody>

                    <FormControl required fullWidth>
                        <InputLabel id="demo-simple-select-required-label">Catégorie</InputLabel>
                        <Select
                            labelId="demo-simple-select-required-label"
                            id="demo-simple-select-required"
                            label="Catégorie"
                            onChange={handleTypeChange}
                        >
                            {typesAchat.map((type) => (
                                <MenuItem key={type.key} value={type.key}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {categorie !== -1 ? (
                        <FormControl>
                            <InputLabel id="demo-simple-select-required-label">Selection du produit</InputLabel>
                            <Select
                                labelId="demo-simple-select-required-label"
                                id="demo-simple-select-required"
                                label="Selection du produit"
                                onChange={handleProduitChange}
                            >
                                {(categorie === 0 ? ingredients
                                    : categorie === 1 ? viandes
                                        : categorie === 2 ? boissons
                                            : snacks).map((produit) => (
                                                <MenuItem key={produit.id} value={produit.id}>
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
                        value={numLot}
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
                        value="1"
                        onChange={handleDuplicationChange}
                    />

                </ModalBody>

                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        Annuler
                    </Button>

                    <Button color="primary" onPress={handleSubmit}>
                        Valider
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    );
}