import React, { useState, useEffect } from "react";
import { Checkbox, CheckboxGroup, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, firstname: string, solde: number, access: string) => void;
  currentName: string;
  currentFirstname: string;
  currentSolde: number;
  currentAccess: string;
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
  const [access, setAccess] = useState<string>(currentAccess);
  const [selectedAccess, setSelectedAccess] = useState(["user", "serveur", "admin"]);
  const [isInvalidAccess, setIsInvalidAccess] = useState<boolean>(false);

  // Initialise les variables avec les valeurs de la BDD au démarage
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

  const isAccessSelected = (accessSelected: string[]) => {
    setIsInvalidAccess(accessSelected.length !== 1); // S'il y'a plus d'un accès sélectionné, on invalide
    if (accessSelected.length === 1) { 
      setAccess(accessSelected[0]); // On met à jour l'accès sélectionné
    }
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
          <CheckboxGroup
            isRequired
            isInvalid={isInvalidAccess}
            defaultValue={[currentAccess]} 
            onValueChange={isAccessSelected}
          >
            <Checkbox value="user"> User </Checkbox>
            <Checkbox value="serveur"> Serveur </Checkbox>
            <Checkbox value="admin"> Admin </Checkbox>
          </CheckboxGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Annuler
          </Button>
          
          <Button color="primary" onPress={handleSubmit} isDisabled={isInvalidAccess}>
            Valider
          </Button>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
}
