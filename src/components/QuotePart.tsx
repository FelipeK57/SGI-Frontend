import { Button, NumberInput } from "@heroui/react";
import type { Part } from "../Clases";
import { useState } from "react";
import type { PartAdded } from "../pages/client_quotation/NewClientQuotation";
import { deleteQuotationPart } from "../services/clientQuotationService";

interface QuotePartProps {
  part: Part;
  partAdded?: PartAdded;
  quotationPartQuantity?: number;
  quotationPartUnitPrice?: number;
  onRemovePart: (part: Part) => void;
  onQuantityChange: (part: Part, quantity: number) => void;
  onPriceUnitChange: (part: Part, priceUnit: number) => void;
}

export const QuotePart = ({ part, partAdded, quotationPartQuantity, quotationPartUnitPrice, onRemovePart, onQuantityChange, onPriceUnitChange }: QuotePartProps) => {
  const [quantity, setQuantity] = useState(quotationPartQuantity || 1);
  const [priceUnit, setPriceUnit] = useState(quotationPartUnitPrice || 0);

  const handleQuantityChange = (value: number) => {
    if (value < 1) {
      return;
    }
    setQuantity(value);
    onQuantityChange(part, value);
  };

  const handleDeletePart = async () => {
    if (!partAdded?.id) {
      onRemovePart(part);
      return
    }
    const response = await deleteQuotationPart(partAdded.id);
    if (response && response.status === 200) {
      onRemovePart(part);
    }
  }

  return (
    <div className="flex border-1 p-3 gap-4 rounded-md">
      <img
        src={part.image}
        alt={part.name}
        className="hidden md:flex w-1/4 aspect-square object-contain bg-zinc-50 rounded-md"
      />
      <div className="flex flex-col gap-2 w-full">
        <p className="font-semibold">{part.name}</p>
        <p className="text-xs text-zinc-500">{part.partNumber}</p>
        <p className="text-xs text-zinc-500">{part.producer}</p>
        <NumberInput
          label="Precio unitario"
          labelPlacement="outside"
          placeholder="0"
          variant="bordered"
          type="number"
          className="max-w-36"
          minValue={0}
          startContent={<p className="text-zinc-400">$</p>}
          value={priceUnit}
          onValueChange={(value: number) => {
            setPriceUnit(value);
            onPriceUnitChange(part, value);
          }}
        />
      </div>
      <div className="flex flex-col gap-2 justify-between items-end">
        <Button
          variant="bordered"
          isIconOnly
          className="rounded-full"
          color="danger"
          onPress={() => handleDeletePart()}
        >
          <TrashIcon />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            isDisabled={quantity === 1}
            variant="bordered"
            isIconOnly
            className="rounded-full"
            onPress={() => handleQuantityChange(quantity - 1)}
          >
            <MinusIcon />
          </Button>
          <p className="text-sm">{quantity}</p>
          <Button
            size="sm"
            variant="bordered"
            color="default"
            isIconOnly
            className="rounded-full"
            onPress={() => handleQuantityChange(quantity + 1)}
          >
            <PlusIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const TrashIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5 text-danger"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  );
};

export const MinusIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
};

export const PlusIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
};
