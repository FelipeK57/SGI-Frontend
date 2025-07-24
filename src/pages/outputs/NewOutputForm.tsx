import { useEffect, useState, type Key } from "react";
import type {
  Client,
  NewOutput,
  Part,
  PartOutput,
  UnitPart,
} from "../../Clases";
import { fetchClients } from "../../services/clientService";
import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Form,
  Input,
  NumberInput,
} from "@heroui/react";
import { SearchIcon } from "../part/Parts";
import { SelectorIcon } from "../client_quotation/NewClientQuotation";
import {
  getUnitPartByPartNumber,
  getUnitPartBySerial,
} from "../../services/unitsPartService";
import { createOutput } from "../../services/outputService";
import { ArrowLeftIcon } from "../part/DetailsPart";
import { useNavigate } from "react-router";

export interface UnitPartsAdded {
  id?: string;
  part: Part;
  partId: number;
  serial: string;
}

interface Errors {
  client: string;
  outputType: string;
  partNumber: string;
  serial: string;
}

export const NewOutputForm = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [outputType, setOutputType] = useState<string>("");
  const [partNumber, setPartNumber] = useState<string>("");
  const [saleValue, setSaleValue] = useState<number>(0);
  const [serial, setSerial] = useState<string>("");
  const [isStock, setIsStock] = useState<boolean>(false);

  const [errors, setErrors] = useState<Errors>({
    client: "",
    outputType: "",
    partNumber: "",
    serial: "",
  });

  const [unitPartWarranty, setUnitPartWarranty] = useState<PartOutput[] | null>(
    null
  );
  const [unitPartsFound, setUnitPartsFound] = useState<UnitPart[]>([]);
  const [unitPartsAdded, setUnitPartsAdded] = useState<UnitPartsAdded[]>([]);

  useEffect(() => {
    const getClients = async () => {
      const data = await fetchClients();
      setClients(data.clients);
    };
    getClients();
  }, []);

  const handleSelectionChange = (key: Key | null) => {
    if (!key) {
      setSelectedClient(null);
      return;
    }

    if (unitPartsAdded.length > 0 || unitPartsFound.length > 0) {
      if (
        confirm(
          "Cambiar de cliente eliminará las partes agregadas o las encontradas. ¿Deseas continuar?"
        )
      ) {
        setUnitPartsAdded([]);
        setUnitPartsFound([]);
        setSelectedClient(key as number);
      }
      return;
    }

    setSelectedClient(key as number);
    setErrors({
      ...errors,
      client: "",
    });
  };

  const handleAddPart = (part: UnitPart) => {
    if (
      unitPartsAdded.some(
        (p) => p.serial === part.serial && p.partId === part.part.id
      )
    ) {
      addToast({
        title: "Parte ya agregada",
        description: "La parte ya ha sido agregada a la salida.",
        color: "warning",
        timeout: 3000,
      });
      return;
    }
    setSaleValue(
      outputType === "sale"
        ? part.intake?.quotationPart.unitPrice || 0
        : saleValue
    );
    setUnitPartsAdded([
      ...unitPartsAdded,
      {
        part: part.part,
        partId: part.part.id,
        serial: part.serial,
      },
    ]);
    setUnitPartsFound(
      unitPartsFound.filter((unitPart) => unitPart.id !== part.id)
    );
  };

  const handleSearchPart = () => {
    const newErrors: Errors = {
      client: "",
      outputType: "",
      partNumber: "",
      serial: "",
    };

    if (selectedClient === null) {
      newErrors.client = "Debes seleccionar un cliente.";
    }

    if (outputType === "") {
      newErrors.outputType = "Debes seleccionar un tipo de salida.";
    }

    setErrors(newErrors);
    if (newErrors.client !== "" || newErrors.outputType !== "") {
      return;
    }

    if (outputType === "sale" || outputType === "loan") {
      if (partNumber === "") {
        newErrors.partNumber = "Debes ingresar un número de parte.";
        setErrors(newErrors);
        if (newErrors.partNumber !== "") {
          return;
        }
      }
      handleSearchPartByPartNumber();
    }
    if (outputType === "warranty") {
      if (serial === "") {
        newErrors.serial = "Debes ingresar un serial.";
        setErrors(newErrors);
        if (newErrors.serial !== "") {
          return;
        }
      }
      handleSearchPartBySerial();
    }
  };

  const handleSearchPartByPartNumber = async () => {
    const response = await getUnitPartByPartNumber(
      partNumber,
      selectedClient as number,
      outputType
    );
    setUnitPartsFound(response.unitParts);
    setIsStock(response.isStock || false);
  };

  const handleSearchPartBySerial = async () => {
    const response = await getUnitPartBySerial(
      serial,
      selectedClient as number
    );
    setUnitPartWarranty(response.unit.partOutputs);
  };

  const styleOutputSelected = (value: string) => {
    if (outputType === value) {
      return "text-white bg-primary border-primary";
    }
    return "text-default-500 border-default";
  };

  useEffect(() => {
    if (partNumber === "") {
      setUnitPartsFound([]);
    }
    if (selectedClient === null) {
      setUnitPartsFound([]);
      setUnitPartsAdded([]);
    }
  }, [partNumber, selectedClient]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const outputData: NewOutput = {
      clientId: selectedClient as number,
      type: outputType,
      saleValue: (outputType === "sale" && saleValue) || undefined,
      returnDate:
        (outputType === "loan" &&
          new Date(data.returnDate as string).toISOString()) ||
        undefined,
      parts: unitPartsAdded,
    };
    const response = await createOutput(outputData);
    if (response && response.status === 201) {
      addToast({
        title: "Salida registrada",
        description: "La salida se ha registrado correctamente.",
        color: "success",
        timeout: 3000,
      });
      setSelectedClient(null);
      setOutputType("");
      setPartNumber("");
      setSerial("");
      setUnitPartsAdded([]);
      setUnitPartsFound([]);
    }
  };

  return (
    <>
      <Button
        onPress={() => navigate("/dashboard/outputs")}
        isIconOnly
        variant="light"
        color="primary"
      >
        <ArrowLeftIcon />
      </Button>
      <Form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 w-full max-w-sm md:max-w-md mx-auto h-full overflow-hidden"
      >
        <h1 className="text-xl font-semibold text-center">Salida de parte</h1>
        <div className="flex flex-col gap-1 w-full">
          <p
            className={`text-sm after:ml-0.5 mb-1 after:text-red-500 after:content-['*'] ${
              errors.outputType !== "" && "text-danger-500"
            }`}
          >
            Tipo de salida
          </p>
          <div className="flex gap-2 md:gap-4 items-center justify-between">
            {outputTypes.map((type) => (
              <div
                key={type.value}
                onClick={() => {
                  setErrors({ ...errors, outputType: "" });
                  setOutputType(type.value);
                }}
                className={`flex items-center justify-center gap-1 md:gap-2 p-2 border-2 rounded-xl w-full cursor-pointer transition-all active:scale-95 ${styleOutputSelected(
                  type.value
                )} ${errors.outputType !== "" && "border-danger-500"}`}
              >
                {type.icon}
                <p className="text-xs md:text-sm">{type.label}</p>
              </div>
            ))}
          </div>
          {errors.outputType !== "" && (
            <p className="text-xs text-danger-500">{errors.outputType}</p>
          )}
        </div>
        <Autocomplete
          label="Cliente"
          labelPlacement="outside"
          placeholder="Buscar cliente"
          defaultItems={clients}
          variant="bordered"
          startContent={<SearchIcon />}
          selectorIcon={<SelectorIcon />}
          isRequired
          selectedKey={selectedClient}
          onSelectionChange={handleSelectionChange}
          isInvalid={errors.client !== ""}
          errorMessage={errors.client}
        >
          {(client) => (
            <AutocompleteItem key={client.id}>{client.name}</AutocompleteItem>
          )}
        </Autocomplete>
        {outputType === "loan" && (
          <DatePicker
            name="returnDate"
            label="Fecha de devolución"
            labelPlacement="outside"
            variant="bordered"
            isRequired
          />
        )}
        {
          outputType === "sale" &&  isStock && (
            <NumberInput
              value={saleValue}
              onValueChange={(value) => {
                setSaleValue(value);
              }}
              label="Valor de venta"
              labelPlacement="outside"
              variant="bordered"
              startContent={<p className="text-zinc-400">$</p>}
              placeholder="Ingrese el valor de venta"
              minValue={0}
              isRequired
            />
          )
        }
        <Input
          value={
            outputType === "sale" || outputType === "loan"
              ? partNumber
              : outputType === "warranty"
              ? serial
              : ""
          }
          onChange={(e) => {
            if (outputType === "sale" || outputType === "loan") {
              setPartNumber(e.target.value);
              setErrors({
                ...errors,
                partNumber: "",
              });
            }
            if (outputType === "warranty") {
              setSerial(e.target.value);
              setErrors({
                ...errors,
                serial: "",
              });
            }
          }}
          label="Buscar parte"
          labelPlacement="outside"
          variant="bordered"
          isInvalid={errors.partNumber !== ""}
          errorMessage={errors.partNumber}
          placeholder={
            outputType === "sale" || outputType === "loan"
              ? "Ingresa el número de parte"
              : "Ingresa el serial de la parte"
          }
          startContent={<SearchIcon />}
          classNames={{
            inputWrapper: "pr-1",
          }}
          endContent={
            <Button
              variant="light"
              size="sm"
              color="primary"
              onPress={() => {
                handleSearchPart();
              }}
            >
              Buscar
            </Button>
          }
        />
        {unitPartsFound.length > 0 && (
          <div className="flex flex-col gap-2 h-fit overflow-y-auto">
            <p className="text-sm">Partes encontradas:</p>
            {unitPartsFound.map((unitPart) => (
              <div
                key={unitPart.id}
                className="flex border-1 p-2 gap-4 rounded-md"
              >
                <img
                  src={unitPart.part.image}
                  alt={unitPart.part.name}
                  className="w-1/3 md:w-1/4 aspect-square object-contain bg-zinc-100 rounded-md"
                />
                <div className="flex flex-col gap-2 w-full">
                  <p className="font-semibold">{unitPart.part.name}</p>
                  {/* <p className="text-sm text-zinc-700">{unitPart.part.partNumber}</p> */}
                  <p className="text-xs text-zinc-500">
                    Serial: {unitPart.serial}
                  </p>
                  <Button
                    size="sm"
                    variant="bordered"
                    color="primary"
                    className="w-fit"
                    onPress={() => handleAddPart(unitPart)}
                  >
                    Agregar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {Array.isArray(unitPartWarranty) &&
          unitPartWarranty.length > 0 &&
          unitPartWarranty.map((unitPartWarranty) => (
            <div className="flex border-1 p-2 gap-4 rounded-md w-full">
              <img
                src={unitPartWarranty.part?.image}
                alt={unitPartWarranty.part?.name}
                className="w-1/3 md:w-1/4 aspect-square object-contain bg-zinc-100 rounded-md"
              />
              <div className="flex flex-col gap-2 w-full">
                <p className="font-semibold">{unitPartWarranty.part?.name}</p>
                <p className="text-xs text-zinc-500">
                  Serial: {unitPartWarranty.serial}
                </p>
                <Button
                  size="sm"
                  variant="bordered"
                  color="primary"
                  className="w-fit"
                  onPress={() => {
                    if (
                      unitPartWarranty.part &&
                      unitPartWarranty.part.id !== undefined
                    ) {
                      setUnitPartsAdded([
                        ...unitPartsAdded,
                        {
                          part: unitPartWarranty.part,
                          partId: unitPartWarranty.part.id,
                          serial: unitPartWarranty.serial,
                        },
                      ]);
                    }
                    setUnitPartWarranty(null);
                  }}
                >
                  Agregar
                </Button>
              </div>
            </div>
          ))}
        {unitPartsAdded.length > 0 && (
          <div className="flex flex-col gap-2 w-full h-fit overflow-y-auto">
            <p className="text-sm">Partes agregadas:</p>
            {unitPartsAdded.map((unitPart) => (
              <div
                key={unitPart.id}
                className="flex border-1 p-2 gap-4 rounded-md"
              >
                <img
                  src={unitPart.part.image}
                  alt={unitPart.part.name}
                  className="w-1/3 md:w-1/4 aspect-square object-contain bg-zinc-100 rounded-md"
                />
                <div className="flex flex-col gap-2 w-full">
                  <p className="font-semibold">{unitPart.part.name}</p>
                  <p className="text-xs text-zinc-500">
                    Serial: {unitPart.serial}
                  </p>
                  <Button
                    size="sm"
                    variant="bordered"
                    color="danger"
                    className="w-fit"
                    onPress={() => {
                      setUnitPartsAdded(
                        unitPartsAdded.filter(
                          (p) => p.serial !== unitPart.serial
                        )
                      );
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button type="submit" color="primary" className="w-full min-h-10">
          Registrar salida
        </Button>
      </Form>
    </>
  );
};

export const WrenchIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
      />
    </svg>
  );
};

export const CashIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
      />
    </svg>
  );
};

export const LoanIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
      />
    </svg>
  );
};

export const outputTypes = [
  { label: "Venta", value: "sale", icon: <CashIcon /> },
  { label: "Prestamo", value: "loan", icon: <LoanIcon /> },
  { label: "Garantia", value: "warranty", icon: <WrenchIcon /> },
];
