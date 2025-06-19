import { useEffect, useState } from "react";
import type { ClientQuotation } from "../../Clases";
import { getClientQuotations } from "../../services/clientQuotationService";
import { ClientQuotationRow } from "../../components/ClientQuotationRow";
import { Button, Input } from "@heroui/react";
import { PlusIcon, SearchIcon } from "../part/Parts";
import { useNavigate } from "react-router";

export const ClientQuotations = () => {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState<ClientQuotation[]>([]);
  const [filteredQuotations, setFilteredQuotations] = useState<
    ClientQuotation[]
  >([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchQuotations = async () => {
      const data = await getClientQuotations();
      setQuotations(data.quotations);
    };
    fetchQuotations();
  }, []);

  useEffect(() => {
    if (search === "") {
      setFilteredQuotations(quotations);
    } else {
      setFilteredQuotations(
        quotations.filter(
          (quotation) =>
            quotation.client.name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            quotation.code.toLowerCase().includes(search.toLowerCase()) ||
            quotation.state.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, quotations]);

  return (
    <main className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold">Cotizaciones de clientes</h1>
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
        {filteredQuotations.length > 0 ? (
          <>
            <div className="grid grid-cols-[25%_1fr_1fr] md:grid-cols-4 gap-3 border-y-1 p-2 w-full text-sm font-semibold border-zinc-200 bg-zinc-100 sticky top-0 z-10">
              <p>Código</p>
              <p>Cliente</p>
              <p className="hidden md:block">Fecha</p>
              <p>Estado</p>
            </div>
            <div className="flex flex-col w-full h-full overflow-y-auto">
              {filteredQuotations.map((quotation) => (
                <ClientQuotationRow key={quotation.id} quotation={quotation} />
              ))}
            </div>
          </>
        ) : (
          <div className="col-span-full flex items-center justify-center">
            <p className="text-zinc-500 text-sm font-light">
              No hay cotizaciones disponibles
            </p>
          </div>
        )}
      </div>
    </main>
  );
};
