import { Button, Input } from "@heroui/react";
import { useNavigate } from "react-router";
import { PlusIcon, SearchIcon } from "../part/Parts";
import { useEffect, useState } from "react";
import { getProviderQuotations } from "../../services/providerQuotationService";
import type { ProviderQuotation } from "../../Clases";
import { ProviderQuotationRow } from "../../components/ProviderQuotationRow";

export const ProviderQuotations = () => {
  const [providerQuotations, setProviderQuotations] = useState<ProviderQuotation[]>([]);
  const [providerQuotationsFiltered, setProviderQuotationsFiltered] = useState<ProviderQuotation[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getProviderQuotations()
      setProviderQuotations(response.quotations);
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (search === "") {
      setProviderQuotationsFiltered(providerQuotations);
    } else {
      setProviderQuotationsFiltered(
        providerQuotations.filter(
          (quotation) =>
            quotation.provider.name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            quotation.code.toLowerCase().includes(search.toLowerCase()) ||
            quotation.state.toLowerCase().includes(search.toLowerCase()) || quotation.quotationType.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, providerQuotations]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold">Cotizaciones de proveedores</h1>
        <div className="block sm:hidden">
          <Button onPress={() => navigate("new")} isIconOnly color="primary">
            <PlusIcon />
          </Button>
        </div>
        <div className="hidden sm:flex sm:justify-end">
          <Button onPress={() => navigate("new")} color="primary">
            Registrar nueva cotización
          </Button>
        </div>
      </div>
      <div className="flex items-center">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          placeholder="Buscar"
          className="w-full md:max-w-xs"
          variant="bordered"
          startContent={<SearchIcon />}
        />
      </div>
      <div className="flex flex-col overflow-y-auto h-full">
        {
          providerQuotationsFiltered.length > 0 ? (
            <>
              <div className="grid grid-cols-[30%_1fr_1fr] md:grid-cols-5 gap-4 border-y-1 p-2 w-full text-sm font-semibold border-zinc-200 bg-zinc-100 sticky top-0 z-10">
                <p>Código</p>
                <p>Proveedor</p>
                <p className="hidden md:block">Fecha</p>
                <p>Estado</p>
                <p className="hidden md:block">Tipo de compra</p>
              </div>
              <div className="flex flex-col">
                {
                  providerQuotationsFiltered.map((quotation) => (
                    <ProviderQuotationRow key={quotation.id} quotation={quotation} />
                  ))
                }
              </div>
            </>
          ) : (
            <div className="col-span-full flex items-center justify-center">
              <p className="text-zinc-500 text-sm font-light">
                No hay cotizaciones disponibles
              </p>
            </div>
          )
        }
      </div>
    </div>
  );
};
