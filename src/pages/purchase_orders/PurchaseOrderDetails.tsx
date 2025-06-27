import { Button, Tab, Tabs, Form, Input, DatePicker, RadioGroup, Radio, NumberInput, addToast } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { Link, useNavigate } from "react-router";
import { ArrowLeftIcon } from "../part/DetailsPart";
import { useEffect, useState } from "react";
import type { PurchaseInvoice, PurchaseOrder, Quotation } from "../../Clases";
import { getPurchaseOrderById } from "../../services/purchaseOrderService";
import { getStateColorPurchaseOrder } from "../../components/PurchaseOrderRow";
import { formatDate } from "../../components/ClientQuotationRow";
import { createPurchaseInvoice, updatePurchaseInvoice } from "../../services/purchaseInvoice";

export const PurchaseOrderDetails = () => {
  const navigate = useNavigate();
  const purchaseOrderId = window.location.pathname.split("/").pop() || "";
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [invoice, setInvoice] = useState<PurchaseInvoice | null>(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPurchaseOrderById(purchaseOrderId)
      setPurchaseOrder(response.purchaseOrder);
      setQuotations(response.purchaseOrder.providerQuotation.quotations);
      setInvoice(response.invoice);
    };

    fetchData();
  }, [reload])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (invoice) {
      const response = await updatePurchaseInvoice(invoice);
      if (response && response.status === 200) {
        addToast({
          title: "Factura actualizada correctamente",
          description: "La factura se ha actualizado correctamente.",
          timeout: 3000,
          color: "success",
        });
        setReload(!reload);
        return;
      }
    }
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const date = new Date(data.invoiceDate as string);
    const purchaseInvoice: PurchaseInvoice = {
      purchaseOrder: purchaseOrder as PurchaseOrder,
      invoiceNumber: data.invoiceNumber as string,
      date: date.toISOString(),
      amount: parseFloat(data.totalAmount as string),
      deliveryIncluded: data.shippingIncluded === "yes",
    };
    const response = await createPurchaseInvoice(purchaseInvoice);
    if (response && response.status === 201) {
      addToast({
        title: "Factura creada correctamente",
        description: "La factura se ha guardado correctamente.",
        timeout: 3000,
        color: "success",
      });
      setReload(!reload);
    }
  }

  return (
    <main className="flex flex-col h-full overflow-hidden gap-4">
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
            <div className="flex flex-col h-full overflow-hidden gap-2">
              <h2 className="font-semibold">Datos:</h2>
              <p className="text-sm">Fecha de emisión: {formatDate(purchaseOrder?.createdAt as string)}</p>
              <p className="text-sm">Código: {purchaseOrder?.code}</p>
              <p className="text-sm">Código cotización proveedor: {purchaseOrder?.providerQuotation.code}</p>
              <p className="text-sm">Proveedor: {purchaseOrder?.providerQuotation.provider.name}</p>
              <p className="text-sm">Tipo de compra: {purchaseOrder?.providerQuotation.quotationType}</p>
              <p className="font-semibold">Lista de cotizaciones:</p>
              <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 h-full overflow-y-auto gap-4">
                {
                  quotations.length > 0 && quotations.map((quotation) => (
                    <Link to={`/dashboard/client-quotes/${quotation.clientQuotation.id}`} target="_blank" key={quotation.id} className="flex flex-col gap-2 p-4 border-1 rounded-md md:h-fit hover:bg-zinc-50 transition-all hover:scale-95">
                      <p className="font-semibold"><span className="font-normal">Código: </span>{quotation.clientQuotation.code}</p>
                      <p className="text-sm">Cliente: {quotation.clientQuotation.client.name}</p>
                      <p className="text-sm">Empresa: {quotation.clientQuotation.client.company}</p>
                      <p className="text-sm">Precio total: ${quotation.clientQuotation.totalPrice}</p>
                    </Link>
                  ))
                }
              </div>
            </div>
          </Tab>
          <Tab key="invoice" title="Factura">
            <div className="flex flex-col gap-2 max-w-sm mx-auto">
              <h2 className="font-semibold">Registro de la factura del proveedor</h2>
              <Form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <Input
                  label="Número de factura"
                  value={invoice?.invoiceNumber}
                  onChange={(e) => invoice && setInvoice({ ...invoice, invoiceNumber: e.target.value } as PurchaseInvoice)}
                  name="invoiceNumber"
                  placeholder="Ingresa el número de factura"
                  labelPlacement="outside"
                  variant="bordered"
                  isRequired
                />
                <DatePicker
                  value={invoice?.date ? parseDate(invoice.date.split("T")[0]) : undefined}
                  name="invoiceDate"
                  onChange={(date) => invoice && setInvoice({ ...invoice, date: date ? date.toString() : "" } as PurchaseInvoice)}
                  label="Fecha de la factura"
                  labelPlacement="outside"
                  variant="bordered"
                  isRequired
                />
                <NumberInput startContent={<p className="text-zinc-400">$</p>} label="Monto total" value={invoice?.amount}
                  onChange={(value) => invoice && setInvoice({ ...invoice, amount: value as number } as PurchaseInvoice)} name="totalAmount" minValue={0} step={100} placeholder="Ingresa el monto total" labelPlacement="outside" variant="bordered" isRequired />
                <RadioGroup label="¿El envió está incluido?" name="shippingIncluded" defaultValue={invoice?.deliveryIncluded === true ? "yes" : "no"} className="flex flex-col gap-2" orientation="horizontal" onChange={
                  (e) => {
                    invoice && setInvoice({ ...invoice, deliveryIncluded: (e.target.value === "yes") } as PurchaseInvoice);
                  }
                }
                  isRequired classNames={{
                    label: "text-zinc-950",
                  }}>
                  <Radio value={"yes"}>Si</Radio>
                  <Radio value={"no"}>No</Radio>
                </RadioGroup>
                <Button type="submit" color="primary" className="w-full">
                  {invoice ? "Actualizar factura" : "Crear factura"}
                </Button>
              </Form>
            </div>
          </Tab>
          {
            invoice && purchaseOrder?.providerQuotation.quotationType === "Exterior" ?
              <Tab key="delivery-and-aduana" title="Envió y aduana">
                <h2 className="text-lg font-semibold">Envió y aduana</h2>
              </Tab>
              :
              <Tab key="delivery" title="Envió">
                <h2 className="text-lg font-semibold">Envió</h2>
              </Tab>
          }
        </Tabs>
      </div>
    </main >
  )
}