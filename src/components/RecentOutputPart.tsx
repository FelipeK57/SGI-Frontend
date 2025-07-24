import type { OutputPart } from "../Clases"

interface RecentOutputPartProps {
  outputPart: OutputPart
}

export const RecentOutputPart = ({ outputPart }: RecentOutputPartProps) => {
  // Format the date to a more readable format, example: "2023-10-01"
  const formatDate = () => {
    const date = new Date(outputPart.createdAt);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const typeSale = () => {
    if (outputPart.output.type === "sale") {
      return "Venta";
    }
    if (outputPart.output.type === "warranty") {
      return "Garantía";
    }
    if (outputPart.output.type === "loan") {
      return "Préstamo";
    }
  }
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 w-full border-b-1 p-2 text-xs border-zinc-200">
      <p>{outputPart.serial || "-"}</p>
      <p className="hidden md:block">{formatDate() || "-"}</p>
      <p>{outputPart.output.client.name || "Stock SEMCON"}</p>
      <p>{typeSale() || "-"}</p>
    </div>
  )
}