import { useEffect, useState } from "react";
import type { Client } from "../../Clases";
import { fetchClients } from "../../services/clientService";
import { ClientRow } from "../../components/ClientRow";

export const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const getClients = async () => {
      const response = await fetchClients();
      setClients(response.clients);
    };
    getClients();
  }, []);

  return (
    <main className="w-full h-full">
      <div className="flex flex-col w-full h-full">
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 border-y-1 p-2 w-full text-sm font-semibold border-zinc-200 bg-zinc-50 sticky top-0 z-10">
          <p>Nombre</p>
          <p>Empresa</p>
          <p>Email</p>
          <p>Teléfono</p>
        </div>
        <div className="flex flex-col w-full h-full overflow-y-auto">
          {clients.map((client) => (
            <ClientRow client={client} key={client.id} />
          ))}
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
          <ClientRow
            client={{
              id: 1,
              name: "Juan Perez",
              company: "Empresa 1",
              email: "juan.perez@gmail.com",
              phone: "1234567890",
            }}
          />
        </div>
      </div>
    </main>
  );
};
