import { useState } from "react";
import type { Provider } from "../Clases";
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
import { updateProvider } from "../services/providerService";

interface ProviderRowProps {
  provider: Provider;
  reload: boolean;
  setReload: (reload: boolean) => void;
}

export const ProviderRow = ({
  provider,
  reload,
  setReload,
}: ProviderRowProps) => {
  const [providerData, setProviderData] = useState<Provider>(provider);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const providerToUpdate = {
        name: providerData.name,
        email: providerData.email,
        phone: providerData.phone,
      };
      const response = await updateProvider(
        provider.id?.toString(),
        providerToUpdate
      );
      if (response.status === 200) {
        addToast({
          title: "Proveedor actualizado",
          description: "El proveedor ha sido actualizado correctamente",
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
        className="grid grid-cols-[30%_1fr] md:grid-cols-3 gap-3 w-full border-b-1 py-4 px-2 text-xs border-zinc-200 cursor-pointer hover:bg-zinc-100 hover:font-semibold transition-all"
        key={provider.id}
      >
        <p>{provider.name}</p>
        <p className="truncate">{provider.email || "-"}</p>
        <p>{provider.phone || "-"}</p>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Editar datos del proveedor</ModalHeader>
              <ModalBody>
                <Input
                  value={providerData.name}
                  onChange={(e) =>
                    setProviderData({ ...providerData, name: e.target.value })
                  }
                  label="Nombre"
                  labelPlacement="outside"
                  variant="bordered"
                  isRequired
                  name="name"
                  placeholder="Ingrese el nombre del proveedor"
                />
                <Input
                  value={providerData.email}
                  onChange={(e) =>
                    setProviderData({ ...providerData, email: e.target.value })
                  }
                  label="Email"
                  labelPlacement="outside"
                  variant="bordered"
                  name="email"
                  placeholder="Ingrese el email del proveedor"
                />
                <Input
                  type="tel"
                  value={providerData.phone}
                  onChange={(e) =>
                    setProviderData({ ...providerData, phone: e.target.value })
                  }
                  label="Teléfono"
                  labelPlacement="outside"
                  variant="bordered"
                  name="phone"
                  placeholder="Ingrese el teléfono del proveedor"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  onPress={handleSubmit}
                  isLoading={isLoading}
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
