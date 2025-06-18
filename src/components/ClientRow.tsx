import type { Client } from "../Clases";

interface ClientRowProps {
  client: Client;
}

export const ClientRow = ({ client }: ClientRowProps) => {
  return (
    <div
      className="grid grid-cols-3 md:grid-cols-4 gap-3 border-y-1 p-2 w-full text-sm border-zinc-200"
      key={client.id}
    >
      <h1>{client.name}</h1>
      <p>{client.company}</p>
      <p className="truncate">{client.email}</p>
      <p>{client.phone}</p>
    </div>
  );
};
