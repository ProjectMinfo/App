import React, { useState, useEffect } from "react";
import { Radio, RadioGroup, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nom: string, prenom: string, montant: number, acces: number) => void;
  currentName: string;
  currentFirstname: string;
  currentSolde: number;
  currentAccess: number;
}

export default function EditAccountModal({
  isOpen,
  onClose,
  onSubmit,
  currentName,
  currentFirstname,
  currentSolde,
  currentAccess
}: EditAccountModalProps) {
  const [name, setName] = useState<string>(currentName);
  const [firstname, setFirstname] = useState<string>(currentFirstname);
  const [solde, setSolde] = useState<number>(currentSolde);
  const [access, setAccess] = useState<number>(currentAccess);

  // Initialize variables with the values from the database on startup
  useEffect(() => {
    setName(currentName);
    setFirstname(currentFirstname);
    setSolde(currentSolde);
    setAccess(currentAccess);
  }, [currentName, currentFirstname, currentSolde, currentAccess]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleFirstnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstname(event.target.value);
  }

  const handleSoldeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSolde(Number(event.target.value));
  }

  const isAccessSelected = (accessSelected: string) => {
      setAccess(Number(accessSelected)); // Update the selected access
  }

  const handleSubmit = () => {
    onSubmit(name, firstname, solde, access);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          Modifier l'utilisateur
        </ModalHeader>

        <ModalBody>
          Modifier le nom
          <Input
            autoFocus
            label="Nom"
            type="string"
            value={name}
            onChange={handleNameChange}
            variant="bordered"
          />
        </ModalBody>

        <ModalBody>
          Modifier le prénom
          <Input
            autoFocus
            label="Prénom"
            type="string"
            value={firstname}
            onChange={handleFirstnameChange}
            variant="bordered"
          />
        </ModalBody>

        <ModalBody>
          Modifier le solde
          <Input
            autoFocus
            label="Solde"
            type="number"
            value={String(solde)}
            onChange={handleSoldeChange}
            variant="bordered"
          />
        </ModalBody>

        <ModalBody>
          Modifier l'accès
          <RadioGroup
            isRequired
            defaultValue={String(currentAccess)}
            onValueChange={isAccessSelected}
          >
            <Radio value="0"> User </Radio>
            <Radio value="1"> Serveur </Radio>
            <Radio value="2"> Admin </Radio>
          </RadioGroup>
        </ModalBody>

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