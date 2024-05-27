'use client';
import { Card, Button } from '@nextui-org/react';

interface Menu {
    commentaire: string;
    dispo: boolean;
    id: number;
    nom: string;
    prix: number;
    prixServeur: number;
    quantiteBoisson: number;
    quantitePlat: number;
    quantiteSnack: number;
}

interface ModifyCardProps {
    menu: Menu;
}

export default function ModifyCard({ menu }: ModifyCardProps) {
    return (
        <Card className="p-4 relative">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold">{menu.nom}</p>
                    <div className="flex gap-2">
                        <Button>
                            Modifier
                        </Button>
                        <Button color="danger">
                            Supprimer
                        </Button>
                    </div>
                </div>
                <div className=" p-4 rounded-md">
                    <p className="text-gray-700"><strong>Disponibilité:</strong> {menu.dispo ? 'Oui' : 'Non'}</p>
                    <p className="text-gray-700"><strong>Prix:</strong> {menu.prix} €</p>
                    <p className="text-gray-700"><strong>Prix Serveur:</strong> {menu.prixServeur} €</p>
                    <p className="text-gray-700"><strong>Quantité Boisson:</strong> {menu.quantiteBoisson}</p>
                    <p className="text-gray-700"><strong>Quantité Plat:</strong> {menu.quantitePlat}</p>
                    <p className="text-gray-700"><strong>Quantité Snack:</strong> {menu.quantiteSnack}</p>
                    <p className="text-gray-700"><strong>Commentaire:</strong> {menu.commentaire}</p>
                </div>
            </div>
        </Card>
    );
};
