import { Button, Input } from "@heroui/react";
import { CardPart } from "../../components/CardPart";
import { useEffect, useState } from "react";
import type { Part } from "../../Clases";
import { fetchParts } from "../../services/partService";
import { useAuth } from "../../store/useAuth";
import { useNavigate } from "react-router";

export const Parts = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [partsFiltered, setPartsFiltered] = useState<Part[]>([]);
  const [searchedPart, setSearchedPart] = useState<string>("");
  const { role } = useAuth();
  const navigate = useNavigate()

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

  useEffect(() => {
    if (searchedPart.trim() === "") {
      setPartsFiltered(parts);
    } else {
      const filteredParts = parts.filter((part) =>
        part.name.toLowerCase().includes(searchedPart.toLowerCase()) || part.partNumber.toLowerCase().includes(searchedPart.toLowerCase()) || part.description.toLowerCase().includes(searchedPart.toLowerCase()) || part.producer.toLowerCase().includes(searchedPart.toLowerCase())
      );
      setPartsFiltered(filteredParts);
    }
  }, [searchedPart, parts]);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold">Catálogo de partes</h1>
        {(role === "admin" || role === "auxiliary") && (
          <div className="block sm:hidden">
            <Button onPress={() => navigate("new")} isIconOnly color="primary">
              <PlusIcon />
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center gap-2">
        <Input
          onChange={(e) => {
            setSearchedPart(e.target.value);
          }}
          className="w-full md:max-w-xs"
          startContent={<SearchIcon />}
          type="search"
          placeholder="Buscar"
          variant="bordered"
        />
        {(role === "admin" || role === "auxiliary") && (
          <div className="hidden sm:block">
            <Button onPress={() => navigate("new")} color="primary">Registrar nueva parte</Button>
          </div>
        )}
      </div>
      <main
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 gap-5 overflow-y-auto w-full
      "
      >
        {partsFiltered.length > 0 ? (
          partsFiltered.map((part) => {
            return <CardPart part={part} key={part.id} />;
          })
        ) : (
          <div className="col-span-full flex items-center justify-center">
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
