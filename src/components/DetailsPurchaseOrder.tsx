import { Link } from "react-router";
import { formatDate } from "./ClientQuotationRow";
import type { PurchaseOrder, Quotation } from "../Clases";

interface DetailsPurchaseOrderProps {
  purchaseOrder: PurchaseOrder;
  quotations: Quotation[];
}

export const DetailsPurchaseOrder = ({ purchaseOrder, quotations }: DetailsPurchaseOrderProps) => {
  return (
    <div className="flex flex-col h-full overflow-hidden gap-2">
      <h2 className="font-semibold">Datos:</h2>
      <p className="text-sm">
        Fecha de emisión:{" "}
        {formatDate(purchaseOrder?.createdAt as string)}
      </p>
      <p className="text-sm">Código: {purchaseOrder?.code}</p>
      <p className="text-sm">
        Proveedor: {purchaseOrder?.provider.name}
      </p>
      <p className="text-sm">
        Tipo de compra: {purchaseOrder?.quotationType}
      </p>
      <p className="font-semibold">Lista de cotizaciones:</p>
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 h-full overflow-y-auto gap-4">
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
    </div>
  )
}