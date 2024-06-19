'use client';
import { CheckAccess } from "@/components/CheckAccess";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  CheckAccess(1);

  return (
    <section className="flex flex-col">
      <div className="inline-block text-center">
        {children}
      </div>
    </section>
  );
}
