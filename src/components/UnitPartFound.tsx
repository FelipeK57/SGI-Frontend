import { Button } from "@heroui/react";
import type { Part } from "../Clases";

interface UnitPartFoundProps {
  part: Part;
  onAddPart: (part: Part) => void;
}

export const UnitPartFound = ({ part, onAddPart }: UnitPartFoundProps) => {
  return (
    <div className="flex border-1 p-2 gap-4 rounded-md">
      <img
        src={part.image}
        alt={part.name}
        className="w-1/3 md:w-1/4 aspect-square object-contain bg-zinc-100 rounded-md"
      />
      <div className="flex flex-col gap-2 w-full md:justify-between">
        <p className="font-semibold">{part.name}</p>
        <p className="text-xs">
          <span className="text-zinc-700">Número de parte:</span>{" "}
          {part.partNumber}
        </p>
        <p className="text-xs">
          <span className="text-zinc-700">Productor:</span> {part.producer}
        </p>
        <Button
          size="sm"
          variant="bordered"
          color="primary"
          className="w-fit"
          onPress={() => onAddPart(part)}
        >
          Agregar
        </Button>
      </div>
    </div>

  );
};
