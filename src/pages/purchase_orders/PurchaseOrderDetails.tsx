import {
  Button,
  Tab,
  Tabs
} from "@heroui/react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon } from "../part/DetailsPart";
import { useEffect, useState } from "react";
import type { Aduana, Delivery, PurchaseInvoice, PurchaseOrder, Quotation } from "../../Clases";
import { getPurchaseOrderById } from "../../services/purchaseOrderService";
import { getStateColorPurchaseOrder } from "../../components/PurchaseOrderRow";
import { DetailsPurchaseOrder } from "../../components/DetailsPurchaseOrder";
import { PurchaseInvoiceForm } from "../../components/forms/PurchaseInvoiceForm";
import { DeliveryForm } from "../../components/forms/DeliveryForm";
import { AduanaForm } from "../../components/forms/AduanaForm";

export const PurchaseOrderDetails = () => {
  const navigate = useNavigate();
  const purchaseOrderId = window.location.pathname.split("/").pop() || "";
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(
    null
  );
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoice, setInvoice] = useState<PurchaseInvoice | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [aduana, setAduana] = useState<Aduana | null>(null);
  const [reload, setReload] = useState(false);
  const [deliveryIncluded, setDeliveryIncluded] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPurchaseOrderById(purchaseOrderId);
      setPurchaseOrder(response.purchaseOrder);
      setQuotations(response.purchaseOrder.providerQuotation.quotations);
      setInvoice(response.invoice);
      setDelivery(response.delivery);
      setAduana(response.aduana);
    };

    fetchData();
  }, [reload]);

  return (
    <main className="flex flex-col h-full overflow-hidden gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Button
            onPress={() => {
              navigate("/dashboard/purchase-orders");
            }}
            isIconOnly
            variant="light"
            color="primary"
          >
            <ArrowLeftIcon />
          </Button>
          {purchaseOrder?.state === "Pend. Ingreso" && (
            <Button
              color="primary"
              variant="bordered"
              onPress={() => {
                navigate(`/dashboard/parts-intake/${purchaseOrderId}`);
              }}
            >
              Realizar ingreso
            </Button>
          )}
        </div>
        <h1 className="text-xl font-semibold">Detalles de orden de compra</h1>
        <p
          className={`px-2 md:px-4 py-1 rounded-full border-2 text-center w-fit ${getStateColorPurchaseOrder(
            purchaseOrder?.state as string
          )}`}
        >
          {purchaseOrder?.state}
        </p>
      </div>
      <div className="flex flex-col h-full overflow-hidden gap-4">
        <Tabs
          classNames={{
            panel: "h-full overflow-hidden p-0",
            tabList: "p-0 w-full",
          }}
          color="primary"
          variant="light"
          aria-label="Options"
        >
          <Tab key="details" title="Detalles OC">
            <DetailsPurchaseOrder
              purchaseOrder={purchaseOrder as PurchaseOrder}
              quotations={quotations}
            />
          </Tab>
          <Tab key="invoice" title="Factura">
            <PurchaseInvoiceForm
              purchaseOrder={purchaseOrder as PurchaseOrder}
              invoice={invoice as PurchaseInvoice}
              setInvoice={setInvoice}
              deliveryIncluded={deliveryIncluded}
              setDeliveryIncluded={setDeliveryIncluded}
              reload={reload}
              setReload={setReload}
            />
          </Tab>
          {
            delivery && !invoice?.deliveryIncluded && (
              <Tab key="exteriorDelivery" title="Envío Internacional">
                <DeliveryForm
                  purchaseOrder={purchaseOrder as PurchaseOrder}
                  delivery={delivery as Delivery}
                  setDelivery={setDelivery}
                  reload={reload}
                  setReload={setReload}
                />
              </Tab>
            )
          }
          {
            (aduana || purchaseOrder?.state === "Pend. Aduana") && (
              <Tab key="customs" title="Aduana">
                <AduanaForm
                  purchaseOrder={purchaseOrder as PurchaseOrder}
                  aduana={aduana as Aduana}
                  setAduana={setAduana}
                  reload={reload}
                  setReload={setReload}
                />
              </Tab>
            )
          }
          {
            purchaseOrder?.state === "Pend. Entrega" && (
              <Tab key="delivery" title="Entrega">
                <h2 className="font-semibold">Entrega</h2>
              </Tab>
            )
          }
        </Tabs>
      </div>
    </main>
  );
};