import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@heroui/react";
import { SearchIcon } from "../part/Parts";
import { useEffect, useState, type Key } from "react";
import type { Client, Part } from "../../Clases";
import { fetchClients } from "../../services/clientService";
import { useNavigate } from "react-router";
import { getPartByNumber } from "../../services/partService";
import { PartFound } from "../../components/PartFound";
import { QuotePart } from "../../components/QuotePart";
import { createClientQuotation } from "../../services/clientQuotationService";
import { useReload } from "../../context/ClientProviderContext";

export interface PartAdded {
  id?: string;
  partId: number;
  part: Part;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

export const NewClientQuotation = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [partNumber, setPartNumber] = useState<string>("");
  const [partsFound, setPartsFound] = useState<Part[]>([]);
  const [partsAdded, setPartsAdded] = useState<PartAdded[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { reload, setReload } = useReload();

  // Errors
  const [errors, setErrors] = useState({
    errorSelectClient: null as string | null,
    errorPartsAdded: null as string | null,
  });

  useEffect(() => {
    const getClients = async () => {
      const data = await fetchClients();
      setClients(data.clients);
      setReload(!reload);
    };
    getClients();
  }, [reload]);

  const handleSearchPart = async (partNumber: string) => {
    const data = await getPartByNumber(partNumber);
    setPartsFound(data.parts);
  };

  const handleSelectionChange = (key: Key | null) => {
    if (!key) {
      setSelectedClient(null);
    } else {
      setSelectedClient(key as number);
    }
  };

  const handleAddPart = (part: Part) => {
    if (partsAdded.some((p) => p.partId === part.id)) {
      addToast({
        title: "Parte ya agregada",
        description: "La parte ya ha sido agregada a la cotización",
        color: "warning",
        timeout: 3000,
      });
      return;
    }
    setPartsAdded([
      ...partsAdded,
      { partId: part.id, part: part, quantity: 1, unitPrice: 0, totalPrice: 0 },
    ]);
    setPartNumber("");
    setPartsFound([]);
  };

  const handleQuantityChange = (part: Part, quantity: number) => {
    setPartsAdded(
      partsAdded.map((p) =>
        p.partId === part.id
          ? {
              ...p,
              quantity,
              totalPrice: p.unitPrice ? p.unitPrice * quantity : 0,
            }
          : p
      )
    );
  };

  const handlePriceUnitChange = (part: Part, priceUnit: number) => {
    setPartsAdded(
      partsAdded.map((p) =>
        p.part.id === part.id
          ? {
              ...p,
              unitPrice: priceUnit,
              totalPrice: p.quantity ? p.quantity * priceUnit : 0,
            }
          : p
      )
    );
  };

  const handleRemovePart = (part: Part) => {
    setPartsAdded(partsAdded.filter((p) => p.part.id !== part.id));
  };

  useEffect(() => {
    if (partNumber === "") {
      setPartsFound([]);
    }
  }, [partNumber]);

  const handleSubmit = async () => {
    setIsLoading(true);
    if (!selectedClient) {
      setErrors((prev) => ({
        ...prev,
        errorSelectClient: "Por favor, selecciona un cliente",
      }));
    }
    if (partsAdded.length === 0) {
      setErrors((prev) => ({
        ...prev,
        errorPartsAdded: "Por favor, agrega al menos una parte",
      }));
    }

    if (!selectedClient || partsAdded.length === 0) {
      setIsLoading(false);
      return;
    }

    const response = await createClientQuotation(
      selectedClient as number,
      partsAdded
    );
    if (response && response.status === 201) {
      navigate("/dashboard/client-quotes");
      addToast({
        title: "Cotización creada",
        description: "La cotización ha sido creada correctamente",
        color: "success",
        timeout: 3000,
      });
    }
    setIsLoading(false);
  };

  return (
    <main className="flex flex-col gap-3 w-full h-full overflow-hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Crear nueva cotización</h1>
        <div className="hidden md:flex gap-2">
          <Button
            className="w-full"
            onPress={() => navigate("/dashboard/client-quotes")}
            variant="bordered"
            color="default"
          >
            Cancelar
          </Button>
          <Button
            isLoading={isLoading}
            variant="solid"
            color="primary"
            className="w-full px-8"
            onPress={handleSubmit}
          >
            {isLoading ? "Creando..." : "Crear cotización"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4 h-fit overflow-hidden">
        <div className="flex flex-col gap-2">
          <Autocomplete
            label="Cliente"
            labelPlacement="outside"
            placeholder="Buscar cliente"
            defaultItems={clients}
            description={
              <>
                <p>
                  No encuentras el cliente?, da clic en el texto subrayado{" "}
                  <a
                    className="text-blue-500 underline"
                    href="http://localhost:5173/dashboard/clients-and-providers"
                    target="_blank"
                  >
                    Crear nuevo cliente
                  </a>{" "}
                </p>
              </>
            }
            variant="bordered"
            startContent={<SearchIcon />}
            selectorIcon={<SelectorIcon />}
            isRequired
            onSelectionChange={(client) => {
              handleSelectionChange(client);
              setErrors((prev) => ({
                ...prev,
                errorSelectClient: null,
              }));
            }}
            errorMessage={errors.errorSelectClient}
            isInvalid={errors.errorSelectClient !== null}
          >
            {(client) => (
              <AutocompleteItem key={client.id}>{client.name}</AutocompleteItem>
            )}
          </Autocomplete>
          <div className="flex gap-2 items-end">
            <Input
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              label="Parte"
              labelPlacement="outside"
              variant="bordered"
              placeholder="Busca por número de parte"
              startContent={<SearchIcon />}
              classNames={{
                inputWrapper: "pr-1",
              }}
              endContent={
                <Button
                  variant="light"
                  size="sm"
                  color="primary"
                  onPress={() => handleSearchPart(partNumber)}
                >
                  Buscar
                </Button>
              }
              description={
                <>
                  <p>
                    No encuentras la parte?, da clic en el texto subrayado{" "}
                    <a
                      className="text-blue-500 underline"
                      href="http://localhost:5173/dashboard/parts/new"
                      target="_blank"
                    >
                      Crear nueva parte
                    </a>
                  </p>
                </>
              }
            />
          </div>
          {partsFound.length > 0 && partNumber !== "" && (
            <div className="flex flex-col gap-2">
              {partsFound.map((part) => (
                <PartFound
                  key={part.id}
                  part={part}
                  onAddPart={handleAddPart}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 h-full overflow-hidden">
          <p className="text-sm">Partes agregadas:</p>
          {partsAdded && partsAdded.length > 0 && (
            <p className="font-semibold">
              Total: $
              {partsAdded.reduce(
                (acc, part) => acc + (part.totalPrice || 0),
                0
              )}
            </p>
          )}
          <div className="flex flex-col gap-2 h-full overflow-y-auto">
            {partsAdded.length > 0 ? (
              <div className="flex flex-col gap-2">
                {partsAdded.map((part) => (
                  <QuotePart
                    key={part.part.id}
                    part={part.part}
                    onRemovePart={handleRemovePart}
                    onQuantityChange={handleQuantityChange}
                    onPriceUnitChange={handlePriceUnitChange}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col w-full items-center justify-center">
                <p
                  className={`text-zinc-500 text-xs ${
                    errors.errorPartsAdded !== null && "text-rose-600"
                  }`}
                >
                  No hay partes agregadas
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex md:hidden w-full gap-2">
        <Button
          className="w-full"
          onPress={() => navigate("/dashboard/client-quotes")}
          variant="bordered"
          color="default"
        >
          Cancelar
        </Button>
        <Button
          isLoading={isLoading}
          variant="solid"
          color="primary"
          className="w-full"
          onPress={handleSubmit}
        >
          {isLoading ? "Creando..." : "Crear cotización"}
        </Button>
      </div>
    </main>
  );
};

export const SelectorIcon = () => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width="1em"
    >
      <path d="M0 0h24v24H0z" fill="none" stroke="none" />
      <path d="M8 9l4 -4l4 4" />
      <path d="M16 15l-4 4l-4 -4" />
    </svg>
  );
};
