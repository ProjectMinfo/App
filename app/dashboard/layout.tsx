export default function dashBoardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="w-full max-w-6xl px-4">
                {children}
            </div>
        </section>
    );
}
