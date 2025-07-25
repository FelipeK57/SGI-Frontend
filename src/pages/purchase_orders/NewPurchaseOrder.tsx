import {
  addToast,
  Autocomplete,
  AutocompleteItem,
  Button,
  Input,
} from "@heroui/react";
import { SearchIcon } from "../part/Parts";
import {
  SelectorIcon,
  type PartAdded,
} from "../client_quotation/NewClientQuotation";
import { useEffect, useState, type Key } from "react";
import type { ClientQuotation, Part, Provider } from "../../Clases";
import { fetchProviders } from "../../services/providerService";
import { getClientQuotationByCode } from "../../services/clientQuotationService";
import { ClientQuotationFound } from "../../components/ClientQuotationFound";
import { ClientQuotationAdded } from "../../components/ClientQuotationAdded";
import { useNavigate } from "react-router";
import { getPartByNumber } from "../../services/partService";
import { PartFound } from "../../components/PartFound";
import { QuotePart } from "../../components/QuotePart";
import { createPurchaseOrder } from "../../services/purchaseOrderService";
// import { createProviderQuotation } from "../../services/providerQuotationService";

export interface QuotationAdded {
  id?: number;
  clientQuotationId: number;
  clientQuotation?: ClientQuotation;
  providerQuotationId?: string;
}

