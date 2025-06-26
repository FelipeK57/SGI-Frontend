import { useNavigate } from "react-router";
import type { PurchaseOrder } from "../Clases";
import { formatDate } from "./ClientQuotationRow";

interface PurchaseOrderRowProps {
  purchaseOrder: PurchaseOrder;
}

export const getStateColorPurchaseOrder = (state: string) => {
  if (state === "Finalizada") {
    return "border-green-950 text-green-950";
  }
  if (state === "Pend. Ingreso") {
    return "border-blue-600 text-blue-600";
  }
  else return "border-warning text-warning";
};

export const PurchaseOrderRow = ({ purchaseOrder }: PurchaseOrderRowProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`${purchaseOrder.id}`)}
      className="grid grid-cols-[20%_1fr_1fr] md:grid-cols-5 gap-4 border-b-1 p-2 text-xs border-zinc-200 cursor-pointer hover:bg-zinc-100 hover:font-semibold transition-all"
    >
      <p className="flex items-center">{purchaseOrder.code}</p>
      <p className="flex items-center truncate">{purchaseOrder.providerQuotation.provider.name}</p>
      <p className="hidden md:flex items-center">
        {formatDate(purchaseOrder.createdAt)}
      </p>
      <p
        className={`px-2 md:px-4 py-1 rounded-full border-2 text-center w-fit ${getStateColorPurchaseOrder(purchaseOrder.state)}`}
      >
        {purchaseOrder.state}
      </p>
      <p className="hidden md:flex items-center">
        {purchaseOrder.providerQuotation.quotationType}
      </p>
    </div>
  );
};
