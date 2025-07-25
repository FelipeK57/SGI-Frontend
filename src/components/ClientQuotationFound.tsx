import { Button } from "@heroui/react";
// import type { QuotationFound } from "../pages/provider_quotation/NewProviderQuotation"
import { formatDate } from "./ClientQuotationRow";
import { PlusIcon } from "./QuotePart";
import type { ClientQuotation } from "../Clases";

interface ClientQuotationProps {
  quotationFound: ClientQuotation;
  onAddQuotation: (quotationFound: ClientQuotation) => void;
}

export const ClientQuotationFound = ({
  quotationFound,
  onAddQuotation,
}: ClientQuotationProps) => {
  return (
    <>
      <p className="text-sm">Cotización encontrada</p>
      <div className="flex gap-4 border-1 justify-between rounded-md p-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold">{quotationFound.client.name}</p>
          <p className="text-sm">
            <span className="text-zinc-700">Solicitante: </span>
            {quotationFound.requesterName}
          </p>
          <p className="text-sm">
            <span className="text-zinc-700">Código: </span>
            {quotationFound.code}
          </p>
          <p className="text-sm">
            <span className="text-zinc-700">Fecha: </span>
            {formatDate(quotationFound.createdAt)}
          </p>
          <p className="text-sm">
            <span className="text-zinc-700">Total: </span>
            {Number(quotationFound.totalPrice)?.toLocaleString("es-CO", {
              style: "currency",
              currency: quotationFound?.currency || "USD",
              minimumFractionDigits: 0,
            })}
          </p>
        </div>
        <Button
          isIconOnly
          className="rounded-full"
          onPress={() => onAddQuotation(quotationFound)}
          variant="bordered"
          color="primary"
        >
          <PlusIcon />
        </Button>
      </div>
    </>
  );
};
