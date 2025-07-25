import {
  addToast,
  Input,
  DatePicker,
  Select,
  SelectItem,
  NumberInput,
  RadioGroup,
  Radio,
  Button,
  Form,
} from "@heroui/react";
import type { PurchaseOrder, PurchaseInvoice } from "../../Clases";
import {
  updatePurchaseInvoice,
  createPurchaseInvoice,
} from "../../services/purchaseInvoiceService";
import { parseDate } from "@internationalized/date";

interface PurchaseInvoiceProps {
  purchaseOrder: PurchaseOrder;
  invoice?: PurchaseInvoice;
  setInvoice: (invoice: PurchaseInvoice) => void;
  deliveryIncluded?: boolean;
  setDeliveryIncluded?: (included: boolean) => void;
  reload: boolean;
  setReload: (reload: boolean) => void;
}

export const PurchaseInvoiceForm = ({
  purchaseOrder,
  invoice,
  setInvoice,
  deliveryIncluded,
  setDeliveryIncluded,
  reload,
  setReload,
}: PurchaseInvoiceProps) => {
  const purchaseInvoiceHandleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
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
      currency: data.currency as string,
      deliveryAmount: data.deliveryAmount
        ? parseFloat(data.deliveryAmount as string)
        : undefined,
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
  };

  return (
    <div className="flex flex-col gap-2 h-full items-center overflow-y-auto">
      <h2 className="font-semibold">Registro de la factura del proveedor</h2>
      <Form
        onSubmit={purchaseInvoiceHandleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <Input
          label="Número de factura"
          value={invoice?.invoiceNumber}
          onChange={(e) =>
            invoice &&
            setInvoice({
              ...invoice,
              invoiceNumber: e.target.value,
            } as PurchaseInvoice)
          }
          name="invoiceNumber"
          placeholder="Ingresa el número de factura"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <DatePicker
          value={
            invoice?.date ? parseDate(invoice.date.split("T")[0]) : undefined
          }
          name="invoiceDate"
          onChange={(date) =>
            invoice &&
            setInvoice({
              ...invoice,
              date: date ? date.toString() : "",
            } as PurchaseInvoice)
          }
          label="Fecha de la factura"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <div className="grid grid-cols-3 w-full items-start gap-2">
          {purchaseOrder.quotationType === "Importación" && (
            <Select
              defaultSelectedKeys={[(invoice?.currency as string) || "usd"]}
              name="currency"
              isRequired
              label="Moneda"
              disallowEmptySelection
              variant="bordered"
              labelPlacement="outside"
              placeholder="Monedas"
              onSelectionChange={(keys) => {
                if (invoice) {
                  setInvoice({
                    ...invoice,
                    currency: Array.from(keys)[0] as string,
                  } as PurchaseInvoice);
                }
              }}
            >
              <SelectItem key={"usd"}>USD</SelectItem>
              <SelectItem key={"eur"}>EUR</SelectItem>
              <SelectItem key={"cop"}>COP</SelectItem>
            </Select>
          )}
          <NumberInput
            className={`${
              purchaseOrder.quotationType === "Importación"
                ? "col-span-2"
                : "col-span-3"
            }`}
            startContent={<p className="text-zinc-400">$</p>}
            label="Monto total"
            value={invoice?.amount}
            onValueChange={(value) =>
              invoice &&
              setInvoice({
                ...invoice,
                amount: value as number,
              } as PurchaseInvoice)
            }
            name="totalAmount"
            minValue={0}
            placeholder="Ingresa el monto total"
            labelPlacement="outside"
            variant="bordered"
            isRequired
          />
        </div>
        {purchaseOrder.quotationType === "Importación" && (
          <RadioGroup
            label="¿El envió está incluido?"
            name="shippingIncluded"
            defaultValue={invoice?.deliveryIncluded === true ? "yes" : "no"}
            className="flex flex-col gap-2"
            orientation="horizontal"
            onChange={(e) => {
              setDeliveryIncluded &&
                setDeliveryIncluded(e.target.value === "yes");
              invoice &&
                setInvoice({
                  ...invoice,
                  deliveryIncluded: e.target.value === "yes",
                } as PurchaseInvoice);
            }}
            isRequired
            classNames={{
              label: "text-zinc-950",
            }}
          >
            <Radio value={"yes"}>Si</Radio>
            <Radio value={"no"}>No</Radio>
          </RadioGroup>
        )}
        {(deliveryIncluded || invoice?.deliveryIncluded) && (
          <NumberInput
            startContent={<p className="text-zinc-400">$</p>}
            label="Monto del envió"
            value={invoice?.deliveryAmount}
            onValueChange={(value) =>
              invoice &&
              setInvoice({
                ...invoice,
                deliveryAmount: value as number,
              } as PurchaseInvoice)
            }
            name="deliveryAmount"
            minValue={0}
            placeholder="Ingresa el monto del envió"
            labelPlacement="outside"
            variant="bordered"
          />
        )}
        <Button
          isDisabled={
            purchaseOrder?.state !== "Pend. Envío" &&
            purchaseOrder?.state !== "Pend. Factura"
          }
          type="submit"
          color="primary"
          className="w-full"
        >
          {invoice ? "Actualizar factura" : "Crear factura"}
        </Button>
      </Form>
    </div>
  );
};
