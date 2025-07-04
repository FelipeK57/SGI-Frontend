import { addToast, Input, DatePicker, NumberInput, Button, Form } from "@heroui/react";
import type { PurchaseOrder, Delivery } from "../../Clases";
import { updateDelivery, createDelivery } from "../../services/deliveryService";
import { parseDate } from "@internationalized/date";


interface DeliveryFormProps {
  purchaseOrder: PurchaseOrder;
  delivery?: Delivery;
  setDelivery: (delivery: Delivery) => void;
  reload: boolean;
  setReload: (reload: boolean) => void;
}

export const DeliveryForm = ({ purchaseOrder, delivery, setDelivery, reload, setReload }: DeliveryFormProps) => {
  const deliveryHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (delivery) {
      const response = await updateDelivery(delivery);
      if (response && response.status === 200) {
        addToast({
          title: "Factura de envió actualizada correctamente",
          description: "La factura se ha actualizado correctamente.",
          timeout: 3000,
          color: "success",
        });
        setReload(!reload);
        return;
      }
    }
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const deliveryData: Delivery = {
      deliveryNumber: data.deliveryNumber as string,
      purchaseOrder: purchaseOrder as PurchaseOrder,
      carrier: data.carrier as string,
      trackerNumber: data.trackerNumber as string,
      deliveryDate: new Date(data.deliveryDate as string).toISOString(),
      estimatedDeliveryDate: new Date(data.estimatedDeliveryDate as string).toISOString(),
      cost: parseFloat(data.cost as string),
    };
    const response = await createDelivery(deliveryData);
    if (response && response.status === 201) {
      addToast({
        title: "Envío registrado correctamente",
        description: "El envío se ha guardado correctamente.",
        timeout: 3000,
        color: "success",
      });
      setReload(!reload);
    }
  }

  return (
    <div className="flex flex-col gap-2 max-w-sm mx-auto h-full overflow-y-auto">
      <h2 className="font-semibold">Registro de la factura de envío internacional</h2>
      <Form onSubmit={deliveryHandleSubmit} className="flex flex-col gap-4 w-full">
        <Input
          value={delivery?.deliveryNumber}
          onChange={(e) =>
            delivery &&
            setDelivery({
              ...delivery,
              deliveryNumber: e.target.value,
            } as Delivery)
          }
          label="Número de envío"
          name="deliveryNumber"
          placeholder="Ingresa el número de envío"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <Input
          value={delivery?.carrier}
          onChange={(e) =>
            delivery &&
            setDelivery({
              ...delivery,
              carrier: e.target.value,
            } as Delivery)
          }
          label="Transportadora"
          name="carrier"
          placeholder="Ingresa el nombre del transportador"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <Input
          value={delivery?.trackerNumber}
          onChange={(e) =>
            delivery &&
            setDelivery({
              ...delivery,
              trackerNumber: e.target.value,
            } as Delivery)
          }
          label="Número de rastreo"
          name="trackerNumber"
          placeholder="Ingresa el número de rastreo"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <DatePicker
          name="deliveryDate"
          label="Fecha de envío"
          labelPlacement="outside"
          variant="bordered"
          isRequired
          value={
            delivery?.deliveryDate
              ? parseDate(delivery.deliveryDate.split("T")[0])
              : undefined
          }
          onChange={(date) => {
            delivery &&
              setDelivery({
                ...delivery,
                deliveryDate: date ? date.toString() : "",
              } as Delivery);
          }
          }
        />
        <DatePicker
          name="estimatedDeliveryDate"
          label="Fecha estimada de entrega"
          labelPlacement="outside"
          variant="bordered"
          isRequired
          value={
            delivery?.estimatedDeliveryDate
              ? parseDate(delivery.estimatedDeliveryDate.split("T")[0])
              : undefined
          }
          onChange={(date) => {
            delivery &&
              setDelivery({
                ...delivery,
                estimatedDeliveryDate: date ? date.toString() : "",
              } as Delivery);
          }}
        />
        <NumberInput
          startContent={<p className="text-zinc-400">$</p>}
          label="Costo del envío"
          name="cost"
          value={delivery?.cost}
          minValue={0}
          step={10}
          placeholder="Ingresa el costo del envío"
          labelPlacement="outside"
          variant="bordered"
          isRequired
          onValueChange={(value) => {
            delivery &&
              setDelivery({
                ...delivery,
                cost: value as number,
              } as Delivery);
          }}
        />
        <Button
          isDisabled={purchaseOrder?.state !== "Pend. Envío" && purchaseOrder?.state !== "Pend. Factura"}
          color="primary"
          className="w-full"
          type="submit"
        >
          {delivery ? "Actualizar envío" : "Crear envío"}
        </Button>
      </Form>
    </div>
  )
}