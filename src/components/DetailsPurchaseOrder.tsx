import { Link } from "react-router";
import { formatDate } from "./ClientQuotationRow";
import type { PurchaseOrder, Quotation, QuotationPart } from "../Clases";

interface DetailsPurchaseOrderProps {
  purchaseOrder: PurchaseOrder;
  quotations: Quotation[];
  quotationParts?: QuotationPart[];
}

export const DetailsPurchaseOrder = ({
  purchaseOrder,
  quotations,
  quotationParts = [],
}: DetailsPurchaseOrderProps) => {
  return (
    <div className="flex flex-col h-full overflow-hidden gap-2">
      <h2 className="font-semibold">Datos:</h2>
      <p className="text-sm">
        Fecha de emisión: {formatDate(purchaseOrder?.createdAt as string)}
      </p>
      <p className="text-sm">Código: {purchaseOrder?.code}</p>
      <p className="text-sm">Proveedor: {purchaseOrder?.provider.name}</p>
      <p className="text-sm">Tipo de compra: {purchaseOrder?.quotationType}</p>
      <p className="font-semibold">Lista de cotizaciones:</p>
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 h-fit overflow-y-auto gap-4">
        {quotations.length > 0 &&
          quotations.map((quotation) => (
            <Link
              to={`/dashboard/client-quotes/${quotation.clientQuotation.id}`}
              target="_blank"
              key={quotation.id}
              className="flex flex-col gap-2 p-4 border-1 rounded-md md:h-fit hover:bg-zinc-50 transition-all active:scale-95"
            >
              <p className="font-semibold">
                <span className="font-normal">Código: </span>
                {quotation.clientQuotation.code}
              </p>
              <p className="text-sm">
                Cliente: {quotation.clientQuotation.client.name}
              </p>
              <p className="text-sm">
                Solicitante: {quotation.clientQuotation.requesterName}
              </p>
              <p className="text-sm">
                Precio total: ${quotation.clientQuotation.totalPrice}
              </p>
            </Link>
          ))}
      </div>
      {quotationParts.length > 0 && (
        <>
          <p className="font-semibold">Lista de partes para stock:</p>
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 h-fit overflow-y-auto gap-4">
            {quotationParts.map((part) => (
              <div className="flex border-1 p-2 gap-4 rounded-md">
                <img
                  src={part.part.image}
                  alt={part.part.name}
                  className="w-1/3 md:w-1/3 xl:w-1/4 aspect-square object-contain bg-zinc-100 rounded-md"
                />
                <div className="flex flex-col gap-2 w-full">
                  <p className="font-semibold">{part.part.name}</p>
                  <p className="text-xs">
                    <span className="text-zinc-700">Número de parte:</span>{" "}
                    {part.part.partNumber}
                  </p>
                  <p className="text-xs">
                    <span className="text-zinc-700">Productor:</span>{" "}
                    {part.part.producer}
                  </p>
                  <p className="text-xs">
                    <span className="text-zinc-700">Cantidad:</span>{" "}
                    {part.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
