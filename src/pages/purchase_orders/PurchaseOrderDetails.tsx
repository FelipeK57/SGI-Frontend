import { Button, Card, Tab, Tabs } from "@heroui/react";
import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon } from "../part/DetailsPart";
import { useEffect, useState } from "react";
import type { PurchaseOrder, Quotation } from "../../Clases";
import { getPurchaseOrderById } from "../../services/purchaseOrderService";
import { getStateColorPurchaseOrder } from "../../components/PurchaseOrderRow";
import { formatDate } from "../../components/ClientQuotationRow";

export const PurchaseOrderDetails = () => {
  const navigate = useNavigate();
  const purchaseOrderId = window.location.pathname.split("/").pop() || "";
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPurchaseOrderById(purchaseOrderId)
      setPurchaseOrder(response.purchaseOrder);
      setQuotations(response.purchaseOrder.providerQuotation.quotations);
    };

    fetchData();
  }, [])

  return (
    <main className="flex flex-col h-full gap-4">
      <div className="flex flex-col gap-2">
        <Button onPress={() => { navigate("/dashboard/purchase-orders") }} isIconOnly variant="light" color="primary">
          <ArrowLeftIcon />
        </Button>
        <h1 className="text-xl font-semibold">Detalles de orden de compra</h1>
        <p
          className={`px-2 md:px-4 py-1 rounded-full border-2 text-center w-fit ${getStateColorPurchaseOrder(purchaseOrder?.state as string)}`}
        >
          {purchaseOrder?.state}
        </p>
      </div>
      <div className="flex flex-col h-full gap-4">
        <Tabs
          classNames={{
            panel: "h-full overflow-y-auto p-0",
            tabList: "p-0 w-full",
          }}
          color="primary"
          variant="light"
          aria-label="Options"
        >
          <Tab key="details" title="Detalles OC">
            <div className="flex flex-col h-full gap-2">
              <p className="font-semibold">Datos:</p>
              <p className="text-sm">Fecha de emisión: {formatDate(purchaseOrder?.createdAt as string)}</p>
              <p className="text-sm">Código: {purchaseOrder?.code}</p>
              <p className="text-sm">Código cotización proveedor: {purchaseOrder?.providerQuotation.code}</p>
              <p className="text-sm">Proveedor: {purchaseOrder?.providerQuotation.provider.name}</p>
              <p className="text-sm">Tipo de compra: {purchaseOrder?.providerQuotation.quotationType}</p>
              <p className="font-semibold">Lista de cotizaciones:</p>
              <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 h-full overflow-y-auto gap-4">
                {
                  quotations.length > 0 && quotations.map((quotation) => (
                    <Card as={Link} to={`/dashboard/client-quotes/${quotation.clientQuotation.id}`} target="_blank" rel="noopener noreferrer" key={quotation.id} className="flex flex-col gap-2 p-4 border-1 rounded-md h-fit hover:bg-zinc-100 transition-colors">
                      <p className="font-semibold"><span className="font-normal">Código: </span>{quotation.clientQuotation.code}</p>
                      <p className="text-sm">Cliente: {quotation.clientQuotation.client.name}</p>
                      <p className="text-sm">Empresa: {quotation.clientQuotation.client.company}</p>
                      <p className="text-sm">Precio total: ${quotation.clientQuotation.totalPrice}</p>
                    </Card>
                  ))
                }
              </div>
            </div>
          </Tab>
          <Tab key="invoice" title="Factura">
            <h1 className="text-lg font-semibold">Factura de la orden de compra</h1>
          </Tab>
          {
            purchaseOrder?.providerQuotation.quotationType === "Exterior" ?
              <Tab key="delivery-and-aduana" title="Envió y aduana">
                <h1 className="text-lg font-semibold">Envió y aduana</h1>
              </Tab>
              :
              <Tab key="delivery" title="Envió">
                <h1 className="text-lg font-semibold">Envió</h1>
              </Tab>
          }
        </Tabs>
      </div>
    </main>
  )
}