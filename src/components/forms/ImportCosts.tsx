import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
  DatePicker,
  NumberInput,
  Form,
  addToast,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { getCalculateImportTotalPrice } from "../../services/clientQuotationService";
import { type ClientQuotation } from "../../Clases";
import { parseDate } from "@internationalized/date";

interface ImportCostsProps {
  clientQuotation: ClientQuotation;
  reload: boolean;
  setReload: (reload: boolean) => void;
}

export const ImportCosts = ({ clientQuotation, reload, setReload }: ImportCostsProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [quotationData, setQuotationData] = useState<ClientQuotation | null>(
    null
  );
  useEffect(() => {
    if (clientQuotation) {
      setQuotationData(clientQuotation);
    }
  }, [clientQuotation]);

  const [isLoading, setIsLoading] = useState(false);

  const incotermOptions = [
    { key: "EXW", label: "EXW - Ex Works" },
    { key: "FCA", label: "FCA - Free Carrier" },
    { key: "CPT", label: "CPT - Carriage Paid To" },
  ];

  const currencyOptions = [{ key: "USD" }, { key: "EUR" }, { key: "COP" }];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const response = await getCalculateImportTotalPrice(
        clientQuotation.id as number,
        data
      );
      if (response && response.status === 200) {
        setQuotationData({
          ...quotationData,
          ...response.data.quotation,
        });
        addToast({
          title: "Costos registrados",
          description:
            "Los costos adicionales se han registrado correctamente.",
          color: "success",
          timeout: 3000,
        });
        setReload(!reload);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error calculating quotation total:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        className="w-full px-6"
        onPress={onOpen}
        color="primary"
        variant="bordered"
      >
        Costos de importación
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="outside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <Form onSubmit={handleSubmit} className="flex flex-col">
                <ModalHeader className="flex flex-col gap-1">
                  Costos de importación
                </ModalHeader>
                <ModalBody className="gap-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <Select
                      name="incoterm"
                      variant="bordered"
                      label="Incoterm"
                      defaultSelectedKeys={[quotationData?.incoterm || "EXW"]}
                      onSelectionChange={(keys) => {
                        if (quotationData) {
                          setQuotationData({
                            ...quotationData,
                            incoterm: Array.from(keys)[0] as string,
                          });
                        }
                      }}
                      labelPlacement="outside"
                      placeholder="Selecciona un incoterm"
                      isRequired
                      disallowEmptySelection
                    >
                      {incotermOptions.map((option) => (
                        <SelectItem key={option.key}>{option.label}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      defaultSelectedKeys={[quotationData?.currency || "USD"]}
                      onSelectionChange={(keys) => {
                        if (quotationData) {
                          setQuotationData({
                            ...quotationData,
                            currency: Array.from(keys)[0] as
                              | "USD"
                              | "EUR"
                              | "COP"
                              | undefined,
                          });
                        }
                      }}
                      name="currency"
                      variant="bordered"
                      label="Moneda"
                      labelPlacement="outside"
                      placeholder="Selecciona una moneda"
                      isRequired
                      disallowEmptySelection
                    >
                      {currencyOptions.map((option) => (
                        <SelectItem key={option.key}>{option.key}</SelectItem>
                      ))}
                    </Select>
                    <NumberInput
                      name="exchangeRate"
                      variant="bordered"
                      value={quotationData?.exchangeRate}
                      onValueChange={(value) => {
                        if (quotationData) {
                          setQuotationData({
                            ...quotationData,
                            exchangeRate: value,
                          });
                        }
                      }}
                      label="Tasa de cambio"
                      placeholder="Ingrese la tasa de cambio"
                      labelPlacement="outside"
                      isRequired
                      minValue={0}
                      startContent={<span className="text-zinc-400">$</span>}
                    />
                    <NumberInput
                      value={quotationData?.offerValidity}
                      onValueChange={(value) => {
                        if (quotationData) {
                          setQuotationData({
                            ...quotationData,
                            offerValidity: value as number,
                          });
                        }
                      }}
                      name="offerValidity"
                      variant="bordered"
                      label="Validez de la oferta (días)"
                      placeholder="Ingrese la validez de la oferta"
                      labelPlacement="outside"
                      minValue={1}
                      isRequired
                      endContent={<span className="text-zinc-400">días</span>}
                    />
                    <NumberInput
                      value={quotationData?.markupPercentage}
                      onValueChange={(value) => {
                        if (quotationData) {
                          setQuotationData({
                            ...quotationData,
                            markupPercentage: value as number,
                          });
                        }
                      }}
                      name="markupPercentage"
                      variant="bordered"
                      label="Porcentaje de ganancia (%)"
                      placeholder="Ingrese el porcentaje de ganancia"
                      labelPlacement="outside"
                      minValue={0}
                      maxValue={100}
                      isRequired
                      endContent={<span className="text-zinc-400">%</span>}
                    />
                    <NumberInput
                      value={quotationData?.iva}
                      onValueChange={(value) => {
                        if (quotationData) {
                          setQuotationData({
                            ...quotationData,
                            iva: value as number,
                          });
                        }
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <NumberInput
                      value={quotationData?.freightCost}
                      onValueChange={(value) => {
                        if (quotationData) {
                          setQuotationData({
                            ...quotationData,
                            freightCost: value as number,
                          });
                        }
                      }}
                      name="freightCost"
                      variant="bordered"
                      label="Costo de flete"
                      placeholder="Ingrese el costo de flete"
                      labelPlacement="outside"
                      startContent={<span className="text-zinc-400">$</span>}
                      minValue={0}
                      isRequired
                    />
                    <NumberInput
                      value={quotationData?.insuranceCost}
                      onValueChange={(value) => {
                        if (quotationData) {
                          setQuotationData({
                            ...quotationData,
                            insuranceCost: value as number,
                          });
                        }
                      }}
                      name="insuranceCost"
                      variant="bordered"
                      placeholder="Ingrese el costo de seguro"
                      label="Costo de seguro"
                      labelPlacement="outside"
                      startContent={<span className="text-zinc-400">$</span>}
                      minValue={0}
                      isRequired
                    />
                    <NumberInput
                      value={quotationData?.localTransportCost}
                      onValueChange={(value) => {
                        if (quotationData) {
                          setQuotationData({
                            ...quotationData,
                            localTransportCost: value as number,
                          });
                        }
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
                    <NumberInput
                      value={quotationData?.customsDuties}
                      onValueChange={(value) => {
                        if (quotationData) {
                          setQuotationData({
                            ...quotationData,
                            customsDuties: value as number,
                          });
                        }
                      }}
                      name="customsDuties"
                      variant="bordered"
                      label="Impuestos aduaneros"
                      placeholder="Ingrese los impuestos aduaneros"
                      labelPlacement="outside"
                      minValue={0}
                      startContent={<span className="text-zinc-400">$</span>}
                    />
                    <NumberInput
                      value={quotationData?.customsHandlingCost}
                      onValueChange={(value) => {
                        if (quotationData) {
                          setQuotationData({
                            ...quotationData,
                            customsHandlingCost: value as number,
                          });
                        }
                      }}
                      name="customsHandlingCost"
                      variant="bordered"
                      label="Gastos de agenciamiento"
                      placeholder="Ingrese los gastos de agenciamiento"
                      labelPlacement="outside"
                      startContent={<span className="text-zinc-400">$</span>}
                      minValue={0}
                    />
                    <DatePicker
                      value={
                        quotationData?.estimatedDeliveryDate
                          ? parseDate(quotationData.estimatedDeliveryDate)
                          : null
                      }
                      onChange={(date) => {
                        if (quotationData) {
                          setQuotationData({
                            ...quotationData,
                            estimatedDeliveryDate: date ? date.toString() : "",
                          });
                        }
                      }}
                      name="estimatedDeliveryDate"
                      variant="bordered"
                      label="Fecha estimada de entrega"
                      labelPlacement="outside"
                      isRequired
                    />
                  </div>
                </ModalBody>
                <ModalFooter className="w-full">
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancelar
                  </Button>
                  <Button color="primary" type="submit">
                    {isLoading ? "Registrando..." : "Registrar costos"}
                  </Button>
                </ModalFooter>
              </Form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
