import { useState } from "react";
import type { Client } from "../Clases";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  addToast,
} from "@heroui/react";
import { updateClient } from "../services/clientService";

interface ClientRowProps {
  client: Client;
  reload: boolean;
  setReload: (reload: boolean) => void;
}

export const ClientRow = ({ client, reload, setReload }: ClientRowProps) => {
  const [clientData, setClientData] = useState(client);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const clientToUpdate = {
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
      };
      const response = await updateClient(
        client.id?.toString(),
        clientToUpdate
      );
      if (response.status === 200) {
        addToast({
          title: "Cliente actualizado",
          description: "El cliente ha sido actualizado correctamente",
          color: "success",
          timeout: 3000,
        });
        onOpenChange();
        setReload(!reload);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={onOpen}
        className="grid grid-cols-3 md:grid-cols-4 gap-3 border-y-1 py-4 px-2 w-full text-xs border-zinc-200 cursor-pointer hover:bg-zinc-100 hover:font-semibold transition-all"
        key={client.id}
      >
        <p>{client.name}</p>
        <p className="truncate">{client.email || "-"}</p>
        <p>{client.phone || "-"}</p>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar datos del cliente
              </ModalHeader>
              <ModalBody className="flex flex-col gap-2 w-full">
                <Input
                  placeholder="Ingrese el nombre del cliente"
                  isRequired
                  label="Nombre"
                  name="name"
                  labelPlacement="outside"
                  variant="bordered"
                  value={clientData.name}
                  onChange={(e) =>
                    setClientData({ ...clientData, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Ingrese el email del cliente"
                  label="Email"
                  labelPlacement="outside"
                  variant="bordered"
                  value={clientData.email}
                  onChange={(e) =>
                    setClientData({ ...clientData, email: e.target.value })
                  }
                />
                <Input
                  type="tel"
                  placeholder="Ingrese el teléfono del cliente"
                  label="Teléfono"
                  labelPlacement="outside"
                  variant="bordered"
                  value={clientData.phone}
                  onChange={(e) =>
                    setClientData({ ...clientData, phone: e.target.value })
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  isLoading={isLoading}
                  color="primary"
                  onPress={() => handleSubmit()}
                >
                  {isLoading ? "Guardando..." : "Guardar"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
