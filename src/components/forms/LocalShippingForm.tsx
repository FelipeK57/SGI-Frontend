import {
  addToast,
  Button,
  DatePicker,
  Form,
  Input,
  NumberInput,
} from "@heroui/react";
import type { LocalShipping, PurchaseOrder } from "../../Clases";
import { parseDate } from "@internationalized/date";
import {
  createLocalShipping,
  updateLocalShipping,
} from "../../services/localShippingService";

interface LocalShippingFormProps {
  purchaseOrder: PurchaseOrder;
  localShipping?: LocalShipping;
  setLocalShipping: (localShipping: LocalShipping) => void;
  reload: boolean;
  setReload: (reload: boolean) => void;
}

export const LocalShippingForm = ({
  purchaseOrder,
  localShipping,
  setLocalShipping,
  reload,
  setReload,
}: LocalShippingFormProps) => {
  const localShippingHandleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (localShipping) {
      const response = await updateLocalShipping(localShipping);
      if (response && response.status === 200) {
        addToast({
          title: "Envío local actualizado correctamente",
          description: "El envío local se ha actualizado correctamente.",
          timeout: 3000,
          color: "success",
        });
        setReload(!reload);
        return;
      }
    }
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const localShippingData: LocalShipping = {
      purchaseOrder: purchaseOrder as PurchaseOrder,
      dispatchNumber: data.dispatchNumber as string,
      localCarrier: data.localCarrier as string,
      localTrackingNumber: data.localTrackingNumber as string,
      originAddress: data.originAddress as string,
      deliveryDate: data.deliveryDate as string,
      amount: parseFloat(data.amount as string),
      localCarrierInvoiceNumber: data.localCarrierInvoiceNumber as string,
    };
    const response = await createLocalShipping(localShippingData);
    if (response && response.status === 201) {
      addToast({
        title: "Envío local creado correctamente",
        description: "El envío local se ha creado correctamente.",
        timeout: 3000,
        color: "success",
      });
      setReload(!reload);
      return;
    }
  };

  return (
    <div className="flex flex-col gap-2 h-full items-center overflow-y-auto">
      <h2 className="font-semibold">Registro de pago de envío local</h2>
      <Form
        onSubmit={localShippingHandleSubmit}
        className="flex flex-col gap-4 w-full max-w-sm"
      >
        <Input
          label="Número de despacho"
          value={localShipping?.dispatchNumber}
          onChange={(e) =>
            localShipping &&
            setLocalShipping({
              ...localShipping,
              dispatchNumber: e.target.value,
            } as LocalShipping)
          }
          name="dispatchNumber"
          placeholder="Ingresa el número de despacho"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <Input
          label="Nombre del transportista local"
          value={localShipping?.localCarrier}
          onChange={(e) =>
            localShipping &&
            setLocalShipping({
              ...localShipping,
              localCarrier: e.target.value,
            } as LocalShipping)
          }
          name="localCarrier"
          placeholder="Ingresa el nombre del transportista local"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <Input
          label="Número de seguimiento local"
          value={localShipping?.localTrackingNumber}
          onChange={(e) =>
            localShipping &&
            setLocalShipping({
              ...localShipping,
              localTrackingNumber: e.target.value,
            } as LocalShipping)
          }
          name="localTrackingNumber"
          placeholder="Ingresa el número de seguimiento local"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <Input
          label="Dirección de origen"
          value={localShipping?.originAddress}
          onChange={(e) =>
            localShipping &&
            setLocalShipping({
              ...localShipping,
              originAddress: e.target.value,
            } as LocalShipping)
          }
          name="originAddress"
          placeholder="Ingresa la dirección de origen"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <DatePicker
          value={
            localShipping?.deliveryDate
              ? parseDate(localShipping?.deliveryDate.split("T")[0])
              : undefined
          }
          name="deliveryDate"
          onChange={(date) =>
            localShipping &&
            setLocalShipping({
              ...localShipping,
              releaseDate: date ? date.toString() : "",
            } as LocalShipping)
          }
          label="Fecha de entrega"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <NumberInput
          startContent={<p className="text-zinc-400">$</p>}
          label="Monto del envío local"
          value={localShipping?.amount}
          onChange={(value) =>
            localShipping &&
            setLocalShipping({
              ...localShipping,
              amount: value,
            } as LocalShipping)
          }
          name="amount"
          placeholder="Ingresa el monto del envío local"
          labelPlacement="outside"
          variant="bordered"
          isRequired
          minValue={0}
          step={1000}
        />
        <Input
          label="Número de factura del transportista local"
          value={localShipping?.localCarrierInvoiceNumber}
          onChange={(e) =>
            localShipping &&
            setLocalShipping({
              ...localShipping,
              localCarrierInvoiceNumber: e.target.value,
            } as LocalShipping)
          }
          name="localCarrierInvoiceNumber"
          placeholder="Ingresa el número de factura del transportista local"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <Button type="submit" color="primary" className="w-full" isDisabled={purchaseOrder.state === "Finalizada"}>
          {localShipping ? "Actualizar envío local" : "Crear envío local"}
        </Button>
      </Form>
    </div>
  );
};
