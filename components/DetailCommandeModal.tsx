import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

interface DetailCommandeModalProps {
  isOpen: boolean;
  onClose: (data: string[]) => any; // Modifié pour renvoyer un tableau de chaînes
  options: string[];
}

export default function DetailCommandeModal({ isOpen, onClose, options }: DetailCommandeModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionClick = (option: string) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(option)
        ? prevSelected.filter((opt) => opt !== option)
        : [...prevSelected, option]
    );
  };

  const handleValidateClick = () => {
    onClose(selectedOptions);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => onClose([])} // Close modal without selected data
      placement="top-center"
    >
      <ModalContent>
        {(onCloseInternal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Log in</ModalHeader>
            <ModalBody>
              {options.map((option) => (
                <Button
                  color="primary"
                  variant={selectedOptions.includes(option) ? "flat" : "ghost"}
                  key={option}
                  onPress={() => handleOptionClick(option)}
                >
                  {option}
                </Button>
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="success" variant="flat" onPress={handleValidateClick}>
                Valider
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
