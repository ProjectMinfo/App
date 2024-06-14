// layouts/ChatLayout.tsx

'use client';
import React, { useEffect, useState } from 'react';
import { getSettingById } from "@/config/api";
import OrderRedirect from '@/components/CommandeRedirect';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOrderActive, setIsOrderActive] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        const data = await getSettingById(1);
        setIsOrderActive(data.value === 1);
      } catch (error) {
        console.error('Error fetching order status:', error);
        setIsOrderActive(false);
      }
    };
    fetchOrderStatus();
  }, []);

  if (isOrderActive === null) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col">
      <div className="inline-block text-center">
        {isOrderActive ? children : <OrderRedirect />}
      </div>
    </section>
  );
}
