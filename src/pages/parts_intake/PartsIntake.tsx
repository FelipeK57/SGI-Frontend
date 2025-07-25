import { addToast, Button, Form, Input } from "@heroui/react";
import { useNavigate } from "react-router";
import { ArrowLeftIcon } from "../part/DetailsPart";
import { useEffect, useState } from "react";
import type { QuotationPart } from "../../Clases";
import { getQuotationParts } from "../../services/clientQuotationService";
import { createPartsIntake } from "../../services/partsIntakeService";
export const PartsIntake = () => {
  const navigate = useNavigate();
  const purchaseOrderId = window.location.pathname.split("/").pop() || "";
  const [quotationParts, setQuotationParts] = useState<QuotationPart[]>([]);
  const [quotationPartsStock, setQuotationPartsStock] = useState<
    QuotationPart[]
  >([]);
  const [partSelected, setPartSelected] = useState<QuotationPart | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [finalized, setFinalized] = useState<boolean>(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    const fetchQuotationParts = async () => {
      const response = await getQuotationParts(purchaseOrderId);
      setQuotationParts(response.quotationParts);
      setQuotationPartsStock(response.quotationPartsStock);
    };
    fetchQuotationParts();
  }, [purchaseOrderId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!partSelected) return;
    setIsLoading(true);

    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const data = {
      purchaseOrderId,
      quotationPartId: partSelected.id,
      partId: partSelected.part.id,
      partNumber: partSelected.part.partNumber,
      serial: formData.serial,
      partImage: event.currentTarget.partImage.files?.[0],
    };

    const response = await createPartsIntake(data);
    if (response && response.status === 201) {
      setQuotationParts((prev) =>
        prev.map((part) =>
          part.id === partSelected.id
            ? { ...part, receivedQuantity: (part.receivedQuantity || 0) + 1 }
            : part
        )
      );
      setQuotationPartsStock((prev) =>
        prev.map((part) =>
          part.id === partSelected.id
            ? { ...part, receivedQuantity: (part.receivedQuantity || 0) + 1 }
            : part
        )
      );
      
      setPartSelected(null);

      addToast({
        title: "Parte ingresada",
        description: "La parte se ha ingresado correctamente.",
        color: "success",
        timeout: 3000,
      });
    }

    if (response && response.data.finalized) {
      addToast({
        title: "Orden de compra finalizada",
        description: "Todas las partes han sido ingresadas correctamente.",
        color: "success",
        timeout: 3000,
      });
      navigate(`/dashboard/purchase-orders/${purchaseOrderId}`);
    }
    setIsLoading(false);
  };

  const styleSelect = (id: number) => {
    if (partSelected && id === partSelected.id) {
      return "border-2 border-primary";
    }
  };

  return (
    <main className="flex flex-col gap-4 h-full overflow-hidden">
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
      <div className="flex flex-col md:grid md:grid-cols-2 gap-2 h-full overflow-hidden">
        <div className="flex flex-col gap-4 h-fit">
          {partSelected ? (
            <p className="text-sm text-zinc-700">
              Parte seleccionada para el ingreso:{" "}
              <span className="font-semibold text-zinc-950">
                {partSelected.part.name}
              </span>
            </p>
          ) : (
            <p className="text-sm text-zinc-700">
              Seleccione una parte para continuar con el ingreso
            </p>
          )}
          <Form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 h-full overflow-y-auto"
          >
            <Input
              label="Número de parte"
              labelPlacement="outside"
              name="partNumber"
              placeholder="Número de parte de la selección"
              value={partSelected?.part.partNumber}
              readOnly
              isRequired
              variant="bordered"
            />
            <Input
              label="Serial"
              isRequired
              labelPlacement="outside"
              variant="bordered"
              name="serial"
              placeholder="Ingrese el serial de la parte recibida"
            />
            <div className="flex flex-col gap-2 w-full">
              <Input
                onChange={handleImageChange}
                isRequired
                type="file"
                name="partImage"
                label="Imagen"
                placeholder="Selecciona una imagen"
                labelPlacement="outside"
                variant="bordered"
              />
              <div className="flex flex-col gap-1">
                <span className="text-xs hidden sm:block md:mx-auto">
                  Vista previa
                </span>
                <img
                  src={imagePreview || "/default.png"}
                  alt="Vista previa"
                  className="hidden sm:block w-full md:w-1/2 md:mx-auto aspect-square bg-zinc-100 object-contain p-2 rounded-md"
                />
              </div>
            </div>
            <Button
              isLoading={isLoading}
              isDisabled={!partSelected}
              color="primary"
              className="w-full"
              type="submit"
            >
              {isLoading ? "Cargando..." : "Ingresar parte"}
            </Button>
          </Form>
        </div>
        <div className="flex flex-col gap-2 h-full overflow-hidden">
          <p>Lista de partes</p>
          <p className="text-sm text-zinc-700">
            Selecciona una parte para continuar con el ingreso
          </p>
          <div className="flex flex-col gap-2 h-full overflow-y-auto">
            {quotationParts.length > 0 &&
              quotationParts.map((quotationPart) =>
                quotationPart.quantity <=
                (quotationPart.receivedQuantity || 0) ? null : (
                  <div
                    onClick={() => {
                      setPartSelected(quotationPart);
                    }}
                    className={`flex border-1 p-2 gap-4 rounded-md cursor-pointer active:scale-95 group transition-all ${styleSelect(
                      quotationPart.id as number
                    )}`}
                    key={quotationPart.id}
                  >
                    <div className="flex w-1/3 md:w-1/4 overflow-hidden">
                      <img
                        src={quotationPart.part.image}
                        alt={quotationPart.part.name}
                        className="aspect-square object-contain bg-zinc-100 group-hover:scale-110 transition-transform rounded-md"
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <p className="font-semibold">{quotationPart.part.name}</p>
                      <p className="text-xs">
                        <span className="text-zinc-700">Número de parte:</span>{" "}
                        {quotationPart.part.partNumber}
                      </p>
                      <p className="text-xs">
                        <span className="text-zinc-700">Productor:</span>{" "}
                        {quotationPart.part.producer}
                      </p>
                      <p className="text-xs">
                        <span className="text-zinc-700">Cantidad:</span>{" "}
                        {quotationPart.quantity -
                          (quotationPart.receivedQuantity || 0)}
                      </p>
                      <p className="text-xs">
                        <span className="text-zinc-700">Cotización:</span>{" "}
                        {quotationPart.clientQuotation?.code}
                      </p>
                    </div>
                  </div>
                )
              )}
            {quotationPartsStock.length > 0 &&
              quotationPartsStock.map((quotationPart) =>
                quotationPart.quantity <=
                (quotationPart.receivedQuantity || 0) ? null : (
                  <div
                    onClick={() => {
                      setPartSelected(quotationPart);
                    }}
                    className={`flex border-1 p-2 gap-4 rounded-md cursor-pointer active:scale-95 group transition-all ${styleSelect(
                      quotationPart.id as number
                    )}`}
                    key={quotationPart.id}
                  >
                    <div className="flex w-1/3 md:w-1/4 overflow-hidden">
                      <img
                        src={quotationPart.part.image}
                        alt={quotationPart.part.name}
                        className="aspect-square object-contain bg-zinc-100 group-hover:scale-110 transition-transform rounded-md"
                      />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <p className="font-semibold">{quotationPart.part.name}</p>
                      <p className="text-xs">
                        <span className="text-zinc-700">Número de parte:</span>{" "}
                        {quotationPart.part.partNumber}
                      </p>
                      <p className="text-xs">
                        <span className="text-zinc-700">Productor:</span>{" "}
                        {quotationPart.part.producer}
                      </p>
                      <p className="text-xs">
                        <span className="text-zinc-700">Cantidad:</span>{" "}
                        {quotationPart.quantity -
                          (quotationPart.receivedQuantity || 0)}
                      </p>
                      <p className="text-xs">
                        <span className="text-zinc-700">Para:</span> Stock
                        SEMCON
                      </p>
                    </div>
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    </main>
  );
};
