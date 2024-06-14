'use client'; // Indique que ce composant doit être rendu côté client.
import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { getAllTemperatures, postTemperature, deleteTemperature } from "@/config/api";

interface Temperature {
    temperatureId: number;
    date: string;
    tmp1: number;
    tmp2: number;
    tmp3: number;
    nomMembre: string;
}

type FridgeKey = 'tmp1' | 'tmp2' | 'tmp3';

const GestionTemps = () => {
    let user = null;
    let prenom = "";
    let nom = "";
    if (typeof window !== 'undefined') {
        user = window.localStorage.getItem("user");
    }
    if (user !== null) {
        user = JSON.parse(user);
        prenom = user.prenom || "Jean";
        nom = user.nom || "Dupont";
    }
    const userName = prenom + " " + nom;

    const { isOpen: isAddModalOpen, onOpen: openAddModal, onClose: closeAddModal } = useDisclosure();
    const { isOpen: isDetailsModalOpen, onOpen: openDetailsModal, onClose: closeDetailsModal } = useDisclosure();
    const [temperatures, setTemperatures] = useState<Temperature[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTemperature, setSelectedTemperature] = useState<Temperature | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedFridge, setSelectedFridge] = useState<FridgeKey>('tmp1');
    const [windowWidth, setWindowWidth] = useState(0);

    const [newTmp1, setNewTmp1] = useState("");
    const [newTmp2, setNewTmp2] = useState("");
    const [newTmp3, setNewTmp3] = useState("");

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        handleResize(); // Initial call to set windowWidth
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        async function fetchTemperatures() {
            try {
                const fetchedTemperatures = await getAllTemperatures();
                fetchedTemperatures.sort((a: Temperature, b: Temperature) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setTemperatures(fetchedTemperatures);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching temperatures:', error);
            }
        }

        fetchTemperatures();
    }, []);

    const isSmallScreen = windowWidth < 768;

    if (isLoading) {
        return <div>Chargement...</div>; // Affiche un message de chargement pendant le chargement des données
    }

    const loadMore = () => {
        setVisibleCount(prevCount => prevCount + 10);
    };

    const loadLess = () => {
        setVisibleCount(prevCount => prevCount - 10);
    };

    const handleSearchChange = (event: any) => {
        setSearchTerm(event.target.value);
    };

    const filteredTemperatures = temperatures.filter((temp: Temperature) => {
        const dateMatch = new Date(temp.date).toLocaleString().includes(searchTerm);
        const memberMatch = temp.nomMembre && temp.nomMembre.toLowerCase().includes(searchTerm.toLowerCase());
        return dateMatch || memberMatch;
    });

    const handleAddModalOpen = () => {
        setNewTmp1("");
        setNewTmp2("");
        setNewTmp3("");
        openAddModal();
    };

    const handleRowClick = (temp: any) => {
        setSelectedTemperature(temp);
        openDetailsModal();
    };

    const updateTemperatures = async () => {
        try {
            const fetchedTemperatures = await getAllTemperatures();
            fetchedTemperatures.sort((a: Temperature, b: Temperature) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setTemperatures(fetchedTemperatures);
        } catch (error) {
            console.error('Error updating temperatures:', error);
        }
    };

    const handleSubmit = async () => {
        if (!newTmp1 || !newTmp2) {
            setErrorMessage("Veuillez remplir les températures des deux frigos.");
            return;
        }

        const newTemperature = {
            temperatureId: -1, // Ceci peut être généré par le backend
            date: new Date().toISOString(),
            tmp1: parseInt(newTmp1),
            tmp2: parseInt(newTmp2),
            tmp3: parseInt(newTmp3),
            nomMembre: userName
        };

        try {
            await postTemperature(newTemperature);
            setNewTmp1("");
            setNewTmp2("");
            setNewTmp3("");
            setErrorMessage("");
            closeAddModal();
            await updateTemperatures(); // Mettre à jour les températures après l'ajout
        } catch (error: any) {
            console.error('Error posting temperature:', error.response?.data || error.message);
            setErrorMessage(error.response?.data?.message || "Une erreur est survenue lors de l'ajout du relevé.");
        }
    };

    const handleDelete = async () => {
        if (selectedTemperature !== null) { // Utilisation de la vérification stricte
            const { temperatureId } = selectedTemperature; // TypeScript sait maintenant que selectedTemperature est de type Temperature
            try {
                await deleteTemperature(temperatureId);
                setTemperatures((prevTemperatures) =>
                    prevTemperatures.filter((temp) => temp.temperatureId !== temperatureId)
                );
                setSelectedTemperature(null);
                setErrorMessage("");
                closeDetailsModal();
            } catch (error: any) {
                console.error('Error deleting temperature:', error.response?.data || error.message);
                setErrorMessage(error.response?.data?.message || "Une erreur est survenue lors de la suppression du relevé.");
            }
        }
    };

    const handleFridgeSelection = (fridge: any) => {
        setSelectedFridge(fridge);
    };

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-center md:text-left">GESTION DES TEMPERATURES</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center mb-4">
                <Input
                    type="text"
                    placeholder="Rechercher par date ou membre"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex-grow p-2 rounded mb-2 sm:mb-0 sm:mr-2 placeholder-gray-400"
                />

                <div className="w-full md:w-auto">
                    <Button className="bg-green-500  py-2 px-4 rounded w-full md:w-auto" onPress={handleAddModalOpen}>
                        Ajouter un relevé
                    </Button>
                </div>
            </div>

            {/* Boutons de sélection de température pour les écrans de petite taille */}
            <div className="flex justify-around md:hidden mb-4">
                <Button onClick={() => handleFridgeSelection('tmp1')} className={`bg-gray-400 py-2 px-4 rounded ${selectedFridge === 'tmp1' && 'bg-gray-600'}`}>Frigo 1</Button>
                <Button onClick={() => handleFridgeSelection('tmp2')} className={`bg-gray-400 py-2 px-4 rounded ${selectedFridge === 'tmp2' && 'bg-gray-600'}`}>Frigo 2</Button>
                <Button onClick={() => handleFridgeSelection('tmp3')} className={`bg-gray-400 py-2 px-4 rounded ${selectedFridge === 'tmp3' && 'bg-gray-600'}`}>Congélateur</Button>
            </div>

            {/* Affichage du tableau */}
            <div className="overflow-x-auto">
                {/* Tableau pour les petits écrans */}
                {isSmallScreen ? (
                    <div className="md:flex md:flex-col">
                        <table className="min-w-full shadow-md rounded-lg mb-4 table-auto md:w-auto md:overflow-x-auto">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">Date</th>
                                    <th className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">Température</th>
                                    <th className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">Membre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTemperatures.slice(0, visibleCount).map((temp) => (
                                    <tr key={temp.temperatureId} className="hover: cursor-pointer" onClick={() => handleRowClick(temp)}>
                                        <td className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">{new Date(temp.date).toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">{temp[selectedFridge]}</td>
                                        <td className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">{temp.nomMembre}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="md:flex md:flex-col">
                        <table className="min-w-full shadow-md rounded-lg mb-4 table-auto md:w-auto md:overflow-x-auto">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">Date</th>
                                    <th className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">Température Frigo 1</th>
                                    <th className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">Température Frigo 2</th>
                                    <th className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">Température Congélateur</th>
                                    <th className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">Membre</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTemperatures.slice(0, visibleCount).map((temp: Temperature) => (
                                    <tr key={temp.temperatureId} className="hover: cursor-pointer" onClick={() => handleRowClick(temp)}>
                                        <td className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">{new Date(temp.date).toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">{temp.tmp1}</td>
                                        <td className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">{temp.tmp2}</td>
                                        <td className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">{temp.tmp3}</td>
                                        <td className="py-2 px-4 border-b border-gray-600 text-center text-xs md:text-sm">{temp.nomMembre}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="flex justify-between mt-4">
                {visibleCount < filteredTemperatures.length && (
                    <button className="bg-blue-500  py-2 px-4 rounded" onClick={loadMore}>Afficher plus</button>
                )}
                {visibleCount > 10 && (
                    <button className="bg-blue-500  py-2 px-4 rounded" onClick={loadLess}>Afficher moins</button>
                )}
            </div>

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
                                    className="p-2 mb-4 w-full rounded"
                                />
                                <Input
                                    label="Température Frigo 2"
                                    type="number"
                                    value={newTmp2}
                                    onChange={(e) => setNewTmp2(e.target.value)}
                                    className="p-2 mb-4 w-full rounded"
                                />
                                <Input
                                    label="Température Congélateur"
                                    type="number"
                                    value={newTmp3}
                                    onChange={(e) => setNewTmp3(e.target.value)}
                                    className="p-2 mb-4 w-full rounded"
                                />
                            </ModalBody>
                            <ModalFooter>
                                {errorMessage && (
                                    <div className="text-red-500 mb-4">{errorMessage}</div>
                                )}
                                <Button className="bg-blue-500  py-2 px-4 rounded" onPress={handleSubmit}>Ajouter</Button>
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
                                <Button className="bg-red-500  py-2 px-4 rounded" onPress={handleDelete}>Supprimer relevé</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default GestionTemps;
