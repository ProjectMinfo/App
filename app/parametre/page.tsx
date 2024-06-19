'use client';
import React, { useEffect, useState } from 'react';
import FileUpload from '@/components/FileUpload';
import { getEventMode, postEventMode, postLimitOrderTaking, postOrderStatus, getSettingById, getOrderHours, postOrderHours } from "@/config/api"; // Importer les fonctions API

const Settings = () => {
  const [eventMode, setEventMode] = useState(false);
  const [orderTaking, setOrderTaking] = useState(false);
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('20:00');

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
    // console.log('Event Mode:', eventMode);
    // console.log('Order Taking:', orderTaking);
    // console.log('Opening Time:', openingTime);
    // console.log('Closing Time:', closingTime);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Paramètres</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-800">Mode Événement</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-gray-700">
              <input
                type="checkbox"
                checked={eventMode}
                onChange={handleEventModeChange}
                className="form-checkbox"
              />
              <span>Activer</span>
            </label>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-800">Prise de Commande</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-gray-700">
              <input
                type="checkbox"
                checked={orderTaking}
                onChange={handleOrderTakingChange}
                className="form-checkbox"
              />
              <span>Activer</span>
            </label>
          </div>
        </div>
        {orderTaking && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-800">Heures de Prise de Commande</h3>
            <div className="flex space-x-4">
              <div>
                <label className="block text-gray-700 mb-2">Ouverture</label>
                <input
                  type="time"
                  value={openingTime}
                  onChange={handleOpeningTimeChange}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Fermeture</label>
                <input
                  type="time"
                  value={closingTime}
                  onChange={handleClosingTimeChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}
        <FileUpload />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Enregistrer les paramètres
        </button>
      </form>
    </div>
  );
};

export default Settings;
