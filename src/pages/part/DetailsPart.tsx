import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import type { Part } from "../../Clases";
import { fetchPart } from "../../services/partService";
import { Button, Tab, Tabs } from "@heroui/react";
import { useAuth } from "../../store/useAuth";

export const DetailsPart = () => {
  const [part, setPart] = useState<Part | null>(null);
  const navigate = useNavigate();
  const partId = useLocation().pathname.split("/").pop();
  const { role } = useAuth();

  useEffect(() => {
    const fetchPartData = async () => {
      const partData = await fetchPart(partId || "");
      setPart(partData.part);
    };
    fetchPartData();
  }, []);

  if (!part) {
    return <div className="w-full text-center">Cargando...</div>;
  }

  return (
    <main className="flex flex-col gap-2 h-full">
      <div className="flex justify-between items-center">
        <Button
          onPress={() => navigate("/dashboard/parts")}
          isIconOnly
          variant="light"
          color="primary"
        >
          <ArrowLeftIcon />
        </Button>
        {(role === "admin" || role === "auxiliary") && (
          <Button isIconOnly color="primary" variant="bordered">
            <PencilIcon />
          </Button>
        )}
      </div>
      <div className="hidden md:flex flex-col gap-2">
        <DetailPart part={part} />
      </div>
      <div className="flex flex-col gap-2 h-full md:hidden">
        <Tabs
          classNames={{
            panel: "h-full overflow-y-auto p-0",
            tabList: "p-0 w-full",
          }}
          color="primary"
          variant="light"
          aria-label="Options"
        >
          <Tab key="details" title="Detalles de parte">
            <DetailPart part={part} />
          </Tab>
          <Tab key="stock" title="Unidades">
            <p>Unidades</p>
          </Tab>
          <Tab key="output-history" title="Historial de salidas">
            <p>Historial de salidas</p>
          </Tab>
          <Tab key="pending-input" title="Pendientes de ingreso">
            <p>Pendientes de ingreso</p>
          </Tab>
        </Tabs>
      </div>
      <div className="md:flex flex-col gap-2 h-full hidden">
        <Tabs
          classNames={{
            panel: "h-full overflow-y-auto p-0",
            tabList: "p-0 w-full",
          }}
          color="primary"
          variant="light"
          aria-label="Options"
        >
          <Tab key="stock" title="Unidades">
            <p>Unidades</p>
          </Tab>
          <Tab key="output-history" title="Historial de salidas">
            <p>Historial de salidas</p>
          </Tab>
          <Tab key="pending-input" title="Pendientes de ingreso">
            <p>Pendientes de ingreso</p>
          </Tab>
        </Tabs>
      </div>
    </main>
  );
};

export const DetailPart = ({ part }: { part: Part }) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-5">
      <h2 className="text-xl md:hidden">{part.name}</h2>
      <img
        src={part.image}
        alt={part.name}
        className="w-full aspect-square bg-white object-contain p-2
         rounded-md md:w-1/4 md:max-w-xs"
      />
      <div className="flex flex-col md:gap-2 max-w-sm">
        <h2 className="text-xl hidden md:block">{part.name}</h2>
        <p className="text-sm text-zinc-950">
          Número de parte:{" "}
          <span className="text-sm  text-zinc-700">{part.partNumber}</span>
        </p>
        <p className="text-sm text-zinc-950">
          Productor:{" "}
          <span className="text-sm text-zinc-700">{part.producer}</span>
        </p>
        <p className="text-sm text-zinc-950">
          Descripción:{" "}
          <span className="text-sm text-zinc-700">{part.description}</span>
        </p>
      </div>
    </div>
  );
};

export const PencilIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
      />
    </svg>
  );
};

export const ArrowLeftIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
};
