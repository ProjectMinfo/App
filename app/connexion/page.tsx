'use client';
import React, { useState } from 'react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    mdp: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    mdp: '',
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email: string) => {
    if (!email.includes('@')) {
      return "L'email doit contenir un '@'.";
    }
    if (!email.endsWith('@junia.com')) {
      return "L'email doit se terminer par 'junia.com'.";
    }
    return '';
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);

    if (emailError) {
      setErrors({
        email: emailError,
        mdp: ''
      });
      return;
    }

    // Réinitialiser les erreurs
    setErrors({
      email: '',
      mdp: ''
    });

    // Ici vous pouvez ajouter la logique pour envoyer les données à l'API
    console.log('Form data submitted:', formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              name="mdp"
              value={formData.mdp}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
