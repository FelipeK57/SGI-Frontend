import { useEffect, useState } from "react";
import type { Client } from "../../Clases";
import { fetchClients } from "../../services/clientService";
import { ClientRow } from "../../components/ClientRow";
import { SearchIcon } from "../part/Parts";
import { Input } from "@heroui/react";
import { useReload } from "../../context/ClientProviderContext";

export const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [clientsFiltered, setClientsFiltered] = useState<Client[]>([]);
  // const [reload, setReload] = useState(false);
  const { reload, setReload } = useReload();

  useEffect(() => {
    const getClients = async () => {
      const response = await fetchClients();
      setClients(response.clients);
    };
    getClients();
  }, [reload]);

  useEffect(() => {
    if (search === "") {
      setClientsFiltered(clients);
    } else {
      const filteredClients = clients.filter(
        (client) =>
          client.name.toLowerCase().includes(search.toLowerCase()) ||
          client.company?.toLowerCase().includes(search.toLowerCase()) ||
          client.email?.toLowerCase().includes(search.toLowerCase()) ||
          client.phone?.toLowerCase().includes(search.toLowerCase())
      );
      setClientsFiltered(filteredClients);
    }
  }, [clients, search]);

  return (
    <div className="flex flex-col gap-4">
      <Input
        onChange={(e) => setSearch(e.target.value)}
        type="search"
        className="w-full md:max-w-xs"
        startContent={<SearchIcon />}
        variant="bordered"
        placeholder="Buscar"
      />
      <main className="w-full h-full">
        <div className="flex flex-col w-full h-full">
          {clientsFiltered.length > 0 ? (
            <>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 border-y-1 p-2 w-full text-sm font-semibold border-zinc-200 bg-zinc-100 sticky top-0 z-10">
                <p>Nombre</p>
                <p>Empresa</p>
                <p>Email</p>
                <p className="hidden md:block">Teléfono</p>
              </div>
              <div className="flex flex-col w-full h-full overflow-y-auto">
                {clientsFiltered.map((client) => (
                  <ClientRow
                    client={client}
                    key={client.id}
                    reload={reload}
                    setReload={setReload}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col w-full h-full overflow-y-auto items-center justify-center">
              <p className="text-zinc-500 text-sm font-light">
                No hay clientes disponibles
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
