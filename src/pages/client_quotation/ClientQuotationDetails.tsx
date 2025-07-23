import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  getClientQuotationById,
  updateClientQuotation,
} from "../../services/clientQuotationService";
import {
  addToast,
  Button,
  Input,
  Select,
  SelectItem,
  type Selection,
} from "@heroui/react";
import type { ClientQuotation, Part } from "../../Clases";
import { formatDate } from "../../components/ClientQuotationRow";
import type { PartAdded } from "./NewClientQuotation";
import { QuotePart } from "../../components/QuotePart";
import { SearchIcon } from "../part/Parts";
import { getPartByNumber } from "../../services/partService";
import { PartFound } from "../../components/PartFound";
import { ImportCosts } from "../../components/forms/ImportCosts";
import { ArrowLeftIcon } from "../part/DetailsPart";
import { generateQuotationPDF } from "../../utils/GenerateImportPDFQuote";
import { LocalCosts } from "../../components/forms/LocalCosts";
import { generateLocalQuotationPDF } from "../../utils/GenerateLocalPDFQuote";

export const states = [
  {
    key: "Aceptada",
    value: "Aceptada",
  },
  {
    key: "Cancelada",
    value: "Cancelada",
  },
  {
    key: "Pendiente",
    value: "Pendiente",
  },
];

