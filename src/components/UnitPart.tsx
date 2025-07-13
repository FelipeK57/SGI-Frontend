import type { UnitPart } from "../Clases"

interface UnitPartProps {
  unit: UnitPart
}

export const UnitPartRow = ({ unit }: UnitPartProps) => {
  // Format the date to a more readable format, example: "2023-10-01"
  const formatDate = () => {
    const date = new Date(unit.createdAt as string);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 w-full border-b-1 p-2 text-xs border-zinc-200">
      <p>{unit.serial || "-"}</p>
      <p className="hidden md:block">{formatDate() || "-"}</p>
      <p>{unit.intake?.purchaseOrder.code || "-"}</p>
      <p>{unit.intake?.quotationPart.clientQuotation.code || "-"}</p>
    </div>
  )
}