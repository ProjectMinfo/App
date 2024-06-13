'use client';
import { getCommande, getComptes, postCommande } from "@/config/api";
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

    const toDate = (dateNumber: number) => {
        const date = new Date(Number(dateNumber));
        const jour = ('0' + date.getDate()).slice(-2); // Obtient le jour avec un zéro initial si nécessaire
        const mois = ('0' + (date.getMonth() + 1)).slice(-2); // Obtient le mois avec un zéro initial si nécessaire
        const annee = date.getFullYear(); // Obtient l'année
        return `${annee}-${mois}-${jour}`;
    };


    useEffect(() => {
        const fetchCommandes = async () => {
            try {
                const fetchedCommandes = await getCommande();
                const fetchedCompte = await getComptes();

                // console.log(fetchedCommandes[fetchedCommandes.length - 1]);


                const resultCommandes: NamedCommande[] = fetchedCommandes
                    .filter((commande: NamedCommande) => commande.contenu)
                    .map((commande: NamedCommande) => ({
                        ...commande,
                        nom: fetchedCompte.find((client: { numCompte: number; }) => client.numCompte === commande.numCompte)?.nom || "Inconnu",
                    }));

                // console.log(resultCommandes[resultCommandes.length - 1]);

                setCommandes(resultCommandes);
            } catch (error) {
                console.error("Erreur lors de la récupération des commandes ou des commandes :", error);
            }
        };

        fetchCommandes();
    }, []);



    useEffect(() => {
        if (commandes.length > 0) {

            const query = searchQuery.toLowerCase();
            setFilteredCommandes(
                commandes.filter(
                    (commande) => {
                        if (commande.nom.toLowerCase().includes(query) &&
                            toDate(commande.date.$date.$numberLong) == new Date().toISOString().split('T')[0] &&
                            commande.distribuee == false
                        ) { return commande; }
                    }
                )
            );
        }
    }, [searchQuery, commandes]);


    function handleCommandePayee(commande: NamedCommande) {        
        const newCommande = { ...commande, payee: true };
        const sendCommande = { ...newCommande };
        delete sendCommande.nom;
        postCommande(sendCommande);        

        setCommandes(commandes.map((c) => c.id === commande.id ? newCommande : c));
    }

    function handleCommandeDistribuee(commande: NamedCommande) {
        const newCommande = { ...commande, distribuee: true };
        const sendCommande = { ...newCommande};
        delete sendCommande.nom;    
        postCommande(sendCommande);

        setCommandes(commandes.map((c) => c.id === commande.id ? newCommande : c));
    }


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
                                <TableColumn className="text-center">Actions</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {filteredCommandes.slice(0, 100).map(commande => (
                                    <TableRow key={commande.id}>
                                        <TableCell>{commande.nom}</TableCell>
                                        <TableCell>{commande.numCompte}</TableCell>
                                        <TableCell>{commande.contenu}</TableCell>
                                        <TableCell>{commande.commentaire}</TableCell>
                                        <TableCell>{commande.prix}</TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button color="success" variant="flat" isDisabled={commande.payee} onClick={() => handleCommandePayee(commande)}>
                                                Payée
                                            </Button>
                                            <Button color="primary" variant="flat" onClick={() => handleCommandeDistribuee(commande)}>
                                                Distribuée
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredCommandes.length > 10 && (
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell className="text-center">...</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
