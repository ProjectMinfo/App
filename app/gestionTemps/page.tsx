'use client';
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { getAllTemperatures, postTemperature, deleteTemperature } from "@/config/api";


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
            temperatureId: -1, // Génère un nouvel ID pour le relevé
            date: new Date().toISOString(), // Utilise la date actuelle
            tmp1: parseInt(newTmp1),
            tmp2: parseInt(newTmp2),
            tmp3: parseInt(newTmp3),
            nomMembre: defaultUserName // Remplacez par le nom du membre si nécessaire
        };


        try {
            const response = await postTemperature(newTemperature);
            setTemperatures([...temperatures, newTemperature]);
            setNewTmp1("");
            setNewTmp2("");
            setNewTmp3("");
            setErrorMessage(""); // Réinitialiser le message d'erreur
            closeAddModal(); // Ferme le modal
            window.location.reload();

        } catch (error) {
            console.error('Error posting temperature:', error.response?.data || error.message);
            setErrorMessage(error.response?.data?.message || "Une erreur est survenue lors de l'ajout du relevé.");
        }
    };

    const handleDelete = async () => {
        if (selectedTemperature) {
            const { temperatureId, date, tmp1, tmp2, tmp3, nomMembre } = selectedTemperature;
            // Enregistrement des valeurs de la ligne dans des variables
            const deletedTemperature = { temperatureId, date, tmp1, tmp2, tmp3, nomMembre };
            try {
                const response = await deleteTemperature(deletedTemperature.temperatureId);
                setSelectedTemperature(null);
                setErrorMessage(""); // Réinitialiser le message d'erreur
                closeDetailsModal();
                window.location.reload();
            } catch (error) {
                console.error('Error deleting temperature:', error.response?.data || error.message);
                setErrorMessage(error.response?.data?.message || "Une erreur est survenue lors de la suppression du relevé.");
            }
        }
    };


    return (
        <div className="container mx-auto p-4 min-h-screen">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-center sm:text-left">GESTION DES TEMPERATURES</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center mb-4">
            <Input
                type="text"
                placeholder="Rechercher par date ou membre"
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-grow border p-2 rounded mb-2 sm:mb-0 sm:mr-2 placeholder-gray-400"
            />
            <Button className="bg-green-500 text-white py-2 px-4 rounded" onPress={() => handleAddModalOpen()}>Ajouter un relevé</Button>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full shadow-md rounded-lg mb-4 table-auto">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-600 text-center text-xs sm:text-sm">Date</th>
                        <th className="py-2 px-4 border-b border-gray-600 text-center text-xs sm:text-sm">Températures</th>
                        <th className="py-2 px-4 border-b border-gray-600 text-center text-xs sm:text-sm">Membre</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTemperatures.slice(0, visibleCount).map((temp) => (
                        <tr key={temp.temperatureId} className="hover: cursor-pointer" onClick={() => handleRowClick(temp)}>
                            <td className="py-2 px-4 border-b border-gray-600 text-center text-xs sm:text-sm">{new Date(temp.date).toLocaleString()}</td>
                            <td className="py-2 px-4 border-b border-gray-600 text-xs sm:text-sm">
                                {/* Condition pour afficher une seule colonne sur les petits écrans */}
                                <div className="flex flex-col sm:flex-row">
                                    <p className="sm:w-1/3 sm:pr-2 hidden md:block">Frigo 1: {temp.tmp1}</p>
                                    <p className="sm:w-1/3 sm:pr-2 hidden md:block">Frigo 2: {temp.tmp2}</p>
                                    <p className="sm:w-1/3 hidden md:block">Congélateur: {temp.tmp3}</p>
                                    {/* Pour les petits écrans, afficher une colonne avec un seul type de température */}
                                    <p className="block md:hidden">Température: {temp.tmp1}</p>
                                </div>
                            </td>
                            <td className="py-2 px-4 border-b border-gray-600 text-center text-xs sm:text-sm">{temp.nomMembre}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="flex justify-between mt-4">
            {visibleCount < filteredTemperatures.length && (
                <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={loadMore}>Afficher plus</button>
            )}
            {visibleCount > 10 && (
                <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={loadLess}>Afficher moins</button>
            )}
        </div>
    
            {/* Modals */}
            <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
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
                                    className="border p-2 mb-4 w-full rounded"
                                />
                                <Input
                                    label="Température Frigo 2"
                                    type="number"
                                    value={newTmp2}
                                    onChange={(e) => setNewTmp2(e.target.value)}
                                    className="border p-2 mb-4 w-full rounded"
                                />
                                <Input
                                    label="Température Congélateur"
                                    type="number"
                                    value={newTmp3}
                                    onChange={(e) => setNewTmp3(e.target.value)}
                                    className="border p-2 mb-4 w-full rounded"
                                />
                            </ModalBody>
                            <ModalFooter>
                                {errorMessage && (
                                    <div className="text-red-500 mb-4">{errorMessage}</div>
                                )}
                                <Button className="bg-blue-500 text-white py-2 px-4 rounded" onPress={handleSubmit}>Ajouter</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
    
            <Modal isOpen={isDetailsModalOpen} onClose={closeDetailsModal}>
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
                                        <p>Membre: {selectedTemperature.nomMembre}</p>
                                    </>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                {errorMessage && (
                                    <div className="text-red-500 mb-4">{errorMessage}</div>
                                )}
                                <Button className="bg-red-500 text-white py-2 px-4 rounded" onPress={handleDelete}>Supprimer relevé</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
    

    



}

export default GestionTemps;
