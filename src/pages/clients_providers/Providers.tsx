import { useEffect, useState } from "react";
import { fetchProviders } from "../../services/providerService";
import { ProviderRow } from "../../components/ProviderRow";
import type { Provider } from "../../Clases";
import { Input } from "@heroui/react";
import { SearchIcon } from "../part/Parts";

export const Providers = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providersFiltered, setProvidersFiltered] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getProviders = async () => {
      const response = await fetchProviders();
      setProviders(response.providers);
    };
    getProviders();
  }, []);

  useEffect(() => {
    if (search === "") {
      setProvidersFiltered(providers);
    } else {
      const filteredProviders = providers.filter(
        (provider) =>
          provider.name.toLowerCase().includes(search.toLowerCase()) ||
          provider.email?.toLowerCase().includes(search.toLowerCase()) ||
          provider.phone?.toLowerCase().includes(search.toLowerCase())
      );
      setProvidersFiltered(filteredProviders);
    }
  }, [providers, search]);

  return (
    <div className="flex flex-col gap-4 h-full">
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
          <div className="grid grid-cols-[30%_1fr] md:grid-cols-3 gap-3 border-y-1 p-2 w-full text-sm font-semibold border-zinc-200 bg-zinc-100 sticky top-0 z-10">
            <p>Nombre</p>
            <p>Email</p>
            <p className="hidden md:block">Teléfono</p>
          </div>
          <div className="flex flex-col w-full h-full overflow-y-auto">
            {providersFiltered.map((provider) => (
              <ProviderRow
                provider={provider}
                key={provider.id}
                reload={reload}
                setReload={setReload}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
