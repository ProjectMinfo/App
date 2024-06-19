'use client';
import { CheckAccess } from "@/components/CheckAccess";

export default function AffichageCuisineLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  CheckAccess(1);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block text-center justify-center w-[100%]">
        {children}
      </div>
    </section>
  );
}
