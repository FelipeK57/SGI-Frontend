import { Button } from "@heroui/react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon } from "../part/DetailsPart";
import { useEffect, useState } from "react";
import type { Quotation, QuotationPart } from "../../Clases";
import { getQuotationParts } from "../../services/purchaseOrderService";
export const PartsIntake = () => {
  const navigate = useNavigate();
  const purchaseOrderId = window.location.pathname.split("/").pop() || "";
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    const fetchQuotationParts = async () => {
      const response = await getQuotationParts(purchaseOrderId);
      console.log(response);
      setQuotations(response.purchaseOrder.providerQuotation.quotations);
    };
    fetchQuotationParts();
  }, [purchaseOrderId]);

  console.log(quotations);

  return (
    <main className="flex flex-col gap-4">
      <Button
        onPress={() => {
          navigate(`/dashboard/purchase-orders/${purchaseOrderId}`);
        }}
        isIconOnly
        variant="light"
        color="primary"
      >
        <ArrowLeftIcon />
      </Button>
      <h1 className="text-xl font-semibold">Ingreso de partes</h1>
    </main>
  );
};