export const NewPurchaseOrder = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [quotationCode, setQuotationCode] = useState<string>("");
  const [quotationFound, setQuotationFound] = useState<ClientQuotation | null>(
    null
  );
  const [quotationsAdded, setQuotationsAdded] = useState<QuotationAdded[]>([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [sumTotal, setSumTotal] = useState(0);
  const [partNumber, setPartNumber] = useState("");
  const [partsFound, setPartsFound] = useState<Part[]>([]);
  const [partsAdded, setPartsAdded] = useState<PartAdded[]>([]);

  const [errors, setErrors] = useState({
    errorProvider: null as string | null,
    errorQuotationsAdded: null as string | null,
  });

  useEffect(() => {
    const getProviders = async () => {
      const response = await fetchProviders();
      setProviders(response.providers);
    };
    getProviders();
  }, []);

  const handleSearchPart = async (partNumber: string) => {
    const data = await getPartByNumber(partNumber);
    setPartsFound(data.parts);
    if (data.parts.length === 0) {
      addToast({
        title: "Parte no encontrada",
        description: "No se encontraron partes con ese número",
        color: "warning",
        timeout: 3000,
      });
    }
  };

  const handleSelectionChange = (key: Key | null) => {
    if (!key) {
      setSelectedProvider(null);
    } else {
      if (errors.errorProvider) {
        setErrors((prev) => ({ ...prev, errorProvider: null }));
      }
      setSelectedProvider(key as number);
    }
  };

  const handleClientQuotation = async (quotationCode: string) => {
    const response = await getClientQuotationByCode(quotationCode);
    setQuotationFound(response.quotation);
  };

  useEffect(() => {
    if (quotationCode === "") {
      setQuotationFound(null);
    }
  }, [quotationCode]);

  const handleAddQuotation = (quotationFound: ClientQuotation) => {
    if (quotationFound.id === undefined) {
      console.error("Quotation ID is undefined");
      return;
    }
    if (errors.errorQuotationsAdded) {
      setErrors((prev) => ({ ...prev, errorQuotationsAdded: null }));
    }
    if (
      quotationsAdded.some((q) => q.clientQuotationId === quotationFound.id)
    ) {
      addToast({
        title: "Cotización ya agregada",
        description: "Esta cotización ya ha sido agregada.",
        color: "warning",
        timeout: 3000,
      });
      return;
    }
    if (quotationFound.state !== "Aceptada") {
      addToast({
        title: "Estado de cotización no válido",
        description:
          "Solo se pueden agregar cotizaciones aceptadas, por favor verifica el estado de la cotización.",
        color: "warning",
        timeout: 3000,
      });
      return;
    }
    if (
      quotationsAdded.some((q) => q.clientQuotation?.isInternational) &&
      !quotationFound.isInternational
    ) {
      addToast({
        title: "No se puede agregar la cotización",
        description:
          "Una orden de compra no puede contener cotizaciones locales e importaciones al mismo tiempo.",
        color: "warning",
        timeout: 3000,
      });
      return;
    }
    const newQuotation = {
      clientQuotationId: quotationFound.id,
      clientQuotation: quotationFound,
    };
    setQuotationsAdded([...quotationsAdded, newQuotation]);
    setSumTotal(sumTotal + (Number(quotationFound.totalPrice) ?? 0));
    setQuotationFound(null);
    setQuotationCode("");
  };

  const handleRemoveQuotation = (clientQuotationId: number) => {
    setQuotationsAdded(
      quotationsAdded.filter((q) => q.clientQuotationId !== clientQuotationId)
    );
    setSumTotal(
      sumTotal -
        Number(
          quotationsAdded.find((q) => q.clientQuotationId === clientQuotationId)
            ?.clientQuotation?.totalPrice ?? 0
        )
    );
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

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log("Submitting Purchase Order");
    console.log("Selected Provider:", selectedProvider);
    console.log("Quotations Added:", quotationsAdded);
    console.log("Parts Added:", partsAdded);
    if (selectedProvider === null) {
      setErrors((prev) => ({
        ...prev,
        errorProvider: "Debe seleccionar un proveedor.",
      }));
    }

    if (quotationsAdded.length === 0) {
      setErrors((prev) => ({
        ...prev,
        errorQuotationsAdded: "Debe agregar al menos una cotización.",
      }));
    }

    if (selectedProvider === null || quotationsAdded.length === 0) {
      setIsLoading(false);
      return;
    }
    
    const data: any = {
      providerId: selectedProvider,
      quotations: quotationsAdded,
      parts: partsAdded,
      quotationType: quotationsAdded.some(
        (q) => q.clientQuotation?.isInternational
      )
        ? "Importación"
        : "Local",
    };

    const response = await createPurchaseOrder(data);
    if (response?.status === 201) {
      addToast({
        title: "Cotización creada",
        description: "La cotización ha sido creada exitosamente.",
        color: "success",
        timeout: 3000,
      });
      navigate("/dashboard/purchase-orders");
    }
    setIsLoading(false);
  };

  return (
    <main className="flex flex-col gap-4 h-full overflow-hidden">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold">Crear orden de compra</h1>
        <div className="hidden md:flex gap-2">
          <Button
            className="w-full"
            onPress={() => navigate("/dashboard/purchase-orders")}
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
            {isLoading ? "Creando..." : "Crear OC"}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 w-full h-full overflow-hidden">
        <section className="flex flex-col gap-4 md:gap-6 w-full h-fit">
          <Autocomplete
            label="Proveedor"
            labelPlacement="outside"
            placeholder="Buscar proveedor"
            defaultItems={providers}
            variant="bordered"
            startContent={<SearchIcon />}
            selectorIcon={<SelectorIcon />}
            isRequired
            onSelectionChange={handleSelectionChange}
            isInvalid={!!errors.errorProvider}
            errorMessage={errors.errorProvider}
          >
            {(provider) => (
              <AutocompleteItem key={provider.id}>
                {provider.name}
              </AutocompleteItem>
            )}
          </Autocomplete>
          <Input
            value={quotationCode}
            onChange={(e) => {
              setQuotationCode(e.target.value);
              setErrors((prev) => ({ ...prev, errorQuotationsAdded: null }));
            }}
            label="Cotización de cliente"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Busca por número de cotización"
            startContent={<SearchIcon />}
            isInvalid={!!errors.errorQuotationsAdded}
            errorMessage={"Busca una cotización por su código"}
            classNames={{
              inputWrapper: "pr-1",
            }}
            endContent={
              <Button
                variant="light"
                size="sm"
                color="primary"
                onPress={() => handleClientQuotation(quotationCode)}
              >
                Buscar
              </Button>
            }
          />
          {quotationFound && quotationCode !== "" && (
            <ClientQuotationFound
              quotationFound={quotationFound}
              onAddQuotation={handleAddQuotation}
            />
          )}
          <div className="flex gap-2 items-end">
            <Input
              value={partNumber}
              onChange={(e) => setPartNumber(e.target.value)}
              label="Parte para stock"
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
        </section>
        <section className="flex flex-col gap-4 md:gap-6 w-full h-fit overflow-hidden">
          <div className="flex flex-col gap-2 h-full overflow-hidden">
            <p className="font-semibold">
              Total: $ {sumTotal.toLocaleString()}
            </p>
            <p className="text-sm">Cotizaciones agregadas</p>
            {quotationsAdded.length > 0 ? (
              <div className="flex flex-col gap-2 h-full overflow-y-auto">
                {quotationsAdded.map((quotation) => (
                  <ClientQuotationAdded
                    key={quotation.clientQuotationId}
                    quotation={quotation.clientQuotation as ClientQuotation}
                    onRemoveQuotation={handleRemoveQuotation}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col w-full items-center justify-center">
                {errors.errorQuotationsAdded ? (
                  <p className="text-danger text-xs">
                    {errors.errorQuotationsAdded}
                  </p>
                ) : (
                  <p className="text-zinc-500 text-xs">
                    No hay cotizaciones agregadas
                  </p>
                )}
              </div>
            )}
            <p className="text-sm">Partes para stock agregadas:</p>
            {partsAdded && partsAdded.length > 0 ? (
              <div className="flex flex-col gap-2 h-full overflow-y-auto">
                {partsAdded.map((part) => (
                  <QuotePart
                    key={part.part.id}
                    part={part.part}
                    onRemovePart={handleRemovePart}
                    onQuantityChange={handleQuantityChange}
                    onPriceUnitChange={handlePriceUnitChange}
                    notEditable={true}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col w-full items-center justify-center">
                <p className="text-zinc-500 text-xs">No hay partes agregadas</p>
              </div>
            )}
          </div>
        </section>
        <div className="flex md:hidden w-full gap-2">
          <Button
            className="w-full"
            onPress={() => navigate("/dashboard/provider-quotes")}
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
            {isLoading ? "Creando..." : "Crear OC"}
          </Button>
        </div>
      </div>
    </main>
  );
};
