import { useNavigate } from "react-router";
import type { ClientQuotation } from "../Clases";

interface ClientQuotationRowProps {
  quotation: ClientQuotation;
}

export const formatDate = (date: string) => {
  const dateFormatted = new Date(date);
  return dateFormatted.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

export const getStateColor = (state: string) => {
  if (state === "Aceptada") {
    return "border-success text-success";
  }
  if (state === "Cancelada") {
    return "border-danger text-danger";
  }
  if (state === "Pendiente") {
    return "border-warning text-warning";
  }
};
export const ClientQuotationRow = ({ quotation }: ClientQuotationRowProps) => {
  // Format the date to a more readable format, example: "2023-10-01"

  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`${quotation.id}`)}
      className="grid grid-cols-[20%_1fr_1fr] md:grid-cols-4 gap-4 border-b-1 p-2 text-xs border-zinc-200 cursor-pointer hover:bg-zinc-100 hover:font-semibold transition-all"
    >
      <p className="flex items-center">{quotation.code}</p>
      <p className="flex items-center truncate">{quotation.client.name}</p>
      <p className="hidden md:flex items-center">
        {formatDate(quotation.createdAt)}
      </p>
      <p
        className={`px-2 md:px-4 py-1 rounded-full border-2 text-center w-fit ${getStateColor(
          quotation.state
        )}`}
      >
        {quotation.state}
      </p>
    </div>
  );
};
