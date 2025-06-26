import { Button } from "@heroui/react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon } from "../part/DetailsPart";
import { useEffect, useState } from "react";
import type { PurchaseOrder } from "../../Clases";
import { getPurchaseOrderById } from "../../services/purchaseOrderService";
import { getStateColorPurchaseOrder } from "../../components/PurchaseOrderRow";

export const PurchaseOrderDetails = () => {
  const navigate = useNavigate();
  const purchaseOrderId = window.location.pathname.split("/").pop() || "";
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPurchaseOrderById(purchaseOrderId)
      setPurchaseOrder(response.purchaseOrder);
    };

    fetchData();
  }, [])
  console.log(purchaseOrder);

  if (!purchaseOrder) {
    return <div className="flex justify-center h-screen">Cargando...</div>;
  }

  return <main className="flex flex-col gap-4">
    <Button
      onPress={() => navigate("/dashboard/parts")}
      isIconOnly
      variant="light"
      color="primary"
    >
      <ArrowLeftIcon />
    </Button>
    <h1 className="text-xl font-semibold">Detalles de orden de compra</h1>
    <p
        className={`px-2 md:px-4 py-1 rounded-full border-2 text-center w-fit ${getStateColorPurchaseOrder(purchaseOrder.state)}`}
      >
        {purchaseOrder.state}
      </p>
  </main>
}