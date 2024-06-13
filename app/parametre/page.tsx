'use client';
import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';  // Importer le composant FileUpload

const Settings = () => {
  const [eventMode, setEventMode] = useState(false);
  const [orderTaking, setOrderTaking] = useState(false);
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('20:00');

  const handleEventModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventMode(event.target.value === 'enabled');
  };

  const handleOrderTakingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderTaking(event.target.value === 'enabled');
  };

  const handleOpeningTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpeningTime(event.target.value);
  };

  const handleClosingTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClosingTime(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Event Mode:', eventMode);
    console.log('Order Taking:', orderTaking);
    console.log('Opening Time:', openingTime);
    console.log('Closing Time:', closingTime);
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
                type="radio"
                name="eventMode"
                value="enabled"
                checked={eventMode === true}
                onChange={handleEventModeChange}
                className="form-radio"
              />
              <span>Activer</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-700">
              <input
                type="radio"
                name="eventMode"
                value="disabled"
                checked={eventMode === false}
                onChange={handleEventModeChange}
                className="form-radio"
              />
              <span>Désactiver</span>
            </label>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 text-gray-800">Prise de Commande</h3>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 text-gray-700">
              <input
                type="radio"
                name="orderTaking"
                value="enabled"
                checked={orderTaking === true}
                onChange={handleOrderTakingChange}
                className="form-radio"
              />
              <span>Activer</span>
            </label>
            <label className="flex items-center space-x-2 text-gray-700">
              <input
                type="radio"
                name="orderTaking"
                value="disabled"
                checked={orderTaking === false}
                onChange={handleOrderTakingChange}
                className="form-radio"
              />
              <span>Désactiver</span>
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
