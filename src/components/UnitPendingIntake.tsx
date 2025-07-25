import type { UnitsPendingIntake } from "../Clases"

interface UnitPendingIntakeProps {
  unitPendingIntake: UnitsPendingIntake
}

export const UnitPendingIntake = ({ unitPendingIntake }: UnitPendingIntakeProps) => {
  // Format the date to a more readable format, example: "2023-10-01"
  const quantity = unitPendingIntake.quantity - (unitPendingIntake.receivedQuantity || 0);
  const formatDate = () => {
    const date = new Date(unitPendingIntake.clientQuotation?.quotations.purchaseOrder.date as string || unitPendingIntake.purchaseOrder?.date as string || "");
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-4 md:grid-cols-5 gap-3 w-full border-b-1 p-2 text-xs border-zinc-200">
      <p>{unitPendingIntake.clientQuotation?.client.name || "Stock SEMCON"}</p>
      <p className="hidden md:block">{formatDate() || "-"}</p>
      <p>{quantity || "-"}</p>
      <p>{unitPendingIntake.clientQuotation?.quotations.purchaseOrder.code || unitPendingIntake.purchaseOrder?.code}</p>
      <p>{unitPendingIntake.clientQuotation?.code || "-"}</p>
    </div>
  )
}