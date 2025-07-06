import { addToast, Input, DatePicker, NumberInput, Button, Form } from "@heroui/react";
import type { PurchaseOrder, Aduana } from "../../Clases";
import { updateAduana, createAduana } from "../../services/aduanaService";
import { parseDate } from "@internationalized/date";

interface AduanaFormProps {
  purchaseOrder: PurchaseOrder;
  aduana?: Aduana;
  setAduana: (aduana: Aduana) => void;
  reload: boolean;
  setReload: (reload: boolean) => void;
}

export const AduanaForm = ({ purchaseOrder, aduana, setAduana, reload, setReload }: AduanaFormProps) => {
  const aduanaHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (aduana) {
      const response = await updateAduana(aduana);
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
    const aduanaData: Aduana = {
      purchaseOrder: purchaseOrder as PurchaseOrder,
      declarationNumber: data.declarationNumber as string,
      declarationDate: new Date(data.declarationDate as string).toISOString(),
      agencyName: data.agencyName as string,
      agencyContact: data.agencyContact as string,
      amount: parseFloat(data.amount as string),
      releaseDate: new Date(data.releaseDate as string).toISOString(),
    };
    const response = await createAduana(aduanaData);
    if (response && response.status === 201) {
      addToast({
        title: "Registro de pago de aduana creado correctamente",
        description: "El registro de pago de aduana se ha guardado correctamente.",
        timeout: 3000,
        color: "success",
      });
      setReload(!reload);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-sm mx-auto h-full overflow-y-auto">
      <h2 className="font-semibold">Registro de pago a aduana</h2>
      <Form
        onSubmit={aduanaHandleSubmit}
        className="flex flex-col gap-4 w-full"
      >
        <Input
          label="Número de declaración"
          value={aduana?.declarationNumber}
          onChange={(e) =>
            aduana &&
            setAduana({
              ...aduana,
              declarationNumber: e.target.value,
            } as Aduana)
          }
          name="declarationNumber"
          placeholder="Ingresa el número de declaración"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <DatePicker
          value={
            aduana?.declarationDate
              ? parseDate(aduana?.declarationDate.split("T")[0])
              : undefined
          }
          name="declarationDate"
          onChange={(date) =>
            aduana &&
            setAduana({
              ...aduana,
              declarationDate: date ? date.toString() : "",
            } as Aduana)
          }
          label="Fecha de declaración"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <Input
          label="Nombre de la agencia aduanera"
          value={aduana?.agencyName}
          onChange={(e) =>
            aduana &&
            setAduana({
              ...aduana,
              agencyName: e.target.value,
            } as Aduana)
          }
          name="agencyName"
          placeholder="Ingresa el nombre de la agencia aduanera"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <Input
          label="Contacto de la agencia aduanera"
          value={aduana?.agencyContact}
          onChange={(e) =>
            aduana &&
            setAduana({
              ...aduana,
              agencyContact: e.target.value,
            } as Aduana)
          }
          name="agencyContact"
          placeholder="Ingresa el contacto de la agencia aduanera"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <NumberInput
          startContent={<p className="text-zinc-400">$</p>}
          label="Total de impuestos pagados"
          value={aduana?.amount}
          onValueChange={(value) =>
            aduana &&
            setAduana({
              ...aduana,
              amount: value as number,
            } as Aduana)
          }
          name="amount"
          minValue={0}
          step={10}
          placeholder="Ingresa el monto total de impuestos"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <DatePicker
          value={
            aduana?.releaseDate
              ? parseDate(aduana?.releaseDate.split("T")[0])
              : undefined
          }
          name="releaseDate"
          onChange={(date) =>
            aduana &&
            setAduana({
              ...aduana,
              releaseDate: date ? date.toString() : "",
            } as Aduana)
          }
          label="Fecha de levante"
          labelPlacement="outside"
          variant="bordered"
          isRequired
        />
        <Button
          isDisabled={purchaseOrder?.state !== "Pend. Aduana" && purchaseOrder?.state !== "Pend. Entrega"}
          color="primary"
          className="w-full"
          type="submit"
        >
          {aduana?.id ? "Actualizar aduana" : "Crear aduana"}
        </Button>
      </Form>
    </div>
  )
}