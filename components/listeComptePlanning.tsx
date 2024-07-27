import { getComptes, postEditCompte } from "@/config/api";
import { Comptes } from "@/types";
import { Modal, ModalBody, ModalHeader, Table, TableHeader, TableRow, TableCell, TableBody, TableColumn, ModalContent, Input, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import EditAccountModal from "@/components/EditAccountModal";

interface ListeComptesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSelect: (compte: Comptes) => void;
  access?: number;
}

export default function ListeComptesModal({ isOpen, onClose, onUserSelect, access }: ListeComptesModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [allComptes, setAllComptes] = useState<Comptes[]>([]);
  const [filteredComptes, setFilteredComptes] = useState<Comptes[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<Comptes | null>(null);
  const [comptes, setComptes] = useState<Comptes[]>([]);

  useEffect(() => {
    async function fetchComptes() {
      const fetchedComptes = await getComptes();
      fetchedComptes.sort((a: Comptes, b: Comptes) => a.numCompte - b.numCompte); // Trie par ordre de numero de compte
      setComptes(fetchedComptes);
    }
    fetchComptes();
  }, []);

  function onEditOpen(user: Comptes) {
    setCurrentUser(user);
    setIsModalOpen(true);
  };

  const onEditClose = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const onSubmit = async (userCompte : Comptes) => {
    // Modification sur l'utilisateur
    if (currentUser && comptes) {
      const editedListeUtilisateurs = comptes.map((compte) =>
        compte.numCompte === currentUser.numCompte ? { ...userCompte } : compte
      );
      setComptes(editedListeUtilisateurs);

      // Mettre à jour l'utilisateur courant avec les nouvelles données avant de l'envoyer à l'API
      const updatedUser = { ...userCompte };

      try {
        await postEditCompte(updatedUser); // Appel à l'API pour enregistrer les modifications
        console.log("User updated successfully in the API");
      }
      catch (error) {
        console.error("Error updating user:", error);
      }
    }
    onEditClose();
  };

  useEffect(() => {
    const fetchData = async () => {
      const fetchedComptes = await getComptes();
      setAllComptes(fetchedComptes);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    if (query.length < 2) {
      setFilteredComptes([]);
      return;
    }
    if (access) {
      setAllComptes(allComptes.filter(compte => compte.acces > 0));
    }
    setFilteredComptes(
      allComptes.filter(compte =>
        compte.nom.toLowerCase().includes(query) ||
        compte.prenom.toLowerCase().includes(query) ||
        compte.numCompte.toString().includes(query)
      )
    );
  }, [searchQuery, allComptes]);

  function colorSolde(solde: number) {
    return solde < 0 ? "text-danger" // Affiche le solde en rouge si dans le négatif,
      : solde == 0 ? "text-default" // en gris si le compte est à 0,
        : solde < 3.30 ? "text-warning" // en orange s'il passera dans le négatif à l'achat d'un menu à 3.30 €,
          : "text-success"; // en vert si largement dans le positif
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl">
        <ModalContent>
          <ModalHeader>Liste des comptes</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Rechercher un compte (Nom, Prénom ou Numéro de compte)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </ModalBody>
          <ModalBody>
            <Table aria-label="Liste des comptes">
              <TableHeader>
                <TableColumn>Nom</TableColumn>
                <TableColumn>Prénom</TableColumn>
                <TableColumn>Numéro du compte</TableColumn>
                <TableColumn>Solde restante</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredComptes.slice(0, 10).map(compte => (
                  <TableRow key={compte.numCompte}>
                    <TableCell>{compte.nom}</TableCell>
                    <TableCell>{compte.prenom}</TableCell>
                    <TableCell className="text-center">{compte.numCompte}</TableCell>
                    <TableCell
                      className={colorSolde(compte.montant) + " text-center"}
                    >{compte.montant.toFixed(2) + " €"}</TableCell>
                    <TableCell>
                      <Button color="success" variant="flat" onClick={() => onUserSelect(compte)}>
                        Utiliser
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredComptes.length > 10 && (
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell className="text-center">...</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
                {filteredComptes.length === 0 && (
                  <TableRow>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                    <TableCell className="text-center">2 caractères minimum dans la recherche</TableCell>
                    <TableCell> </TableCell>
                    <TableCell> </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
      {currentUser && (
        <EditAccountModal
          isOpen={isModalOpen}
          onClose={onEditClose}
          onSubmit={onSubmit}
          userCompte={currentUser}
        />
      )}
    </>
  );
}
