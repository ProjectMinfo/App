import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string/*, firstname: string, solde: number, acces: "user" | "serveur" | "admin"*/) => void;
  currentName: string;
  // currentFirstname: string;
  // currentSolde: number;
  // currentAccess: "user" | "serveur" | "admin";
}

export default function EditAccountModal({
  isOpen,
  onClose,
  onSubmit,
  currentName,
}: EditAccountModalProps) {
  const [name, setName] = useState<string>(currentName);

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(name);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="top-center">
      <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modifier le nom
            </ModalHeader>

            <ModalBody>
              <Input
                autoFocus
                label="Nom"
                type="string"
                value={name}
                onChange={handleNameChange}
                variant="bordered"
              />
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Annuler
              </Button>
              <Button color="primary" onPress={handleSubmit}>
                Valider
              </Button>
            </ModalFooter>

          </>
      </ModalContent>
    </Modal>
  );
}
