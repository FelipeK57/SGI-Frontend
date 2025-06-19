import { Button, Form } from "@heroui/react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { PlusIcon } from "../part/Parts";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  addToast,
} from "@heroui/react";
import { useState } from "react";
import { createClient } from "../../services/clientService";
import { createProvider } from "../../services/providerService";

export const ClientsProvidersList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isClients =
    location.pathname === "/dashboard/clients-and-providers/clients";
  const isProviders =
    location.pathname === "/dashboard/clients-and-providers/providers";
  return (
    <main className="flex flex-col gap-4 h-full">
      <h1 className="text-xl font-semibold">Clientes y proveedores</h1>
      <div className="flex justify-between  gap-4 items-center">
        <nav className="flex gap-2 items-center">
          <Button
            onPress={() => navigate("clients")}
            className={`${
              isClients ? "bg-primary text-white" : ""
            } w-full sm:w-fit`}
            variant="bordered"
            color="primary"
          >
            Clientes
          </Button>
          <Button
            onPress={() => navigate("providers")}
            variant="bordered"
            className={`${
              isProviders ? "bg-primary text-white" : ""
            } w-full sm:w-fit`}
            color="primary"
          >
            Proveedores
          </Button>
        </nav>
        <NewClientProvider />
      </div>
      <div className="overflow-y-auto h-full">
        <Outlet />
      </div>
    </main>
  );
};

export const NewClientProvider = () => {
  const location = useLocation();
  const isClients =
    location.pathname === "/dashboard/clients-and-providers/clients";
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (isClients) {
      const response = await createClient({
        name: data.name as string,
        company: data.company as string,
        email: data.email as string,
        phone: data.phone as string,
      });
      if (response.status === 201) {
        onOpenChange();
        addToast({
          title: "Cliente creado",
          description: "El cliente se ha creado correctamente",
          color: "success",
        });
      }
    } else {
      const response = await createProvider({
        name: data.name as string,
        email: data.email as string,
        phone: data.phone as string,
      });
      if (response.status === 201) {
        onOpenChange();
        addToast({
          title: "Proveedor creado",
          description: "El proveedor se ha creado correctamente",
          color: "success",
        });
      }
    }
    setIsLoading(false);
  };

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <div className="block sm:hidden">
        <Button onPress={() => onOpen()} isIconOnly color="primary">
          <PlusIcon />
        </Button>
      </div>
      <div className="hidden sm:flex sm:justify-end">
        <Button onPress={() => onOpen()} color="primary">
          {isClients ? "Registrar nuevo cliente" : "Registrar nuevo proveedor"}
        </Button>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="text-lg font-semibold">
                  {isClients
                    ? "Registrar nuevo cliente"
                    : "Registrar nuevo proveedor"}
                </h2>
              </ModalHeader>
              <Form
                onSubmit={(e) => onSubmit(e)}
                className="flex flex-col gap-0 w-full"
              >
                <ModalBody className="flex flex-col gap-2 w-full">
                  <Input
                    label="Nombre"
                    labelPlacement="outside"
                    variant="bordered"
                    isRequired
                    name="name"
                    placeholder={`${
                      isClients
                        ? "Ingrese el nombre del cliente"
                        : "Ingrese el nombre del proveedor"
                    }`}
                  />
                  {isClients && (
                    <Input
                      label="Empresa"
                      labelPlacement="outside"
                      variant="bordered"
                      isRequired
                      name="company"
                      placeholder="Ingrese la empresa del cliente"
                    />
                  )}
                  <Input
                    label="Email"
                    labelPlacement="outside"
                    variant="bordered"
                    isRequired
                    name="email"
                    placeholder={`${
                      isClients
                        ? "Ingrese el email del cliente"
                        : "Ingrese el email del proveedor"
                    }`}
                  />
                  <Input
                    label="Teléfono"
                    labelPlacement="outside"
                    variant="bordered"
                    isRequired
                    name="phone"
                    placeholder={`${
                      isClients
                        ? "Ingrese el teléfono del cliente"
                        : "Ingrese el teléfono del proveedor"
                    }`}
                  />
                </ModalBody>
                <ModalFooter className="flex justify-end gap-2 w-full">
                  <Button
                    color="default"
                    variant="light"
                    onPress={() => onClose()}
                  >
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit" isLoading={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar"}
                  </Button>
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
