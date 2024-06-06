'use client';
import { getCommande, getComptes } from "@/config/api";
import { NewCommandes } from "@/types";
import { Modal, ModalBody, ModalHeader, Table, TableHeader, TableRow, TableCell, TableBody, TableColumn, ModalContent, Input, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";

interface ListeCommandeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type NamedCommande = NewCommandes & { nom: string };

export default function ListeCommandeModal({ isOpen, onClose }: ListeCommandeModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCommandes, setFilteredCommandes] = useState<NamedCommande[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const onEditClose = () => {
        setIsModalOpen(false);
    };

    const [commandes, setCommandes] = useState<NamedCommande[]>([]);


    useEffect(() => {
        const fetchCommandes = async () => {
            try {
                const fetchedCommandes = await getCommande();
                const fetchedCompte = await getComptes();

                const resultCommandes: NamedCommande[] = fetchedCommandes
                    .filter((commande: NamedCommande) => commande.payee && commande.contenu)
                    .map((commande: NamedCommande) => ({
                        ...commande,
                        nom: fetchedCompte.find((client: { numCompte: number; }) => client.numCompte === commande.numCompte)?.nom || "Inconnu",
                    }));

                setCommandes(resultCommandes);
            } catch (error) {
                console.error("Erreur lors de la récupération des commandes ou des commandes :", error);
            }
        };

        fetchCommandes();
    }, []);



    useEffect(() => {
        const query = searchQuery.toLowerCase();
        if (query.length < 2) {
            setFilteredCommandes([]);
            return;
        }
        setFilteredCommandes(
            commandes.filter(
                (commande) =>
                    commande.nom.toLowerCase().includes(query) &&
                    commande.date.$date == new Date().toISOString().split('T')[0]
            )
        );
    }, [searchQuery, commandes]);


    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
                <ModalContent>
                    <ModalHeader>Liste des commandes</ModalHeader>
                    <ModalBody>
                        <Input
                            placeholder="Rechercher une commande (Nom, Prénom ou Numéro de commande)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </ModalBody>
                    <ModalBody>
                        <Table aria-label="Liste des commandes">
                            <TableHeader>
                                <TableColumn>Nom</TableColumn>
                                <TableColumn>Numéro du compte</TableColumn>
                                <TableColumn>Contenu</TableColumn>
                                <TableColumn>Commentaires</TableColumn>
                                <TableColumn>Prix</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {filteredCommandes.map(commande => (
                                    <TableRow key={commande.id}>
                                        <TableCell>{commande.nom}</TableCell>
                                        <TableCell>{commande.numCompte}</TableCell>
                                        <TableCell>{commande.contenu}</TableCell>
                                        <TableCell>{commande.commentaire}</TableCell>
                                        <TableCell>{commande.prix}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
