export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col">
      <div className="inline-block text-center">
        {children}
      </div>
    </section>
  );
}
