import { Button, Input } from "@heroui/react";
import { CardPart } from "../components/CardPart";
import { useEffect, useState } from "react";
import type { Part } from "../Clases";
import { fetchParts } from "../services/partService";

export const Parts = () => {
  const [parts, setParts] = useState<Part[]>([]);

  useEffect(() => {
    const fetchPartsData = async () => {
      try {
        const response = await fetchParts();
        setParts(response.parts);
      } catch (error) {
        console.error("Error loading part data:", error);
      }
    };
    fetchPartsData();
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold">Catálogo de partes</h1>
        <div className="block sm:hidden">
          <Button isIconOnly color="primary">
            <PlusIcon />
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <Input
          className="w-full md:max-w-xs"
          startContent={<SearchIcon />}
          type="search"
          placeholder="Buscar"
          variant="bordered"
        />
        <div className="hidden sm:block">
          <Button color="primary">Registrar nueva parte</Button>
        </div>
      </div>
      <main
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 gap-5 overflow-y-auto w-full
      "
      >
        {parts.length > 0 ? (
          parts.map((part) => {
            return <CardPart part={part} key={part.id} />;
          })
        ) : (
          <div className="col-span-2 flex items-center justify-center">
            <p className="text-zinc-500 text-sm font-light">
              No hay partes disponibles
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export const SearchIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6 text-default"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
};

export const PlusIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};
