'use client';
import React, { useEffect, useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { getEventMode, postEventMode, postOrderStatus, getSettingById, getOrderHours, postOrderHours, postColor, postName } from "@/config/api"; // Importer les fonctions API
import { Button, Card, CardBody, CardHeader, Divider, Input, Switch } from '@nextui-org/react';
import FileUploadLogo from '@/components/FileUploadLogo';

const Settings = () => {
  const [eventMode, setEventMode] = useState(false);
  const [orderTaking, setOrderTaking] = useState(false);
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('20:00');

  const [colorSelected, setColorSelected] = useState('#cc2a24');
  const [nameSelected, setNameSelected] = useState("Chti'Mi");



  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const eventModeData = await getEventMode();
        setEventMode(eventModeData);

        const orderTakingData = await getSettingById(1);
        setOrderTaking(orderTakingData.value === 1);

        const orderHoursData = await getOrderHours();
        setOpeningTime(orderHoursData.heureDebutCommandes);
        setClosingTime(orderHoursData.heureFinCommandes);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    async function fetchCustoms() {
      fetch("https://minfoapi.fly.dev/settings/str/Nom")
      .then((res) => res.text())
      .then((nom) => setNameSelected(nom))
      .catch((error) => console.error(error));

    fetch("https://minfoapi.fly.dev/settings/str/Couleur")
      .then((res) => res.text())
      .then((color) => setColorSelected(color))
      .catch((error) => console.error(error));

    }

    fetchCustoms();
    fetchSettings();
  }, []);

  const handleEventModeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setEventMode(newValue);
    try {
      await postEventMode(newValue);
    } catch (error) {
      console.error('Error updating event mode:', error);
    }
  };

  const handleOrderTakingChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setOrderTaking(newValue);
    try {
      await postLimitOrdeconvertToDaterTaking(newValue);
      updateOrderStatus(newValue);
    } catch (error) {
      console.error('Error updating limit order taking:', error);
    }
  };

  const handleOpeningTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setOpeningTime(newTime);
    updateOrderStatus(orderTaking, newTime, closingTime);
  };

  const handleClosingTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setClosingTime(newTime);
    updateOrderStatus(orderTaking, openingTime, newTime);
  };

  const updateOrderStatus = async (orderTaking: boolean, opening: string = openingTime, closing: string = closingTime) => {
    const currentTime = new Date();
    const openingDate = new Date();
    const closingDate = new Date();

    const [openingHour, openingMinute] = opening.split(':').map(Number);
    openingDate.setHours(openingHour, openingMinute);

    const [closingHour, closingMinute] = closing.split(':').map(Number);
    closingDate.setHours(closingHour, closingMinute);

    const isOrderTimeValid = orderTaking && currentTime >= openingDate && currentTime <= closingDate;
    try {
      await postOrderStatus(isOrderTimeValid);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await postOrderHours(openingTime, closingTime);
    } catch (error) {
      console.error('Error updating order hours:', error);
    }
    try {
      await postColor(colorSelected);
    } catch (error) {
      console.error('Error updating color:', error);
    }
    try {
      await postName(nameSelected);
    } catch (error) {
      console.error('Error updating name:', error);
    }


    console.log('Event Mode:', eventMode);
    console.log('Order Taking:', orderTaking);
    console.log('Opening Time:', openingTime);
    console.log('Closing Time:', closingTime);
    console.log('Color:', colorSelected);
  };

  return (
    <Card className="max-w-3xl mx-auto p-8">
      <h2 className="text-2xl font-semibold mb-6">Paramètres</h2>
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardBody>
            <h3 className="text-lg font-medium mb-2">Mode Événement</h3>
            <div className="flex items-center space-x-4">
              <Switch isSelected={eventMode} onChange={handleEventModeChange} />
            </div>
            <Divider className='mt-6' />
          </CardBody>
          <CardBody>
            <h3 className="text-lg font-medium mb-2">Prise de Commande</h3>
            <div className="flex items-center space-x-4">
              <Switch isSelected={orderTaking} onChange={handleOrderTakingChange} />
            </div>

            {orderTaking && (
              <div className="flex space-x-4 my-2">
                <div>
                  <label className="block">Ouverture</label>
                  <input
                    type="time"
                    value={openingTime}
                    onChange={handleOpeningTimeChange}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block">Fermeture</label>
                  <input
                    type="time"
                    value={closingTime}
                    onChange={handleClosingTimeChange}
                    className="form-input"
                  />
                </div>
              </div>
            )}
          </CardBody>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-medium">Personalisation</h3>
          </CardHeader>
          <CardBody>
          <h4 className="text-lg font-medium mb-2">Nom de l'asso</h4>
            <Input
              type="text"
              value={nameSelected}
              variant="faded"
              size='sm'
              className="w-32"
              onChange={(e) => setNameSelected(e.target.value)}
            />

            <h4 className="text-lg font-medium my-2">Couleur du site</h4>
            <Input
              type="color"
              value={colorSelected}
              variant="faded"
              size='sm'
              className="w-32"
              onChange={(e) => setColorSelected(e.target.value)}
            />

            <h4 className="text-lg font-medium my-2">Logo</h4>
            <FileUploadLogo />
          </CardBody>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg font-medium">Images pour la carte</h3>
          </CardHeader>
          <CardBody>
            <FileUpload />

          </CardBody>
        </Card>

        <Button
          type="submit"
          className="mt-2 px-4 py-2 font-semibold rounded-lg hover:bg-blue-600"
        >
          Enregistrer les paramètres
        </Button>
      </form>
    </Card>
  );
};

export default Settings;
