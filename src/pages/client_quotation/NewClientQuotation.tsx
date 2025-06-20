import { Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react";
import { SearchIcon } from "../part/Parts";
import { useEffect, useState, type Key } from "react";
import type { Client, Part } from "../../Clases";
import { fetchClients } from "../../services/clientService";
import { useNavigate } from "react-router";
import { getPartByNumber } from "../../services/partService";
import { PartFound } from "../../components/PartFound";
import { QuotePart } from "../../components/QuotePart";

interface PartAdded {
  part: Part;
  quantity?: number;
  priceUnit?: number;
  priceTotal?: number;
}

export const NewClientQuotation = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [partNumber, setPartNumber] = useState<string>("");
  const [partsFound, setPartsFound] = useState<Part[]>([]);
  const [partsAdded, setPartsAdded] = useState<PartAdded[]>([]);

  useEffect(() => {
    const getClients = async () => {
      const data = await fetchClients();
      setClients(data.clients);
    };
    getClients();
  }, []);

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
    setPartsAdded([...partsAdded, { part, quantity: 1, priceUnit: 0, priceTotal: 0 }]);
    setPartNumber("");
    setPartsFound([]);
  };

  const handleQuantityChange = (part: Part, quantity: number) => {
    setPartsAdded(partsAdded.map((p) => p.part.id === part.id ? { ...p, quantity, priceTotal: p.priceUnit ? p.priceUnit * quantity : 0 } : p));
  };

  const handlePriceUnitChange = (part: Part, priceUnit: number) => {
    setPartsAdded(partsAdded.map((p) => p.part.id === part.id ? { ...p, priceUnit, priceTotal: p.quantity ? p.quantity * priceUnit : 0 } : p));
  };

  const handleRemovePart = (part: Part) => {
    setPartsAdded(partsAdded.filter((p) => p.part.id !== part.id));
  };

  useEffect(() => {
    if (partNumber === "") {
      setPartsFound([]);
    }
  }, [partNumber]);

  const handleSubmit = () => {
    console.log(partsAdded);
  };

  return (
    <main className="flex flex-col gap-3 w-full h-full overflow-hidden">
      <h1 className="text-xl font-semibold">Crear nueva cotización</h1>
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
        onSelectionChange={handleSelectionChange}
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
          isRequired
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
            <PartFound key={part.id} part={part} onAddPart={handleAddPart} />
          ))}
        </div>
      )}
      <p className="text-sm">Partes agregadas</p>
      <p className="font-semibold">Total: $0</p>
      <div className="flex flex-col gap-2 h-full overflow-y-auto">
        {partsAdded.length > 0 && (
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
        )}
      </div>
      <div className="flex w-full gap-2">
        <Button
          className="w-full"
          onPress={() => navigate("/dashboard/client-quotes")}
          variant="bordered"
          color="default"
        >
          Cancelar
        </Button>
        <Button
          variant="solid"
          color="primary"
          className="w-full"
          onPress={handleSubmit}
        >
          Crear cotización
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
