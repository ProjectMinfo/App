import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";

interface DetailCommandeModalProps {
  isOpen: boolean;
  onClose: (data: string) => any;
  options: string[];
}

export default function DetailCommandeModal({ isOpen, onClose, options }: DetailCommandeModalProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleValidateClick = () => {
    if (selectedOption) {
      onClose(selectedOption);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => onClose("")} // Close modal without selected data
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
                  variant={selectedOption === option ? "flat" : "ghost"}
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
