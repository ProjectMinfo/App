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
  serveurAccess?: boolean;
}

export default function EditAccountModal({
  isOpen,
  onClose,
  onSubmit,
  currentName,
  currentFirstname,
  currentSolde,
  currentAccess,
  serveurAccess,
}: EditAccountModalProps) {
  const [name, setName] = useState<string>(currentName);
  const [firstname, setFirstname] = useState<string>(currentFirstname);
  const [solde, setSolde] = useState<number>(currentSolde);
  const [addSolde, setAddSolde] = useState<number>(0);
  const [delSolde, setDelSolde] = useState<number>(0);
  const [access, setAccess] = useState<number>(currentAccess);
  const isServeurAccess = (serveurAccess || false);

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

  const handleAddSoldeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddSolde(Number(event.target.value));
  }

  const handleDelSoldeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDelSolde(Number(event.target.value));
  }

  const isAccessSelected = (accessSelected: string) => {
    setAccess(Number(accessSelected)); // Update the selected access
  }

  const handleSubmit = () => {
    onSubmit(name, firstname, (solde + addSolde - delSolde), access);
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

        {!isServeurAccess && (
          <>
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
          </>
        )}

        {isServeurAccess && (
          <>


            <ModalBody className="">
              <div className="text-center my-2">
                Solde actuel : <span className=" font-semibold">{solde.toFixed(2)} €</span>
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
                    onChange={handleAddSoldeChange}
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
                    onChange={handleDelSoldeChange}
                    variant="bordered"
                  />
                </div>

              </div>
            </ModalBody>

            <ModalBody>
              <div className="text-center my-2">
                Solde final : <span className="font-semibold">{(solde + addSolde - delSolde).toFixed(2)} €</span>
              </div>
            </ModalBody>
          </>
        )}

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