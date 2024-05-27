import React from "react";

type BigCardProps = {
    title: string;
    description: string;
    onClick?: () => void;
};

export const BigCard: React.FC<BigCardProps> = ({ title, description, onClick }) => {
    return (
        <div className="rounded shadow-lg mx-auto border border-palette-lighter mt-8" onClick={onClick}>
            <div className="relative">
                <div className="font-primary text-palette-primary text-2xl pt-4 px-4 font-semibold">
                    {title}
                </div>
                <div className="text-lg text-gray-600 p-4 font-primary font-light">
                    {description}
                </div>
            </div>
        </div>
    );
}