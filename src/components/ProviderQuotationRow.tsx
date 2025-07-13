import { useNavigate } from "react-router";
import type { ProviderQuotation } from "../Clases";
import { formatDate, getStateColor } from "./ClientQuotationRow";

interface ProviderQuotationRowProps {
  quotation: ProviderQuotation;
}

export const ProviderQuotationRow = ({ quotation }: ProviderQuotationRowProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`${quotation.id}`)}
      className="grid grid-cols-[30%_1fr_1fr] md:grid-cols-5 gap-4 border-b-1 p-2 text-xs border-zinc-200 cursor-pointer hover:bg-zinc-100 hover:font-semibold transition-all"
    >
      <p className="flex items-center">{quotation.code}</p>
      <p className="flex items-center truncate">{quotation.provider.name}</p>
      <p className="hidden md:flex items-center">
        {formatDate(quotation.createdAt)}
      </p>
      <p
        className={`px-2 md:px-4 py-1 rounded-full border-2 text-center w-fit ${getStateColor(quotation.state)}`}
      >
        {quotation.state}
      </p>
      <p className="hidden md:flex items-center">{quotation.quotationType}</p>
    </div>
  );
};
