'use client';
import React, {useEffect, useState} from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {getCarte} from "@/config/api";

const Carte = () => {
    const [carte1, setCarte1] = useState<string>("");
    const [carte2, setCarte2] = useState<string>("");

    useEffect(() => {
        getCarte(1).then((url) => {
            setCarte1(url);
        }).catch(error => console.error('Erreur de récupération de la carte 1:', error));

        getCarte(2).then((url) => {
            setCarte2(url);
        }).catch(error => console.error('Erreur de récupération de la carte 2:', error));
    }, []);

    return (
        <div className="container mx-auto py-8 min-h-screen flex flex-col items-center">
            <h1 className="text-3xl font-semibold text-center mb-8">Menu</h1>
            <div className="flex-1 flex flex-col items-center w-full">
                {carte1 ? (
                    <img src={carte1} alt="Carte 1" className="w-full h-auto object-cover"/>
                ) : (
                    <p>Chargement de la carte...</p>
                )}
                {carte2 ? (
                    <img src={carte2} alt="Carte 2" className="w-full h-auto object-cover mt-4"/>
                ) : (
                    <p>Chargement de la carte...</p>
                )}
            </div>
        </div>
    );
};

export default Carte;