import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  NumberInput,
  DatePicker,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PlusIcon, SearchIcon } from "../part/Parts";
import { getOutputs } from "../../services/outputService";
import type { Client, PartOutput } from "../../Clases";
import { outputTypes } from "./NewOutputForm";
import { parseDate } from "@internationalized/date";

export interface OutputObject {
  id?: number;
  clientId: number;
  client: Client;
  type: string;
  saleValue?: number;
  returnDate?: string;
  createdAt: string;
  partOutputs?: PartOutput[];
}
export const Outputs = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [outputs, setOutputs] = useState<OutputObject[]>([]);
  const [filteredOutputs, setFilteredOutputs] = useState<OutputObject[]>([]);

  useEffect(() => {
    const fetchOutputs = async () => {
      const response = await getOutputs();
      setOutputs(response.outputs);
      setFilteredOutputs(response.outputs);
    };

    fetchOutputs();
  }, []);

  useEffect(() => {
    if (search === "") {
      setFilteredOutputs(outputs);
    } else {
      setFilteredOutputs(
        outputs.filter(
          (output) =>
            output.client.name.toLowerCase().includes(search.toLowerCase()) ||
            new Date(output.createdAt).toLocaleDateString().includes(search)
        )
      );
    }
  }, [search, outputs]);

  return (
    <main className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Lista de salidas</h1>
        <div className="block sm:hidden">
          <Button onPress={() => navigate("new")} isIconOnly color="primary">
            <PlusIcon />
          </Button>
        </div>
        <div className="hidden sm:flex sm:justify-end">
          <Button onPress={() => navigate("new")} color="primary">
            Registrar nueva salida
          </Button>
        </div>
      </div>
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="search"
        placeholder="Buscar"
        className="w-full md:max-w-xs"
        variant="bordered"
        startContent={<SearchIcon />}
      />
      <div className="flex flex-col overflow-y-auto h-full">
        {filteredOutputs.length > 0 ? (
          <>
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 border-y-1 p-2 w-full text-sm font-semibold border-zinc-200 bg-zinc-100 sticky top-0 z-10">
              <p>Cliente</p>
              <p>Tipo</p>
              <p>Fecha</p>
            </div>
            <div className="flex flex-col w-full h-full overflow-y-auto">
              {filteredOutputs.map((output) => (
                <OutputDetails key={output.id} output={output} />
              ))}
            </div>
          </>
        ) : (
          <div className="col-span-full flex items-center justify-center">
            <p className="text-zinc-500 text-sm font-light">
              No hay salidas registradas
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

interface OutputDetailsProps {
  output: OutputObject;
}

export const OutputDetails = ({ output }: OutputDetailsProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const typeSale = () => {
    if (output.type === "sale") {
      return "Venta";
    }
    if (output.type === "warranty") {
      return "Garantía";
    }
    if (output.type === "loan") {
      return "Préstamo";
    }
  };

  const styleOutputSelected = (value: string) => {
    if (output.type === value) {
      return "text-white bg-primary border-primary";
    }
    return "text-default-500 border-default";
  };

  return (
    <>
      <div
        key={output.id}
        className="grid grid-cols-3 md:grid-cols-3 gap-4 border-b-1 py-4 px-2 text-xs border-zinc-200 cursor-pointer hover:bg-zinc-100 hover:font-semibold transition-all"
        onClick={onOpen}
      >
        <p className="truncate">{output.client.name}</p>
        <p>{typeSale()}</p>
        <p>{new Date(output.createdAt).toLocaleDateString()}</p>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Detalles de salida
              </ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                <div className="flex flex-col gap-1 w-full">
                  <p className="text-sm after:ml-0.5 mb-1">Tipo de salida</p>
                  <div className="flex gap-2 md:gap-4 items-center justify-between">
                    {outputTypes.map((type) => (
                      <div
                        key={type.value}
                        className={`flex items-center justify-center gap-1 md:gap-2 p-2 border-2 rounded-xl w-full ${styleOutputSelected(
                          type.value
                        )}`}
                      >
                        {type.icon}
                        <p className="text-xs md:text-sm">{type.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Input
                  value={output.client.name}
                  isReadOnly
                  label="Cliente"
                  labelPlacement="outside"
                  className="w-full"
                  variant="bordered"
                />
                {output.type === "sale" ? (
                  <NumberInput
                    value={output.saleValue}
                    label="Valor de venta"
                    labelPlacement="outside"
                    variant="bordered"
                    startContent={<p className="text-zinc-400">$</p>}
                    placeholder="Ingrese el valor de venta"
                    hideStepper
                    isReadOnly
                  />
                ) : output.type === "loan" ? (
                  <DatePicker
                    value={
                      output.returnDate
                        ? parseDate(output.returnDate.split("T")[0])
                        : null
                    }
                    label="Fecha de devolución"
                    labelPlacement="outside"
                    variant="bordered"
                    isReadOnly
                  />
                ) : null}
                {output.partOutputs && output.partOutputs.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm mb-1">Partes {output.type === "sale" ? "vendidas" : "prestadas"}</p>
                    <div className="grid grid-cols-2 gap-3 border-y-1 p-2 w-full text-xs font-semibold border-zinc-200 bg-zinc-100 sticky top-0 z-10">
                      <p>Parte</p>
                      <p>Serial</p>
                    </div>
                    {output.partOutputs.map((part) => (
                      <div
                        key={part.serial}
                        className="grid grid-cols-2 gap-3 p-2 text-xs border-b border-zinc-200"
                      >
                        <p>{part.part?.name}</p>
                        <p>{part.serial}</p>
                      </div>
                    ))}
                    <p className="text-sm">
                      Total:{" "}
                      {Number(output.saleValue)?.toLocaleString("es-CO", {
                        minimumFractionDigits: 0,
                        style: "currency",
                        currency: "COP",
                      })}
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