export const ClientQuotationDetails = () => {
  const quotationId = useLocation().pathname.split("/").pop()!;
  const [date, setDate] = useState<string>("");
  const [quotation, setQuotation] = useState<ClientQuotation | null>(null);
  const navigate = useNavigate();
  const [partNumber, setPartNumber] = useState<string>("");
  const [partsFound, setPartsFound] = useState<Part[]>([]);
  const [partsAdded, setPartsAdded] = useState<PartAdded[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stateSelected, setStateSelected] = useState<Selection>(new Set());
  const [reload, setReload] = useState(false);

  // Error
  const [errorPartsAdded, setErrorPartsAdded] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuotation = async () => {
      const response = await getClientQuotationById(quotationId);
      setQuotation(response.quotation);
      setDate(formatDate(response.quotation.createdAt));
      setStateSelected(new Set([response.quotation.state]));
      setPartsAdded(
        response.quotation.quotationParts.map(
          (part: PartAdded) =>
            ({
              id: part.id,
              partId: part.part.id,
              part: part.part,
              quantity: part.quantity,
              unitPrice: Number(part.unitPrice),
              totalPrice: Number(part.totalPrice),
            } as PartAdded)
        )
      );
    };
    fetchQuotation();
  }, [reload, quotationId]);

  const handleSearchPart = async (partNumber: string) => {
    const data = await getPartByNumber(partNumber);
    setPartsFound(data.parts);
  };

  const handleAddPart = (part: Part) => {
    if (errorPartsAdded) {
      setErrorPartsAdded(null);
    }
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

  const handleSubmit = async () => {
    setIsLoading(true);
    if (partsAdded.length === 0) {
      setErrorPartsAdded("Agrega al menos una parte");
      setIsLoading(false);
      return;
    }
    const response = await updateClientQuotation(
      quotationId,
      Array.from(stateSelected)[0] as string,
      partsAdded
    );
    if (response?.status === 200) {
      navigate("/dashboard/client-quotes");
      addToast({
        title: "Cotización actualizada",
        description: "La cotización ha sido actualizada correctamente",
        color: "success",
        timeout: 3000,
      });
    }
    setIsLoading(false);
  };

  return (
    <main className="flex flex-col gap-3 w-full h-full overflow-hidden">
      <div className="flex justify-between w-full">
        <Button
          onPress={() => navigate("/dashboard/client-quotes")}
          isIconOnly
          variant="light"
          color="primary"
        >
          <ArrowLeftIcon />
        </Button>
        <Button
          onPress={() => {
            quotation?.isInternational ? 
            generateQuotationPDF(quotation as ClientQuotation, partsAdded) : generateLocalQuotationPDF(quotation as ClientQuotation, partsAdded);
          }}
          color="default"
          variant="bordered"
        >
          Generar PDF
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          Detalles cotización: {quotation?.code}
        </h1>
        <div className="hidden md:flex gap-2">
          {quotation?.isInternational ? (
            <ImportCosts
              clientQuotation={quotation as ClientQuotation}
              reload={reload}
              setReload={setReload}
            />
          ) : (
            <LocalCosts
              quotation={quotation as ClientQuotation}
              reload={reload}
              setReload={setReload}
            />
          )}
          <Button
            onPress={handleSubmit}
            isLoading={isLoading}
            variant="solid"
            color="primary"
            className="w-full px-8"
          >
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:grid md:grid-cols-2 gap-4 h-full overflow-hidden">
        <section className="flex flex-col gap-4 h-fit">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de emisión"
              labelPlacement="outside"
              variant="bordered"
              isReadOnly
              value={date}
            />
            <Select
              label="Estado"
              labelPlacement="outside"
              placeholder="Selecciona el nuevo estado"
              variant="bordered"
              selectedKeys={stateSelected}
              onSelectionChange={setStateSelected}
              disallowEmptySelection={true}
            >
              {states.map((state) => (
                <SelectItem key={state.key}>{state.value}</SelectItem>
              ))}
            </Select>
          </div>
          <Input
            label="Tipo de compra"
            labelPlacement="outside"
            variant="bordered"
            isReadOnly
            value={quotation?.isInternational ? "Importación" : "Local"}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cliente"
              labelPlacement="outside"
              variant="bordered"
              isReadOnly
              value={quotation?.client.name}
            />
            <Input
              label="Solicitante"
              labelPlacement="outside"
              variant="bordered"
              isReadOnly
              value={quotation?.requesterName}
            />
          </div>
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
          {partsFound.length > 0 && partNumber !== "" && (
            <div className="flex flex-col gap-2 overflow-y-auto">
              {partsFound.map((part) => (
                <PartFound
                  key={part.id}
                  part={part}
                  onAddPart={handleAddPart}
                />
              ))}
            </div>
          )}
        </section>
        <section className="flex flex-col gap-4 h-full overflow-hidden">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Desglose de costos</p>
            {partsAdded && partsAdded.length > 0 && (
              <p className="text-sm">
                Subtotal partes:{" "}
                {partsAdded
                  .reduce((acc, part) => acc + (part.totalPrice || 0), 0)
                  .toLocaleString("es-CO", {
                    style: "currency",
                    currency: quotation?.currency || "USD",
                    minimumFractionDigits: 0,
                  })}
              </p>
            )}
            {quotation &&
            quotation.isInternational &&
            quotation.cifTotal &&
            quotation.subtotal &&
            quotation.subtotalWithMarkup ? (
              <>
                <p className="text-sm">
                  Total CIF:{" "}
                  {quotation.cifTotal.toLocaleString("es-CO", {
                    style: "currency",
                    currency: quotation.currency || "USD",
                    minimumFractionDigits: 0,
                  })}
                </p>
                <p className="text-sm">
                  Subtotal con Ganancia:{" "}
                  {quotation.subtotalWithMarkup.toLocaleString("es-CO", {
                    style: "currency",
                    currency: quotation.currency || "USD",
                    minimumFractionDigits: 0,
                  })}
                </p>
                <p className="text-sm">
                  IVA (19%):{" "}
                  {quotation.ivaAmount?.toLocaleString("es-CO", {
                    style: "currency",
                    currency: quotation.currency || "USD",
                    minimumFractionDigits: 0,
                  })}
                </p>
                <p className="text-sm">
                  Total:{" "}
                  {Number(quotation.totalPrice).toLocaleString("es-CO", {
                    style: "currency",
                    currency: quotation.currency || "USD",
                    minimumFractionDigits: 0,
                  })}{" "}
                  ~{" "}
                  {quotation.totalPrice
                    ? (
                        quotation.totalPrice * (quotation.exchangeRate || 1)
                      ).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                        minimumFractionDigits: 0,
                      })
                    : "N/A"}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm">
                  Subtotal:{" "}
                  {quotation?.subtotal?.toLocaleString("es-CO", {
                    style: "currency",
                    currency: quotation?.currency || "USD",
                    minimumFractionDigits: 0,
                  })}
                </p>
                <p className="text-sm">
                  IVA (19%):{" "}
                  {quotation?.ivaAmount?.toLocaleString("es-CO", {
                    style: "currency",
                    currency: quotation?.currency || "USD",
                    minimumFractionDigits: 0,
                  })}
                </p>
                <p className="text-sm">
                  Total:{" "}
                  {Number(quotation?.totalPrice).toLocaleString("es-CO", {
                    style: "currency",
                    currency: quotation?.currency || "USD",
                    minimumFractionDigits: 0,
                  })}{" "}
                </p>
              </>
            )}
          </div>
          <div className="flex flex-col gap-2 h-full overflow-hidden">
            <p className="text-sm">Partes agregadas:</p>
            <div className="flex flex-col gap-2 h-full overflow-y-auto">
              {partsAdded.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {partsAdded.map((part) => (
                    <QuotePart
                      key={part.part.id}
                      part={part.part}
                      partAdded={part}
                      quotationPartQuantity={part.quantity}
                      quotationPartUnitPrice={part.unitPrice}
                      onRemovePart={handleRemovePart}
                      onQuantityChange={handleQuantityChange}
                      onPriceUnitChange={handlePriceUnitChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col w-full items-center justify-center">
                  {errorPartsAdded ? (
                    <p className="text-danger text-xs">{errorPartsAdded}</p>
                  ) : (
                    <p className="text-zinc-500 text-xs">
                      No hay partes agregadas
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <div className="flex md:hidden w-full gap-2">
        {quotation?.isInternational ? (
          <ImportCosts
            clientQuotation={quotation as ClientQuotation}
            reload={reload}
            setReload={setReload}
          />
        ) : (
          <LocalCosts
            quotation={quotation as ClientQuotation}
            reload={reload}
            setReload={setReload}
          />
        )}
        <Button
          onPress={handleSubmit}
          isLoading={isLoading}
          variant="solid"
          color="primary"
          className="w-full"
        >
          {isLoading ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </main>
  );
};
