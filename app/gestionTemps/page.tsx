'use client';
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Radio, RadioGroup } from "@nextui-org/react";

const GestionTemps = () => {
    const defaultUserName = "Utilisateur Anonyme";
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [modalContent, setModalContent] = useState(null);
    const [newDeviceType, setNewDeviceType] = useState(null); // Définir un type d'appareil par défaut
    const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(null);
    const [deviceErrorMessage, setDeviceErrorMessage] = useState("");



    const [entries, setEntries] = useState([]);
    const [devices, setDevices] = useState([
        { type: 'Frigo', name: 'Frigo 1' },
        { type: 'Frigo', name: 'Frigo 2' },
        { type: 'Congélateur', name: 'Congélateur 1' }
    ]);
    const [newEntry, setNewEntry] = useState({
        temps: devices.reduce((acc, device) => ({ ...acc, [device.name]: "" }), {}),
        recordedBy: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (device: string, value: string) => {
        setNewEntry(prevState => ({
            ...prevState,
            temps: { ...prevState.temps, [device]: value }
        }));
    };

    const handleRecordedByChange = (value: string) => {
        setNewEntry(prevState => ({
            ...prevState,
            recordedBy: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const allFieldsFilled = Object.values(newEntry.temps).every(temp => temp.trim() !== "");
    
        if (allFieldsFilled && newDeviceType !== "") {
            // Si le champ "Enregistré par" était présent, tu pourrais l'ajouter ici
            const recordedBy = defaultUserName;
    
            setEntries([...entries, { date: new Date().toLocaleString(), ...newEntry, recordedBy }]);
            onClose();
            setNewEntry({
                temps: devices.reduce((acc, device) => ({ ...acc, [device.name]: "" }), {})
            });
            setErrorMessage("");
        } else {
            setErrorMessage("Veuillez remplir tous les champs avant d'enregistrer un relevé.");
        }
    };
    

    const addDevice = () => {
        if (!newDeviceType) {
            setDeviceErrorMessage("Veuillez sélectionner un type d'appareil.");
            return;
        }
    
        const newDeviceCount = devices.filter(device => device.type === newDeviceType).length + 1;
        const newDevice = {
            type: newDeviceType,
            name: `${newDeviceType} ${newDeviceCount}`
        };
    
        const newDevices = [...devices];
        newDevices.push(newDevice);
        setDevices(newDevices);
        onClose();
        setDeviceErrorMessage(""); // Réinitialiser le message d'erreur
    };

    const confirmDeleteDevice = () => {
        if (selectedDeviceIndex !== null) {
            const updatedDevices = [...devices];
            const deletedDeviceType = updatedDevices[selectedDeviceIndex].type;
            updatedDevices.splice(selectedDeviceIndex, 1);
    
            // Réinitialiser le compteur de numéros d'appareils pour le type supprimé
            let deviceCount = 1;
            for (let i = 0; i < updatedDevices.length; i++) {
                if (updatedDevices[i].type === deletedDeviceType) {
                    updatedDevices[i].name = `${deletedDeviceType} ${deviceCount}`;
                    deviceCount++;
                }
            }
            
            setDevices(updatedDevices);
            setSelectedDeviceIndex(null);
            onClose(); // Fermer le modal après la suppression
        }
    };

    const openModal = (content, index) => {
        // Réinitialiser les états des champs de formulaire
        setNewEntry({
            temps: devices.reduce((acc, device) => ({ ...acc, [device.name]: "" }), {}),
            recordedBy: ""
        });
        setNewDeviceType(null); // Réinitialiser le type d'appareil sélectionné
        setSelectedDeviceIndex(index);
        setModalContent(content);
        onOpen();
    };

    return (
        <div>
            <h1>GESTION DES TEMPERATURES</h1>
            <table>
                <thead>
                    <tr>
                        <th>Date et Heure</th>
                        {devices.map((device, index) => (
                            <th key={index}>
                                <tr onClick={() => openModal('deleteConfirmation', index)}>{device.name}</tr>
                            </th>
                        ))}
                        <th>Enregistré par</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry, index) => (
                        <tr key={index}>
                            <td>{entry.date}</td>
                            {devices.map(device => (
                                <td key={device.name}>
                                    {entry.temps[device.name]}
                                </td>
                            ))}
                            <td>{entry.recordedBy}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => openModal('entry')}>Ajouter un relevé de température</button>
            <button onClick={() => openModal('device')}>Ajouter un appareil</button>

            <Modal
                size="lg"
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalContent>
                    {modalContent === 'entry' && (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Ajouter un relevé de température</ModalHeader>
                            <ModalBody>
                                <form onSubmit={handleSubmit}>
                                    {devices.map(device => (
                                        <div key={device.name}>
                                            <label>
                                                {device.name}:
                                                <Input
                                                    type="text"
                                                    value={newEntry.temps[device.name]}
                                                    onChange={(e) => handleInputChange(device.name, e.target.value)}
                                                />
                                            </label>
                                        </div>
                                    ))}
                                    <div>
                                    </div>
                                    <ModalFooter>
                                        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Annuler
                                        </Button>
                                        <Button color="primary" type="submit">
                                            Enregistrer
                                        </Button>
                                    </ModalFooter>
                                </form>
                            </ModalBody>
                        </>
                    )}

                    {modalContent === 'device' && (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Ajouter un appareil</ModalHeader>
                            <ModalBody>
                                <RadioGroup value={newDeviceType} onValueChange={setNewDeviceType}>
                                    <Radio value="Frigo">Frigo</Radio>
                                    <Radio value="Congélateur">Congélateur</Radio>
                                </RadioGroup>
                            </ModalBody>

                            <ModalFooter>
                                {deviceErrorMessage && <p style={{ color: 'red' }}>{deviceErrorMessage}</p>}
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Annuler
                                </Button>
                                <Button color="primary" onPress={addDevice}>
                                    Ajouter
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                    {modalContent === 'deleteConfirmation' && (
                        <>
                            <ModalHeader>Confirmation de suppression</ModalHeader>
                            <ModalBody>
                                <p>Voulez-vous supprimer {devices[selectedDeviceIndex]?.name}?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Annuler
                                </Button>
                                <Button color="primary" onPress={confirmDeleteDevice}>
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
