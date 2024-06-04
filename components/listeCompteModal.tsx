import { Modal, ModalBody, ModalHeader, Table, TableHeader, TableRow, TableCell, TableBody } from "@nextui-org/react";

export default function ListeComptes(isOpen: boolean, onClose: () => void) {
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} placement="top-center">
                <ModalHeader>
                    Liste des comptes
                </ModalHeader>
                <ModalBody>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell>Nom</TableCell>
                                <TableCell>Prénom</TableCell>
                                <TableCell>Adresse</TableCell>
                                <TableCell>Ville</TableCell>
                                <TableCell>Code postal</TableCell>
                                <TableCell>Téléphone</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Créé le</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>John</TableCell>
                                <TableCell>Doe</TableCell>
                                <TableCell>1 rue de la paix</TableCell>
                                <TableCell>Paris</TableCell>
                                <TableCell>75000</TableCell>
                                <TableCell>0123456789</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </ModalBody>
            </Modal>
        </>
    )

}