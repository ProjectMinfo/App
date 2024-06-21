'use client'
import React, { useEffect, useState } from 'react';
import { deleteEvent, getAllEvent, getEventImage, postEvent } from '@/config/api';
import FileUploadEvent from '@/components/FileUploadEvent';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@nextui-org/react";
import { DeleteIcon } from "@/public/DeleteIcon";
import { EditIcon } from "@/public/EditIcon";
import axios from 'axios';

export default function Home() {
  const [eventAll, setEventAll] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageEvents, setImageEvents] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen: isAddModalOpen, onOpen: openAddModal, onClose: closeAddModal } = useDisclosure();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [editEvent, setEditEvent] = useState(null);
  const { isOpen: isEditModalOpen, onOpen: openEditModal, onClose: closeEditModal } = useDisclosure();
  const [editEventImageURL, setEditEventImageURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  let user = null;
  let userAccess = null;
  if (typeof window !== 'undefined') {
    user = window.localStorage.getItem("user");
    if (user !== null) {
      user = JSON.parse(user);
      userAccess = user.acces;

      window.localStorage.setItem("userAccess", userAccess);
    }
  }

  useEffect(() => {
    async function fetchEvent() {
      try {
        const fetchedEvent = await getAllEvent('Event');
        setEventAll(fetchedEvent);
        setIsLoading(false);

        for (const event of fetchedEvent) {
          fetchImage(event.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    }

    async function fetchColor() {
      try {
        const color = await fetch("https://minfoapi.fly.dev/settings/str/Color").then((res) => res.text());
        if (typeof window !== 'undefined') {
          window.localStorage.setItem("color", color.toLowerCase());
        }
      } catch (error) {
        console.error('Error fetching color:', error);
      }
    }

    fetchColor();
    fetchEvent();
  }, []);

  async function fetchImage(id) {
    try {
      const fetchedImage = await getEventImage(id);
      setImageEvents((prevImages) => ({
        ...prevImages,
        [id]: fetchedImage,
      }));
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }

  function handleCardClick(event) {
    setSelectedEvent(event);
    setEditEvent({
      id: event.id,
      titre: event.titre,
      description: event.description,
    });
    setEditEventImageURL(imageEvents[event.id]);
    setIsModalOpen(true);
  }

  const handleAddModalOpen = () => {
    openAddModal();
  };

  function closeModal() {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setEditEvent(null);
    setEditEventImageURL("");
    setErrorMessage(""); // Réinitialiser le message d'erreur lors de la fermeture du modal
  }


  const handleFileUpload = (file) => {
    if (file) {
      setUploadedFiles([file]);
    } else {
      setUploadedFiles([]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (eventName && eventDescription && uploadedFiles[0]) {
        await postEvent(eventName, eventDescription, uploadedFiles[0]);
        const updatedEvents = await getAllEvent('Event');
        setEventAll(updatedEvents);
        closeAddModal();
        setErrorMessage(""); // Réinitialise le message d'erreur après un ajout réussi
      } else {
        setErrorMessage("Tous les champs sont requis."); // Définir le message d'erreur pour les champs manquants
      }
    } catch (error) {
      console.error("Error posting event:", error);
      setErrorMessage("Erreur lors de l'ajout de l'événement. Veuillez réessayer."); // Définir le message d'erreur pour une erreur de post
    }
  };

  const handleEdit = () => {
    setErrorMessage(""); // Réinitialise le message d'erreur
    openEditModal();
  };

  const handleEditSubmit = async () => {
    try {


      if (uploadedFiles[0] === undefined) {

        const response = await axios.get(`https://minfoapi.fly.dev/settings/event-image/${editEvent.id}`, {
          responseType: "blob",
          maxBodyLength: Infinity,
        });
        const blob = new Blob([response.data], { type: "image/png" });
        const file = new File([blob], "temp", { type: blob.type });

        uploadedFiles[0] = file;
      }


      await postEvent(editEvent.titre, editEvent.description, uploadedFiles[0], editEvent.id);
      const updatedEvents = await getAllEvent('Event');
      setEventAll(updatedEvents);
      closeEditModal();
      closeModal();
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      console.error("Error updating event:", error);
      setErrorMessage("Erreur lors de la mise à jour de l'événement.");
    }
  };


  const handleDelete = async () => {
    if (selectedEvent && selectedEvent.id) {
      try {
        await deleteEvent(selectedEvent.id);
        setEventAll((prevEvents) => prevEvents.filter(event => event.id !== selectedEvent.id));
        closeModal();
      } catch (error) {
        console.error("Error deleting event:", error);
        setErrorMessage("Erreur lors de la suppression de l'événement. Veuillez réessayer."); // Définir le message d'erreur
      }
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mb-8 w-full">Prochains Evénements</h1>
      <div className="grid grid-cols-1 gap-4 mt-12 md:grid-cols-2">
        {eventAll.map((event) => (
          <Card
            key={event.id}
            isPressable
            onPress={() => handleCardClick(event)}
          >
            <CardHeader className="justify-center">
              <p className="text-lg">{event.titre.toUpperCase()}</p>
            </CardHeader>
            <CardBody>
              {imageEvents[event.id] ? (
                <img src={imageEvents[event.id]} alt={event.titre} className="w-full h-auto" />
              ) : (
                <div>Chargement de l'image...</div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {userAccess === 2 && (
        <div className="flex justify-center mt-4">
          <Button className="bg-green-500 py-2 px-4 rounded w-full md:w-auto" onPress={handleAddModalOpen}>
            Ajouter un évènement
          </Button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {selectedEvent && selectedEvent.titre.toUpperCase()}
              </ModalHeader>
              <ModalBody>
                {selectedEvent && imageEvents[selectedEvent.id] && (
                  <img src={imageEvents[selectedEvent.id]} alt={selectedEvent.titre}
                    className="w-full h-auto" />
                )}
                {selectedEvent && selectedEvent.description}
              </ModalBody>
              {userAccess === 2 &&
                (
                  <ModalFooter>
                    <Button className="bg-blue-500 py-2 px-4 rounded mr-2" onPress={handleEdit}>
                      <EditIcon className="w-5 h-5 mr-1" /> Éditer
                    </Button>
                    <Button className="bg-danger py-2 px-4 rounded" onPress={handleDelete}>
                      <DeleteIcon className="w-5 h-5 mr-1" /> Supprimer
                    </Button>
                  </ModalFooter>
                )
              }
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ajouter un évènement</ModalHeader>
              <ModalBody>
                <Input
                  label="Nom de l'évènement"
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
                <Input
                  label="Description"
                  type="text"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                />
                <FileUploadEvent onFileUpload={handleFileUpload} imageURL={undefined} />
                {errorMessage && (
                  <div className="text-left text-red-500 mt-2">{errorMessage}</div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button className="bg-blue-500 py-2 px-4 rounded"
                  onPress={handleSubmit}>Ajouter</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Éditer un évènement
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Nom de l'évènement"
                  type="text"
                  value={editEvent ? editEvent.titre : ''}
                  onChange={(e) => setEditEvent({ ...editEvent, titre: e.target.value })}
                />
                <Input
                  label="Description"
                  type="text"
                  value={editEvent ? editEvent.description : ''}
                  onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                />
                <FileUploadEvent onFileUpload={handleFileUpload} imageURL={editEventImageURL} />
                {errorMessage && (
                  <div className="text-left text-red-500 mt-2">{errorMessage}</div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button className="bg-blue-500 py-2 px-4 rounded mr-2" onPress={handleEditSubmit}>
                  <EditIcon className="w-5 h-5 mr-1" /> Modifier
                </Button>
                <Button className="bg-red-500 py-2 px-4 rounded" onPress={closeEditModal}>
                  Annuler
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
