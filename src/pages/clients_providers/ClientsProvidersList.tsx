import { Button, Input } from "@heroui/react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { PlusIcon, SearchIcon } from "../part/Parts";

export const ClientsProvidersList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isClients =
    location.pathname === "/dashboard/clients-and-providers/clients";
  const isProviders =
    location.pathname === "/dashboard/clients-and-providers/providers";

  return (
    <main className="flex flex-col gap-4 h-full">
      <h1 className="text-xl font-semibold">Clientes y proveedores</h1>
      <div className="flex justify-between sm:grid sm:grid-cols-3 gap-4 items-center">
        <nav className="flex gap-2 items-center">
          <Button
            onPress={() => navigate("clients")}
            className={`${
              isClients ? "bg-primary text-white" : ""
            } w-full sm:w-fit`}
            variant="bordered"
            color="primary"
          >
            Clientes
          </Button>
          <Button
            onPress={() => navigate("providers")}
            variant="bordered"
            className={`${
              isProviders ? "bg-primary text-white" : ""
            } w-full sm:w-fit`}
            color="primary"
          >
            Proveedores
          </Button>
        </nav>
        <Input
          className="hidden md:block max-w-md"
          type="search"
          startContent={<SearchIcon />}
          variant="bordered"
          placeholder="Buscar"
        />
        <div className="block sm:hidden">
          <Button onPress={() => navigate("new")} isIconOnly color="primary">
            <PlusIcon />
          </Button>
        </div>
        <div className="hidden sm:flex sm:justify-end">
          <Button onPress={() => navigate("new")} color="primary">
            {isClients
              ? "Registrar nuevo cliente"
              : "Registrar nuevo proveedor"}
          </Button>
        </div>
      </div>
      <Input
        className="block md:hidden"
        type="search"
        startContent={<SearchIcon />}
        variant="bordered"
        placeholder="Buscar"
      />
      <div className="overflow-y-auto h-full">
        <Outlet />
      </div>
    </main>
  );
};
