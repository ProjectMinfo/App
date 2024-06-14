// components/OrderRedirect.tsx

import React from 'react';
import { Button } from "@nextui-org/button";
import { useRouter } from 'next/navigation';  // Utilisez next/navigation au lieu de next/router

const OrderRedirect = () => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push('/compte');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-4">Les commandes ne sont pas ouvertes pour le moment.</h1>
      <p className="text-lg mb-8">Veuillez revenir pendant les heures d'ouverture des commandes.</p>
      <Button onClick={handleRedirect} className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
        En attendant, vous pouvez recharger votre code ici
      </Button>
    </div>
  );
};

export default OrderRedirect;
