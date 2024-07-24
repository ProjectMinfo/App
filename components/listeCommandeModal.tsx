'use client';
import { deleteCommande, getBoissons, getCommande, getComptes, getSnacks, postCommande } from "@/config/api";
import { NewCommandes } from "@/types";
import { Modal, ModalBody, ModalHeader, Table, TableHeader, TableRow, TableCell, TableBody, TableColumn, ModalContent, Input, Button, Card, CardHeader, CardBody, Divider, ModalFooter } from "@nextui-org/react";
import { useState, useEffect } from "react";
import TypePaiementModal from "./TypePaiementModal";

interface ListeCommandeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type NamedCommande = NewCommandes & { nom: string };

export default function ListeCommandeModal({ isOpen, onClose }: ListeCommandeModalProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCommandes, setFilteredCommandes] = useState<NamedCommande[]>([]);

    const [isModalPayeeOpen, setIsModalPayeeOpen] = useState(false);
    const [isModalPeriphOpen, setIsModalPeriphOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

    const [commandeBoisson, setCommandeBoisson] = useState<any>();
    const [commandeSnack, setCommandeSnack] = useState<any>();

    const [commandes, setCommandes] = useState<NamedCommande[]>([]);
    const [currentCommande, setCurrentCommande] = useState<NamedCommande | null>(null);

    const [oldCommandes, setOldCommandes] = useState<boolean>(false);

    const [typePaiement, setTypePaiement] = useState<number>(0);
    // 0 = Compte | 1 = CB | 2 = Espèce

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
                    // .filter((commande: NamedCommande) => commande.contenu)
                    .map((commande: NamedCommande) => ({
                        ...commande,
                        nom: fetchedCompte.find((client: { numCompte: number; }) => client.numCompte === commande.numCompte)?.nom || commande.commentaire.split("::")[0] || "Inconnu",
                        commentaire: commande.commentaire,
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
            if (oldCommandes) {
                return setFilteredCommandes(commandes.sort((a, b) => b.date.$date.$numberLong - a.date.$date.$numberLong));
            }
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
    }, [searchQuery, commandes, oldCommandes]);


    function handlePeripheriques(commande: NamedCommande) {
        const fetchPeripheriques = async () => {
            try {
                const fetchedBoissons = await getBoissons();
                const fetchedSnacks = await getSnacks();

                const resultBoissons = commande.boissons.map((boisson) => ({
                    nom: fetchedBoissons.find((b) => b.id === boisson[0])?.nom || "Inconnu",
                    quantite: boisson[1],
                }));
                // console.log(resultBoissons);
                setCommandeBoisson(resultBoissons);

                const resultSnacks = commande.snacks.map((snack) => ({
                    nom: fetchedSnacks.find((s) => s.id === snack[0])?.nom || "Inconnu",
                    quantite: snack[1],
                }));
                // console.log(resultSnacks);
                setCommandeSnack(resultSnacks);

            } catch (error) {
                console.error("Erreur lors de la récupération des boissons ou des snacks :", error);
            }
        }

        fetchPeripheriques();
    }


    function chooseTypePaiement() {
        setIsModalPayeeOpen(true);
    }

    useEffect(() => {
        if (typePaiement) {
            handleCommandePayee(currentCommande, typePaiement);
        }
    }, [typePaiement]);




    function handleCommandePayee(commande: NamedCommande, typePaiement: number) {
        const newCommande = { ...commande };
        const sendCommande = { ...newCommande, payee: true, typePaiement : typePaiement};
        // console.log(sendCommande);
        
        postCommande(sendCommande);

        setCommandes(commandes.map((c) => c.id === sendCommande.id ? sendCommande : c));
    }

    function handleCommandeDistribuee(commande: NamedCommande) {
        const newCommande = { ...commande};
        const sendCommande = { ...newCommande, distribuee: true };
        postCommande(sendCommande);

        setCommandes(commandes.map((c) => c.id === sendCommande.id ? sendCommande : c));
    }

    function handlePeriphDonne() {
        const newCommande = { ...currentCommande};
        const sendCommande = { ...newCommande, periphDonne: true };
        postCommande(sendCommande);

        setCommandes(commandes.map((c) => c.id === sendCommande.id ? sendCommande : c));
    }

    function handleDeleteCommande() {
        setIsModalDeleteOpen(false);
        const commande = currentCommande;
        const sendCommande = { ...commande };
        
        deleteCommande(sendCommande.id);

        setCommandes(commandes.filter((c) => c.id !== commande.id));
    }

    function modalPeriph(commande: NamedCommande) {
        handlePeripheriques(commande);
        setCurrentCommande(commande);
        setIsModalPeriphOpen(true);
    }

    function validatePeriph() {
        handlePeriphDonne();
        setIsModalPeriphOpen(false);
    }

    function validateDeleteCommande(commande : NamedCommande) {
        setCurrentCommande(commande);
        setIsModalDeleteOpen(true);
    }


    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl">
                <ModalContent>
                    <ModalHeader className="flex items-center gap-5">
                        <div>Commande en cours</div>
                        <Button variant="flat" onClick={() => setOldCommandes(!oldCommandes)}>Anciennes commandes</Button>
                    </ModalHeader>
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
                                <TableColumn>Num compte</TableColumn>
                                <TableColumn>Contenu</TableColumn>
                                <TableColumn>Commentaires</TableColumn>
                                <TableColumn>Prix</TableColumn>
                                <TableColumn className="text-center">Actions</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {filteredCommandes.slice(0, 10).map(commande => (
                                    <TableRow key={commande.id}>
                                        <TableCell>{commande.nom}</TableCell>
                                        <TableCell>{commande.numCompte == -1 ? "/" : commande.numCompte}</TableCell>
                                        <TableCell>{commande.contenu}</TableCell>
                                        <TableCell>{commande.commentaire}</TableCell>
                                        <TableCell>{commande.prix}€</TableCell>
                                        <TableCell className="flex gap-2">
                                            <Button color="warning" variant="flat" onClick={() => modalPeriph(commande)}>
                                                Périph
                                            </Button>
                                            <Button color="success" variant="flat" isDisabled={commande.payee} onClick={() => {chooseTypePaiement();setCurrentCommande(commande);}}>
                                                Payée
                                            </Button>
                                            <Button color="primary" variant="flat" onClick={() => handleCommandeDistribuee(commande)} isDisabled={!commande.payee}>
                                                Distribuée
                                            </Button>
                                            <Button color="danger" variant="flat" onClick={() => validateDeleteCommande(commande)} isDisabled={commande.distribuee}>
                                                Annuler
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredCommandes.length > 10 && (
                                    <TableRow>
                                        <TableCell> </TableCell>
                                        <TableCell> </TableCell>
                                        <TableCell className="text-center">...</TableCell>
                                        <TableCell> </TableCell>
                                        <TableCell> </TableCell>
                                        <TableCell> </TableCell>
                                    </TableRow>
                                )}
                                {filteredCommandes.length === 0 && (
                                    <TableRow>
                                        <TableCell> </TableCell>
                                        <TableCell> </TableCell>
                                        <TableCell className="text-center">Aucune commande actuellement !</TableCell>
                                        <TableCell> </TableCell>
                                        <TableCell> </TableCell>
                                        <TableCell> </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {isModalPeriphOpen && (
                <Modal isOpen={isModalPeriphOpen} onClose={() => setIsModalPeriphOpen(false)} className="max-w-2xl">
                    <ModalContent>
                        <ModalHeader>
                            Périphériques {currentCommande.periphDonne ? (<span className="text-danger">(Déjà donnés !)</span>) : ""}
                        </ModalHeader>
                        <ModalBody>
                            <Card>
                                <CardHeader className="text-lg font-semibold">Boissons</CardHeader>
                                <Divider />
                                <CardBody>
                                    {commandeBoisson?.map((boisson, index) => (
                                        <span key={index}>
                                            {boisson.nom} ({boisson.quantite})
                                            {index < commandeBoisson.length - 1 && ", "}
                                        </span>
                                    ))}
                                </CardBody>
                            </Card>
                            <Card>
                                <CardHeader className="text-lg font-semibold">Snacks</CardHeader>
                                <Divider />
                                <CardBody>
                                    {commandeSnack?.map((snack, index) => (
                                        <span key={index}>
                                            {snack.nom} ({snack.quantite})
                                            {index < commandeSnack.length - 1 && ", "}
                                        </span>
                                    ))}
                                </CardBody>
                            </Card>
                        </ModalBody>
                        <ModalFooter>
                            {currentCommande?.periphDonne ? (null) : (
                                <Button color="warning" variant="flat" onClick={() => validatePeriph()}>Périphs donnés</Button>
                            )}
                            <Button onClick={() => setIsModalPeriphOpen(false)}>Fermer</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}

            <Modal isOpen={isModalDeleteOpen} isDismissable={false} isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Vous êtes sûr de vouloir supprimer ?</ModalHeader>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={() => setIsModalDeleteOpen(false)}>
                                    Non
                                </Button>
                                <Button color="danger" onPress={() => handleDeleteCommande()}>
                                    Oui
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <TypePaiementModal isOpen={isModalPayeeOpen} onClose={(typePaiement) => {
                setTypePaiement(typePaiement);
                setIsModalPayeeOpen(false);
            }} />
        </>
    );
}
