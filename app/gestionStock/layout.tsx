'use client';
import { CheckAccess } from "@/components/CheckAccess";

export default function gestionStockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  CheckAccess(1);

  return (
    <section className="flex flex-col items-center justify-center py-8 md:py-10">
      <div className="inline-block  text-center justify-center w-full">
        {children}
      </div>
    </section>
  );
}
