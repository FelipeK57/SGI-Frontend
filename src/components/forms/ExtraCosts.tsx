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
} from "@heroui/react";
import React, { useState } from "react";
import { getCalculateQuotationTotal } from "../../services/clientQuotationService";
import { type ClientQuotation } from "../../Clases";
import { parseDate } from "@internationalized/date";

interface ExtraCostsProps {
  clientQuotation: ClientQuotation;
}

export default function ExtraCosts({ clientQuotation }: ExtraCostsProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [quotationData, setQuotationData] =
    useState<ClientQuotation>(clientQuotation);
  console.log("Quotation Data:", quotationData);

  const incotermOptions = [
    { key: "EXW", label: "EXW - Ex Works" },
    { key: "FCA", label: "FCA - Free Carrier" },
    { key: "CPT", label: "CPT - Carriage Paid To" },
  ];

  const currencyOptions = [{ key: "USD" }, { key: "EUR" }, { key: "COP" }];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form Data:", data);
    const response = await getCalculateQuotationTotal(
      clientQuotation.id as number,
      data
    );
    console.log("Response:", response);
  };

  return (
    <>
      <Button
        className="w-full"
        onPress={onOpen}
        color="primary"
        variant="bordered"
      >
        Registrar costos
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
                  Registro de costos adicionales
                </ModalHeader>
                <ModalBody className="gap-4 w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <Select
                      name="incoterm"
                      variant="bordered"
                      label="Incoterm"
                      defaultSelectedKeys={[quotationData?.incoterm || "EXW"]}
                      onSelectionChange={(keys) => {
                        setQuotationData({
                          ...quotationData,
                          incoterm: Array.from(keys)[0] as string,
                        });
                      }}
                      labelPlacement="outside"
                      placeholder="Selecciona un incoterm"
                      isRequired
                    >
                      {incotermOptions.map((option) => (
                        <SelectItem key={option.key}>{option.label}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      defaultSelectedKeys={[quotationData?.currency || "USD"]}
                      onSelectionChange={(keys) => {
                        setQuotationData({
                          ...quotationData,
                          currency: Array.from(keys)[0] as
                            | "USD"
                            | "EUR"
                            | "COP"
                            | undefined,
                        });
                      }}
                      name="currency"
                      variant="bordered"
                      label="Moneda"
                      labelPlacement="outside"
                      placeholder="Selecciona una moneda"
                      isRequired
                    >
                      {currencyOptions.map((option) => (
                        <SelectItem key={option.key}>{option.key}</SelectItem>
                      ))}
                    </Select>
                    <NumberInput
                      name="exchangeRate"
                      variant="bordered"
                      value={quotationData?.exchangeRate}
                      onValueChange={(value) =>
                        setQuotationData({
                          ...quotationData,
                          exchangeRate: value,
                        })
                      }
                      label="Tasa de cambio"
                      placeholder="4000"
                      labelPlacement="outside"
                      isRequired
                      minValue={0}
                      startContent={<span className="text-zinc-400">$</span>}
                    />
                    <NumberInput
                      value={quotationData?.offerValidity}
                      onValueChange={(value) =>
                        setQuotationData({
                          ...quotationData,
                          offerValidity: value as number,
                        })
                      }
                      name="offerValidity"
                      variant="bordered"
                      label="Validez de la oferta (días)"
                      placeholder="15"
                      labelPlacement="outside"
                      minValue={0}
                      isRequired
                      endContent={<span className="text-zinc-400">días</span>}
                    />
                    <NumberInput
                      value={quotationData?.markupPercentage}
                      onValueChange={(value) =>
                        setQuotationData({
                          ...quotationData,
                          markupPercentage: value as number,
                        })
                      }
                      name="markupPercentage"
                      variant="bordered"
                      label="Porcentaje de markup (%)"
                      placeholder="10"
                      labelPlacement="outside"
                      minValue={0}
                      maxValue={100}
                      isRequired
                      endContent={<span className="text-zinc-400">%</span>}
                    />
                    <NumberInput
                      value={quotationData?.iva}
                      onValueChange={(value) =>
                        setQuotationData({
                          ...quotationData,
                          iva: value as number,
                        })
                      }
                      name="iva"
                      variant="bordered"
                      label="IVA (%)"
                      placeholder="19"
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
                      onValueChange={(value) =>
                        setQuotationData({
                          ...quotationData,
                          freightCost: value as number,
                        })
                      }
                      name="freightCost"
                      variant="bordered"
                      label="Costo de flete"
                      placeholder="1000"
                      labelPlacement="outside"
                      startContent={<span className="text-zinc-400">$</span>}
                      minValue={0}
                      isRequired
                    />
                    <NumberInput
                      value={quotationData?.insuranceCost}
                      onValueChange={(value) =>
                        setQuotationData({
                          ...quotationData,
                          insuranceCost: value as number,
                        })
                      }
                      name="insuranceCost"
                      variant="bordered"
                      placeholder="500"
                      label="Costo de seguro"
                      labelPlacement="outside"
                      startContent={<span className="text-zinc-400">$</span>}
                      minValue={0}
                      isRequired
                    />
                    <NumberInput
                      value={quotationData?.localTransportCost}
                      onValueChange={(value) =>
                        setQuotationData({
                          ...quotationData,
                          localTransportCost: value as number,
                        })
                      }
                      name="localTransportCost"
                      variant="bordered"
                      placeholder="200"
                      label="Transporte local"
                      labelPlacement="outside"
                      startContent={<span className="text-zinc-400">$</span>}
                      minValue={0}
                      isRequired
                    />
                    <NumberInput
                      value={quotationData?.customsDuties}
                      onValueChange={(value) =>
                        setQuotationData({
                          ...quotationData,
                          customsDuties: value as number,
                        })
                      }
                      name="customsDuties"
                      variant="bordered"
                      label="Impuestos aduaneros"
                      placeholder="300"
                      labelPlacement="outside"
                      minValue={0}
                      startContent={<span className="text-zinc-400">$</span>}
                    />
                    <NumberInput
                      value={quotationData?.customsHandlingCost}
                      onValueChange={(value) =>
                        setQuotationData({
                          ...quotationData,
                          customsHandlingCost: value as number,
                        })
                      }
                      name="customsHandlingCost"
                      variant="bordered"
                      label="Gastos de agenciamiento"
                      placeholder="100"
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
                      onChange={(date) =>
                        setQuotationData({
                          ...quotationData,
                          estimatedDeliveryDate: date ? date.toString() : "",
                        })
                      }
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
                    Registrar costos
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
