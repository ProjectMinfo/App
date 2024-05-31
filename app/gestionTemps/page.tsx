'use client';
import React, { Key, useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Radio, RadioGroup } from "@nextui-org/react";
import { getAllTemperatures, postTemperature } from "@/config/api";


const GestionTemps = () => {
    const defaultUserName = "Utilisateur Anonyme";
    const { isOpen: isAddModalOpen, onOpen: openAddModal, onClose: closeAddModal } = useDisclosure(); // Modal pour ajouter un relevé
    const { isOpen: isDetailsModalOpen, onOpen: openDetailsModal, onClose: closeDetailsModal } = useDisclosure(); // Modal pour afficher les détails d'un relevé
    const [temperatures, setTemperatures] = useState(null); // État pour stocker les informations les temperatures
    const [isLoading, setIsLoading] = useState(true); // État pour indiquer si les données sont en cours de chargement
    const [visibleCount, setVisibleCount] = useState(10); // État pour gérer le nombre de relevés affichés
    const [searchTerm, setSearchTerm] = useState(""); // État pour le terme de recherche
    const [selectedTemperature, setSelectedTemperature] = useState(null); // État pour stocker les données de la ligne cliquée
    const [errorMessage, setErrorMessage] = useState(""); // État pour stocker le message d'erreur


    // États pour les nouvelles températures
    const [newTmp1, setNewTmp1] = useState("");
    const [newTmp2, setNewTmp2] = useState("");
    const [newTmp3, setNewTmp3] = useState("");

    useEffect(() => {

        async function fecthTemperatures() {
            const fetchedTemperatures = await getAllTemperatures();
            fetchedTemperatures.sort((a, b) => new Date(b.date) - new Date(a.date));
            setTemperatures(fetchedTemperatures);
            setIsLoading(false)
        }

        fecthTemperatures();
    }, []);

    console.log(temperatures)

    if (isLoading) {
        return <div>Chargement...</div>; // Affiche un message de chargement pendant le chargement des données
    }

    const loadMore = () => {
        setVisibleCount(prevCount => prevCount + 10);
    };

    const loadLess = () => {
        setVisibleCount(prevCount => prevCount - 10);
    };

    const handleSearchChange = (event: { target: { value: any; }; }) => {
        setSearchTerm(event.target.value);
    };

    const filteredTemperatures = temperatures.filter((temp) => {
        const dateMatch = new Date(temp.date).toLocaleString().includes(searchTerm);
        const memberMatch = temp.nomMembre.toLowerCase().includes(searchTerm.toLowerCase());
        return dateMatch || memberMatch;
    });

    const handleAddModalOpen = () => {
        setNewTmp1("");
        setNewTmp2("");
        setNewTmp3("");
        openAddModal();
    }

    const handleRowClick = (temp: React.SetStateAction<null>) => {
        setSelectedTemperature(temp);
        openDetailsModal();
    }

    const handleSubmit = async () => {
        if (!newTmp1 || !newTmp2) {
            setErrorMessage("Veuillez remplir les températures des deux frigos.");
            return;
        }

        const newTemperature = {
            //temperatureId: temperatures.length + 1, // Génère un nouvel ID pour le relevé
            date: new Date().toISOString(), // Utilise la date actuelle
            tmp1: newTmp1,
            tmp2: newTmp2,
            tmp3: newTmp3,
            nomMembre: defaultUserName // Remplacez par le nom du membre si nécessaire
        };

        console.log(newTemperature);

        try {
            await postTemperature(newTemperature);
            setTemperatures([...temperatures, newTemperature]);
            setNewTmp1("");
            setNewTmp2("");
            setNewTmp3("");
            setErrorMessage(""); // Réinitialiser le message d'erreur
            closeAddModal(); // Ferme le modal
        } catch (error) {
            setErrorMessage("Une erreur est survenue lors de l'ajout du relevé.");
        }
    };

    const handleDelete = () => {
        if (selectedTemperature) {
            const { temperatureId, date, tmp1, tmp2, tmp3, nomMembre } = selectedTemperature;
            // Enregistrement des valeurs de la ligne dans des variables
            const deletedTemperature = { temperatureId, date, tmp1, tmp2, tmp3, nomMembre };
            // Faites ce que vous voulez avec les valeurs enregistrées ici
            console.log("Relevé supprimé :", deletedTemperature);
            // Réinitialisation des données de la ligne
            setSelectedTemperature(null);
            // Fermeture du modal
            closeDetailsModal();
        }
    };


    return (
        <div>
            <h1>GESTION DES TEMPERATURES</h1>
            <Input
                type="text"
                placeholder="Rechercher par date ou membre"
                value={searchTerm}
                onChange={handleSearchChange}
            />
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Frigo 1</th>
                        <th>Frigo 2</th>
                        <th>Congélateur</th>
                        <th>Membre ayant effectué le relevé</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTemperatures.slice(0, visibleCount).map((temp: React.SetStateAction<null>) => (
                        <tr key={temp.temperatureId} onClick={() => handleRowClick(temp)}>
                            <td>{new Date(temp.date).toLocaleString()}</td>
                            <td>{temp.tmp1}</td>
                            <td>{temp.tmp2}</td>
                            <td>{temp.tmp3}</td>
                            <td>{temp.nomMembre}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {visibleCount < filteredTemperatures.length && (
                <button onClick={loadMore}>Afficher plus</button>
            )}
            {visibleCount > 10 && (
                <button onClick={loadLess}>Afficher moins</button>
            )}

            <div>
                <Button onPress={() => handleAddModalOpen()}>Ajouter un relevé</Button>
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Ajouter un relevé</ModalHeader>
                            <ModalBody>
                                <Input
                                    label="Température Frigo 1"
                                    type="number"
                                    value={newTmp1}
                                    onChange={(e) => setNewTmp1(e.target.value)}
                                />
                                <Input
                                    label="Température Frigo 2"
                                    type="number"
                                    value={newTmp2}
                                    onChange={(e) => setNewTmp2(e.target.value)}
                                />
                                <Input
                                    label="Température Congélateur"
                                    type="number"
                                    value={newTmp3}
                                    onChange={(e) => setNewTmp3(e.target.value)}
                                />
                            </ModalBody>
                            <ModalFooter>
                                {/* Affichage du message d'erreur */}
                                {errorMessage && (
                                    <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>
                                )}
                                <Button color="danger" variant="light" onPress={closeAddModal}>
                                    Close
                                </Button>
                                <Button color="primary" onPress={handleSubmit}>
                                    Ajouter
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isDetailsModalOpen}
                onClose={closeDetailsModal}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Détails du relevé</ModalHeader>
                            <ModalBody>
                                {selectedTemperature && (
                                    <>
                                        <p>Date: {new Date(selectedTemperature.date).toLocaleString()}</p>
                                        <p>Température Frigo 1: {selectedTemperature.tmp1}</p>
                                        <p>Température Frigo 2: {selectedTemperature.tmp2}</p>
                                        <p>Température Congélateur: {selectedTemperature.tmp3}</p>
                                        <p>Membre ayant effectué le relevé: {selectedTemperature.nomMembre}</p>
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={closeDetailsModal}>
                                    Fermer
                                </Button>
                                <Button color="primary" onPress={handleDelete}>
                                    Supprimer
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default GestionTemps;
