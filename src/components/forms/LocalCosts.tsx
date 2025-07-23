import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Form,
  NumberInput,
  addToast,
  DatePicker,
} from "@heroui/react";
import { useEffect, useState } from "react";
import type { ClientQuotation } from "../../Clases";
import { getCalculateLocalTotalPrice } from "../../services/clientQuotationService";
import { parseDate } from "@internationalized/date";

interface LocalCostsProps {
  quotation: ClientQuotation;
  reload: boolean;
  setReload: (reload: boolean) => void;
}

export const LocalCosts = ({
  quotation,
  reload,
  setReload,
}: LocalCostsProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [quotationData, setQuotationData] =
    useState<ClientQuotation>(quotation);

  useEffect(() => {
    setQuotationData(quotation);
  }, [quotation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {
      offerValidity: quotationData?.offerValidity || 0,
      markupPercentage: quotationData?.markupPercentage || 0,
      iva: quotationData?.iva || 0,
      localTransportCost: quotationData?.localTransportCost || 0,
      estimatedDeliveryDate: quotationData?.estimatedDeliveryDate || "",
    };
    console.log("Form Data:", data);
    try {
      const response = await getCalculateLocalTotalPrice(
        quotation.id as number,
        data
      );
      if (response && response.status === 200) {
        setQuotationData({
          ...quotationData,
          ...response.data,
        });
        addToast({
          title: "Éxito",
          description: "Costos de compra local registrados correctamente.",
          color: "success",
          timeout: 3000,
        });
        setReload(!reload);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="w-full px-6"
        color="primary"
        variant="bordered"
      >
        Costos de compra local
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <Form onSubmit={handleSubmit} className="flex flex-col w-full">
                <ModalHeader className="flex flex-col gap-1 w-full">
                  Costos de compra local
                </ModalHeader>
                <ModalBody className="w-full">
                  <NumberInput
                    value={quotationData?.offerValidity}
                    onValueChange={(value) => {
                      setQuotationData({
                        ...quotationData,
                        offerValidity: value,
                      });
                    }}
                    label="Validez de la oferta (días)"
                    name="offerValidity"
                    labelPlacement="outside"
                    placeholder="Ingrese la validez de la oferta"
                    endContent={<span className="text-gray-500">días</span>}
                    minValue={1}
                    variant="bordered"
                    isRequired
                  />
                  <NumberInput
                    value={quotationData?.markupPercentage}
                    onValueChange={(value) => {
                      setQuotationData({
                        ...quotationData,
                        markupPercentage: value,
                      });
                    }}
                    name="markupPercentage"
                    variant="bordered"
                    label="Porcentaje de ganancia (%)"
                    placeholder="Ingrese el porcentaje de ganancia"
                    endContent={<span className="text-gray-500">%</span>}
                    labelPlacement="outside"
                    minValue={0}
                    maxValue={100}
                    isRequired
                  />
                  <NumberInput
                    value={quotationData?.iva || 0}
                    onValueChange={(value) => {
                      setQuotationData({
                        ...quotationData,
                        iva: value as number,
                      });
                    }}
                    name="iva"
                    variant="bordered"
                    label="IVA (%)"
                    placeholder="Ingrese el IVA"
                    labelPlacement="outside"
                    minValue={0}
                    step={19}
                    maxValue={19}
                    endContent={<span className="text-zinc-400">%</span>}
                  />
                  <NumberInput
                    value={
                      quotationData?.localTransportCost === 0
                        ? undefined
                        : quotationData?.localTransportCost
                    }
                    onValueChange={(value) => {
                      setQuotationData({
                        ...quotationData,
                        localTransportCost: value as number,
                      });
                    }}
                    name="localTransportCost"
                    variant="bordered"
                    placeholder="Ingrese el costo de transporte local"
                    label="Transporte local"
                    labelPlacement="outside"
                    startContent={<span className="text-zinc-400">$</span>}
                    minValue={0}
                    isRequired
                  />
                  <DatePicker
                    value={
                      quotationData?.estimatedDeliveryDate
                        ? parseDate(quotationData.estimatedDeliveryDate)
                        : null
                    }
                    onChange={(date) => {
                      setQuotationData({
                        ...quotationData,
                        estimatedDeliveryDate: date ? date.toString() : "",
                      });
                    }}
                    name="estimatedDeliveryDate"
                    variant="bordered"
                    label="Fecha estimada de entrega"
                    labelPlacement="outside"
                    isRequired
                  />
                </ModalBody>
                <ModalFooter className="w-full">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button isLoading={isLoading} color="primary" type="submit">
                    {isLoading ? "Registrando" : "Registrar costos"}
                  </Button>
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
