'use client';
import { CheckAccess } from "@/components/CheckAccess";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  CheckAccess(2);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        {children}
      </div>
    </section>
  );
}
