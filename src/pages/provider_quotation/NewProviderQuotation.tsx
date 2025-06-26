import { addToast, Autocomplete, AutocompleteItem, Button, Input, Radio, RadioGroup } from "@heroui/react"
import { SearchIcon } from "../part/Parts"
import { SelectorIcon } from "../client_quotation/NewClientQuotation"
import { useEffect, useState, type Key } from "react"
import type { ClientQuotation, Provider } from "../../Clases"
import { fetchProviders } from "../../services/providerService"
import { getClientQuotationByCode } from "../../services/clientQuotationService"
import { ClientQuotationFound } from "../../components/ClientQuotationFound"
import { ClientQuotationAdded } from "../../components/ClientQuotationAdded"
import { useNavigate } from "react-router"
import { createProviderQuotation } from "../../services/providerQuotationService"

// export interface QuotationFound {
//   quotation: ClientQuotation
//   totalPrice: number
// }

export interface QuotationAdded {
  id?: number,
  clientQuotationId: number
  clientQuotation?: ClientQuotation
  providerQuotationId?: string
}

export const NewProviderQuotation = () => {
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null)
  const [quotationCode, setQuotationCode] = useState<string>("")
  const [quotationFound, setQuotationFound] = useState<ClientQuotation | null>(null)
  const [quotationsAdded, setQuotationsAdded] = useState<QuotationAdded[]>([])
  const [quotationType, setQuotationType] = useState<string>("")
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getProviders = async () => {
      const response = await fetchProviders()
      setProviders(response.providers)
    }
    getProviders()
  }, [])

  const handleSelectionChange = (key: Key | null) => {
    if (!key) {
      setSelectedProvider(null);
    } else {
      setSelectedProvider(key as number);
    }
  };

  const handleClientQuotation = async (quotationCode: string) => {
    const response = await getClientQuotationByCode(quotationCode);
    console.log("Quotation response:", response);
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
      clientQuotation: quotationFound
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
    const response = await createProviderQuotation(
      selectedProvider as number,
      quotationType,
      quotationsAdded
    )
    if (response?.status === 201) {
      addToast({
        title: "Cotización creada",
        description: "La cotización ha sido creada exitosamente.",
        color: "success",
        timeout: 3000,
      });
      navigate("/dashboard/provider-quotes");
    }
    setIsLoading(false);
  }

  return <main className="flex flex-col gap-4 h-full overflow-hidden">
    <div className="flex items-center justify-between w-full">
      <h1 className="text-xl font-semibold">Crear nueva cotización</h1>
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
          variant="solid"
          color="primary"
          className="w-full px-8"
          onPress={handleSubmit}
        >
          {isLoading ? "Creando..." : "Crear cotización"}
        </Button>
      </div>
    </div>
    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6 w-full h-full overflow-hidden">
      <section className="flex flex-col gap-4 md:gap-6 w-full h-fit">
        <RadioGroup value={quotationType} onValueChange={setQuotationType} orientation="horizontal" isRequired label="Tipo de cotización" classNames={{
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
        <Autocomplete
          label="Proveedor"
          labelPlacement="outside"
          placeholder="Buscar proveedor"
          defaultItems={providers}
          description={
            <>
              <p>
                No encuentras el proveedor?, da clic en el texto subrayado{" "}
                <a
                  className="text-blue-500 underline"
                  href="http://localhost:5173/dashboard/clients-and-providers"
                  target="_blank"
                >
                  Crear nuevo proveedor
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
          {(provider) => (
            <AutocompleteItem key={provider.id}>{provider.name}</AutocompleteItem>
          )}
        </Autocomplete>
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
                <ClientQuotationAdded key={quotation.clientQuotationId} quotation={quotation.clientQuotation as ClientQuotation} onRemoveQuotation={handleRemoveQuotation} />
              ))
            }
          </div>
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
          {isLoading ? "Creando..." : "Crear cotización"}
        </Button>
      </div>
    </div>
  </main>
}