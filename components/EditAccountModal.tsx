import React, { useState, useEffect } from "react";
import { Radio, RadioGroup, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { Comptes } from "@/types";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userCompte : Comptes) => void;
  userCompte: Comptes;
  serveurAccess?: boolean;
}

export default function EditAccountModal({
  isOpen,
  onClose,
  onSubmit,
  userCompte,
  serveurAccess
}: EditAccountModalProps) {
  const [currentCompte, setCurrentCompte] = useState<Comptes>({...userCompte});
  const [addSolde, setAddSolde] = useState<number>(0);
  const [delSolde, setDelSolde] = useState<number>(0);
  const isServeurAccess = (serveurAccess || false);

  const handleSubmit = () => {
    currentCompte.montant = (currentCompte.montant + addSolde - delSolde)
    onSubmit(currentCompte);
    onClose();
  };



  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        <ModalHeader className="flex flex-col">
          Modifier l'utilisateur
        </ModalHeader>

        <ModalBody>
          Modifier le nom
          <Input
            autoFocus
            label="Nom"
            type="string"
            value={currentCompte.nom}
            onChange={ (e) => setCurrentCompte({...currentCompte, nom: e.target.value})}
            variant="bordered"
          />
        </ModalBody>

        <ModalBody>
          Modifier le prénom
          <Input
            autoFocus
            label="Prénom"
            type="string"
            value={currentCompte.prenom}
            onChange={ (e) => setCurrentCompte({...currentCompte, prenom: e.target.value})}
            variant="bordered"
          />
        </ModalBody>

        <ModalBody>
          Modifier la promo
          <Input
            autoFocus
            label="Promo"
            type="number"
            value={String(currentCompte.promo)}
            onChange={ (e) => setCurrentCompte({...currentCompte, promo: parseInt(e.target.value)})}
            variant="bordered"
          />
        </ModalBody>

        <ModalBody>
          Modifier l'adresse mail
          <Input
            autoFocus
            label="Adresse mail"
            type="string"
            value={currentCompte.email}
            onChange={ (e) => setCurrentCompte({...currentCompte, email: e.target.value})}
            variant="bordered"
          />
        </ModalBody>

        {!isServeurAccess && (
          <>
            <ModalBody>
              Modifier le solde
              <Input
                autoFocus
                label="Solde"
                type="number"
                value={ String(currentCompte.montant) }
                onChange={ (e) => setCurrentCompte({...currentCompte, montant: parseFloat(e.target.value)})}
                variant="bordered"
              />
            </ModalBody>

            <ModalBody>
              Modifier l'accès
              <RadioGroup
                isRequired
                defaultValue={String(currentCompte.acces)}
                onValueChange={ (value) => setCurrentCompte({...currentCompte, acces: parseInt(value)})}
              >
                <Radio value="0"> User </Radio>
                <Radio value="1"> Serveur </Radio>
                <Radio value="2"> Admin </Radio>
              </RadioGroup>
            </ModalBody>
          </>
        )}

        <>


          <ModalBody className="">
            <div className="text-center my-2">
              Solde actuel : <span className=" font-semibold">{currentCompte.montant.toFixed(2)} €</span>
            </div>
            <div className="flex flex-row gap-3">
              <div className="text-success">
                Ajouter au solde
                <Input
                  autoFocus
                  label="Valeur à ajouter"
                  type="number"
                  value={String(addSolde)}
                  color="success"
                  onChange={ (e) => setAddSolde(parseFloat(e.target.value))}
                  variant="bordered"
                />
              </div>
              <div className="text-danger">
                Retirer au solde
                <Input
                  autoFocus
                  label="Valeur à ajouter"
                  type="number"
                  value={String(delSolde)}
                  color="danger"
                  onChange={ (e) => setDelSolde(parseFloat(e.target.value))}
                  variant="bordered"
                />
              </div>

            </div>
          </ModalBody>

          <ModalBody>
            <div className="text-center my-2">
              Solde final : <span className="font-semibold">{(currentCompte.montant + addSolde - delSolde).toFixed(2)} €</span>
            </div>
          </ModalBody>
        </>

        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Annuler
          </Button>

          <Button color="primary" onPress={handleSubmit}>
            Valider
          </Button>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
}