import type { ClientQuotation } from "../Clases";

interface ClientQuotationRowProps {
  quotation: ClientQuotation;
}

export const ClientQuotationRow = ({ quotation }: ClientQuotationRowProps) => {
  // Format the date to a more readable format, example: "2023-10-01"
  const formatDate = () => {
    const date = new Date(quotation.createdAt);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getStateColor = () => {
    if (quotation.state === "Aceptada") {
      return "border-success text-success";
    }
    if (quotation.state === "Cancelada") {
      return "border-danger text-danger";
    }
    if (quotation.state === "Pendiente") {
      return "border-warning text-warning";
    }
  };

  return (
    <div className="grid grid-cols-[25%_1fr_1fr] md:grid-cols-4 gap-3 border-b-1 p-2 text-xs border-zinc-200 cursor-pointer hover:bg-zinc-100 hover:font-semibold transition-all">
      <p className="flex items-center">{quotation.code}</p>
      <p className="flex items-center truncate">{quotation.client.name}</p>
      <p className="hidden md:flex items-center">{formatDate()}</p>
      <p
        className={`px-2 md:px-4 py-1 rounded-full border-2 text-center w-fit ${getStateColor()}`}
      >
        {quotation.state}
      </p>
    </div>
  );
};
