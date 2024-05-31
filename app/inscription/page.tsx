'use client';
import React, { useState } from 'react';
import { postCreateCompte, sendVerificationEmail } from '@/config/api';

const InscriptionPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mdp: '',
    confirmMdp: '',
    ecole: '',
    promo: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    mdp: '',
    confirmMdp: ''
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email: string) => {
    if (!email.includes('@')) {
      return "L'email doit contenir un '@'.";
    }
    if (!email.endsWith('junia.com')) {
      return "L'email doit se terminer par 'junia.com'.";
    }
    return '';
  };

  const validatePassword = (password: string) => {
    const minLength = /.{8,}/;
    const upperCase = /[A-Z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) {
      return 'Le mot de passe doit contenir au moins 8 caractères.';
    }
    if (!upperCase.test(password)) {
      return 'Le mot de passe doit contenir au moins une majuscule.';
    }
    if (!number.test(password)) {
      return 'Le mot de passe doit contenir au moins un chiffre.';
    }
    if (!specialChar.test(password)) {
      return 'Le mot de passe doit contenir au moins un caractère spécial.';
    }
    return '';
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.mdp);

    if (emailError || passwordError || formData.mdp !== formData.confirmMdp) {
      setErrors({
        email: emailError,
        mdp: passwordError,
        confirmMdp: formData.mdp !== formData.confirmMdp ? 'Les mots de passe ne correspondent pas.' : ''
      });
      return;
    }

    // Réinitialiser les erreurs
    setErrors({
      email: '',
      mdp: '',
      confirmMdp: ''
    });

    try {
      // Appeler l'API pour créer le compte
      await postCreateCompte(formData);

      // Envoyer un e-mail de vérification
      await sendVerificationEmail(formData.email);

      setSuccessMessage('Inscription réussie ! Un e-mail de vérification a été envoyé.');
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
    }
  };

  const calculatePromotions = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentPromo = (currentMonth >= 6 ? currentYear : currentYear - 1) - 1956;
    return Array.from({ length: 5 }, (_, i) => currentPromo - 2 + i).concat(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Inscription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
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
            {errors.mdp && <p className="text-red-500 text-sm mt-1">{errors.mdp}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmMdp"
              value={formData.confirmMdp}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            />
            {errors.confirmMdp && <p className="text-red-500 text-sm mt-1">{errors.confirmMdp}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">École</label>
            <select
              name="ecole"
              value={formData.ecole}
              onChange={handleChange}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="">Sélectionner une école</option>
              <option value="HEI">HEI</option>
              <option value="ISA">ISA</option>
              <option value="ISEN">ISEN</option>
            </select>
          </div>
          {formData.ecole === 'ISEN' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Promo (0 si vous êtes membre de l'équipe pédagogique)</label>
              <select
                name="promo"
                value={formData.promo}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="">Sélectionner une promo</option>
                {calculatePromotions().map(promo => (
                  <option key={promo} value={promo}>{promo}</option>
                ))}
              </select>
            </div>
          )}
          {formData.ecole !== 'ISEN' && formData.ecole && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Promo</label>
              <input
                type="text"
                name="promo"
                value={formData.promo}
                onChange={handleChange}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
          )}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600"
            >
              S'inscrire
            </button>
          </div>
          {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default InscriptionPage;
