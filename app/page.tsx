'use client';
import React, { useState, useEffect } from 'react';
import { getAllEvent, getEventImage } from '@/config/api';
import FileUpload from '@/components/FileUpload';
import { Card, CardHeader, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent, Button, useDisclosure, Input } from "@nextui-org/react";

export default function Home() {
  const [eventAll, setEventAll] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imageEvents, setImageEvents] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isOpen: isAddModalOpen, onOpen: openAddModal, onClose: closeAddModal } = useDisclosure();

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

        // Fetch images for all events
        for (const event of fetchedEvent) {
          fetchImage(event.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    }

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
    console.log("OK")
    setSelectedEvent(event);
    console.log(selectedEvent)
    setIsModalOpen(true);
  }

  const handleAddModalOpen = () => {
    openAddModal();
  };

  function closeModal() {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }

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

      <Button className="bg-green-500 py-2 px-4 rounded w-full md:w-auto" onPress={handleAddModalOpen}>
        Ajouter un event
      </Button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {selectedEvent && selectedEvent.titre.toUpperCase()}
              </ModalHeader>
              <ModalBody>
                {selectedEvent && imageEvents[selectedEvent.id] && (
                  <img src={imageEvents[selectedEvent.id]} alt={selectedEvent.titre} className="w-full h-auto" />
                )}
                {selectedEvent && selectedEvent.description}
              </ModalBody>
              <ModalFooter>
                <Button className="bg-danger py-2 px-4 rounded" onPress={closeModal}>
                  Fermer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Ajouter un event</ModalHeader>
              <ModalBody>
                <Input
                  label="Nom de l'event"
                  type="text"
                />
                <Input
                  label="Description"
                  type="text"
                />
                <FileUpload
                  label="Uploader une image"
                  onFileUpload={(file) => {
                    // Logique d'upload de fichier
                    console.log(file);
                  }}
                />
              </ModalBody>
              <ModalFooter>
                {/* {errorMessage && (
                  <div className="text-red-500 mb-4">{errorMessage}</div>
                )}
                <Button className="bg-blue-500 py-2 px-4 rounded" onPress={handleSubmit}>Ajouter</Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
