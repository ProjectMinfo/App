'use client';
import React, { useEffect, useState, useRef } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { getCarte } from "@/config/api";

const Carte = () => {
    const [cartes, setCartes] = useState<string[]>([]);
    const fetchedRef = useRef(false);

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        const fetchCartes = async () => {
            for (let i = 1; i <= 10; i++) {  
                try {
                    const url = await getCarte(i);
                    setCartes(cartes => {
                        return [...cartes, url];
                    });
                } catch (error) {
                    console.error('Erreur de récupération de la carte:', error);
                }
            }
        };
        fetchCartes();
    }, []);

    return (
        <div className="w-full py-8 min-h-screen flex flex-col items-center">
            <h1 className="text-3xl font-semibold text-center mb-8 w-full">Menu</h1>
            <div className="flex-1 flex flex-col items-center w-full">
                {cartes.map((carte, index) => (
                    <img key={index} src={carte} alt={`Carte ${index + 1}`} className="w-full h-auto object-cover"/>
                ))}
            </div>
        </div>
    );
};

export default Carte;
