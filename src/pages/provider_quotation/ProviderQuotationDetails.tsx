import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { generatePurchaseOrder, getProviderQuotationById, updateProviderQuotation } from "../../services/providerQuotationService";
import type { ClientQuotation, ProviderQuotation } from "../../Clases";
import { addToast, Button, Input, Radio, RadioGroup, Select, type Selection, SelectItem } from "@heroui/react";
import { SearchIcon } from "../part/Parts";
import type { QuotationAdded } from "./NewProviderQuotation";
import { getClientQuotationByCode } from "../../services/clientQuotationService";
import { ClientQuotationFound } from "../../components/ClientQuotationFound";
import { states } from "../client_quotation/ClientQuotationDetails";
import { formatDate } from "../../components/ClientQuotationRow";
import { ClientQuotationAdded } from "../../components/ClientQuotationAdded";

export const ProviderQuotationDetails = () => {
  const quotationId = useLocation().pathname.split("/").pop()!;
  const [purchaseOrderGenerated, setPurchaseOrderGenerated] = useState(false);
  const [date, setDate] = useState<string>("");
  const [quotation, setQuotation] = useState<ProviderQuotation | null>(null);
  const [quotationCode, setQuotationCode] = useState<string>("")
  const [quotationFound, setQuotationFound] = useState<ClientQuotation | null>(null)
  const [quotationsAdded, setQuotationsAdded] = useState<QuotationAdded[]>([])
  const [quotationType, setQuotationType] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false);
  const [stateSelected, setStateSelected] = useState<Selection>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuotationDetails = async () => {
      const response = await getProviderQuotationById(quotationId);
      setDate(formatDate(response.quotation.createdAt));
      setPurchaseOrderGenerated(response.purchaseOrderExists);
      setStateSelected(new Set([response.quotation.state]));
      setQuotation(response.quotation);
      setQuotationType(response.quotation.quotationType)
      setQuotationsAdded(
        response.quotation.quotations.map(
          (quotation: QuotationAdded) => ({
            id: quotation.id,
            clientQuotationId: quotation.clientQuotationId,
            clientQuotation: quotation.clientQuotation
          } as QuotationAdded)
        )
      );
    };
    fetchQuotationDetails();
  }, [quotationId]);

  const handleClientQuotation = async (quotationCode: string) => {
    const response = await getClientQuotationByCode(quotationCode);;
    setQuotationFound(response.quotation);
  }

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
    if (quotationsAdded.some(q => q.clientQuotationId === quotationFound.id)) {
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
        description: "Solo se pueden agregar cotizaciones aceptadas, por favor verifica el estado de la cotización.",
        color: "warning",
        timeout: 3000,
      });
      return;
    }
    const newQuotation = {
      clientQuotationId: quotationFound.id,
      clientQuotation: quotationFound,
      providerQuotationId: quotationId,
    }
    setQuotationsAdded([...quotationsAdded, newQuotation]);
    setQuotationFound(null);
    setQuotationCode("");
  }

  const handleRemoveQuotation = (clientQuotationId: number) => {
    setQuotationsAdded(quotationsAdded.filter(q => q.clientQuotationId !== clientQuotationId));
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await updateProviderQuotation(
      quotationId,
      Array.from(stateSelected)[0] as string,
      quotationsAdded
    );
    if (response && response.status === 200) {
      addToast({
        title: "Cotización actualizada",
        description: "La cotización ha sido actualizada correctamente.",
        color: "success",
        timeout: 3000,
      });
      navigate("/dashboard/provider-quotes");
    }
    setIsLoading(false)
  }

  const handleGeneratePurchaseOrder = async () => {
    setIsLoading(true);
    const response = await generatePurchaseOrder(quotationId);
    if (response && response.status === 200) {
      addToast({
        title: "Orden de compra generada",
        description: "La orden de compra ha sido generada correctamente.",
        color: "success",
        timeout: 3000,
      });
      navigate("/dashboard/provider-quotes");
    }
    setIsLoading(false);
  }

  const buttonContent = (state: string) => {
    if (state === "Aceptada" && quotation?.state === "Aceptada") {
      if (isLoading) {
        return "Generando OC...";
      }
      return "Generar OC";
    }
    if (isLoading) {
      return "Guardando cambios...";
    }
    return "Guardar cambios";
  }

  return (
    <main className="flex flex-col gap-4 h-full overflow-hidden">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold">Detalles de cotización: {quotation?.code}</h1>
        <div className="hidden md:flex gap-2">
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
            isDisabled={quotation?.state === "Aceptada" && purchaseOrderGenerated}
            variant="solid"
            color="primary"
            className="w-full px-8"
            onPress={() => {
              if (Array.from(stateSelected)[0] === "Aceptada" && !purchaseOrderGenerated) {
                handleGeneratePurchaseOrder();
                return
              }
              handleSubmit();
            }}
          >
            {buttonContent(Array.from(stateSelected)[0] as string)}
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 w-full h-full overflow-hidden">
        <section className="flex flex-col gap-4 md:gap-6 w-full h-fit">
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <Input
              label="Fecha de emisión"
              labelPlacement="outside"
              variant="bordered"
              isReadOnly
              value={date}
            />
            <Select
              label="Estado"
              isDisabled={quotation?.state === "Aceptada" && purchaseOrderGenerated}
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
          <RadioGroup isReadOnly value={quotationType} onValueChange={setQuotationType} orientation="horizontal" isRequired label="Tipo de cotización" classNames={{
            label: "text-sm text-zinc-950",
            base: "flex flex-col gap-4",
            wrapper: "grid grid-cols-2 gap-6 md:gap-4 w-[95%] md:w-full ml-2 mb-2"
          }}>
            <Radio classNames={{
              label: "text-sm md:text-base",
              base: "flex flex-row-reverse justify-between h-20 min-w-full border-1 gap-2 rounded-lg border-default data-[selected=true]:border-primary data-[selected=true]:border-2",
              description: "text-xs text-zinc-500",
            }} value={"Exterior"} size="lg" description="Compra por fuera del pais">Exterior</Radio>
            <Radio classNames={{
              label: "text-sm md:text-base",
              base: "flex flex-row-reverse justify-between h-20 min-w-full border-1 rounded-lg border-default data-[selected=true]:border-primary data-[selected=true]:border-2",
              description: "text-xs text-zinc-500",
            }} value={"Local"} size="lg" description="Compra dentro del pais">Local</Radio>
          </RadioGroup>
          <Input
            label="Proveedor"
            labelPlacement="outside"
            variant="bordered"
            isReadOnly
            value={quotation?.provider.name}
          />
          <Input
            value={quotationCode}
            onChange={(e) => setQuotationCode(e.target.value)}
            label="Cotización de cliente"
            labelPlacement="outside"
            variant="bordered"
            placeholder="Busca por número de cotización"
            startContent={<SearchIcon />}
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
          {
            quotationFound && quotationCode !== "" && (
              <ClientQuotationFound quotationFound={quotationFound} onAddQuotation={handleAddQuotation} />
            )
          }
        </section>
        <section className="flex flex-col gap-4 md:gap-6 w-full h-fit overflow-hidden">
          <div className="flex flex-col gap-2 h-full overflow-hidden">
            <p className="text-sm">Cotizaciones agregadas</p>
            <p className="font-semibold">
              Total: ${quotationsAdded.reduce((total, quotation) => total + (quotation.clientQuotation?.totalPrice || 0), 0)}
            </p>
            <div className="flex flex-col gap-2 h-full overflow-y-auto">
              {
                quotationsAdded.map((quotation) => (
                  <ClientQuotationAdded key={quotation.clientQuotationId} id={quotation.id} quotation={quotation.clientQuotation as ClientQuotation} onRemoveQuotation={handleRemoveQuotation} />
                ))
              }
            </div>
          </div>
        </section>
      </div>
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
          isDisabled={quotation?.state === "Aceptada" && purchaseOrderGenerated}
          variant="solid"
          color="primary"
          className="w-full"
          onPress={() => {
            if (Array.from(stateSelected)[0] === "Aceptada" && quotation?.state === "Aceptada" && !purchaseOrderGenerated) {
              handleGeneratePurchaseOrder();
              return
            }
            handleSubmit();
          }}
        >
          {buttonContent(Array.from(stateSelected)[0] as string)}
        </Button>
      </div>
    </main>
  );
}