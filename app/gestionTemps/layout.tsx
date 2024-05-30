export default function gestionTempsLayout({

    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="">
        <div className="">
          {children}
        </div>
      </section>
    );
  }