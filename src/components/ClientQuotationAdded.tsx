import { Button } from "@heroui/react";
// import type { QuotationAdded } from "../pages/provider_quotation/NewProviderQuotation";
import { formatDate } from "./ClientQuotationRow";
import { TrashIcon } from "./QuotePart";
import type { ClientQuotation } from "../Clases";
import { deleteClientQuotation } from "../services/providerQuotationService";

interface QuotationAddedProps {
  id?: number;
  quotation: ClientQuotation;
  onRemoveQuotation: (clientQuotationId: number) => void;
}

export const ClientQuotationAdded = ({
  id,
  quotation,
  onRemoveQuotation,
}: QuotationAddedProps) => {
  const handleDeletePart = async () => {
    if (!id) {
      onRemoveQuotation(quotation.id as number);
      return;
    }
    const response = await deleteClientQuotation(id);
    if (response && response.status === 200) {
      onRemoveQuotation(quotation.id as number);
    }
  };

  return (
    <div
      key={quotation.id}
      className="flex border-1 p-4 rounded-md justify-between"
    >
      <div className="flex flex-col gap-2">
        <p className="font-semibold">{quotation.client.name}</p>
        <p className="text-sm">
          <span className="text-zinc-700">Solicitante: </span>
          {quotation.requesterName}
        </p>
        <p className="text-sm">
          <span className="text-zinc-700">Código: </span>
          {quotation.code}
        </p>
        <p className="text-sm">
          <span className="text-zinc-700">Fecha: </span>{" "}
          {formatDate(quotation.createdAt as string)}
        </p>
        <p className="text-sm">
          <span className="text-zinc-700">Total: </span>
          {Number(quotation.totalPrice)?.toLocaleString("es-CO", {
            style: "currency",
            currency: quotation?.currency || "USD",
            minimumFractionDigits: 0,
          })}
        </p>
      </div>
      <Button
        onPress={() => handleDeletePart()}
        isIconOnly
        className="rounded-full"
        variant="bordered"
        color="danger"
      >
        <TrashIcon />
      </Button>
    </div>
  );
};
