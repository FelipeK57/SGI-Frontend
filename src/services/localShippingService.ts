import axios from "axios";
import { ENDPOINT } from "../config/apiConfig";
import type { LocalShipping } from "../Clases";
import { addToast } from "@heroui/react";

export const createLocalShipping = async (localShipping: LocalShipping) => {
  try {
    console.log(localShipping);
    const response = await axios.post(ENDPOINT.LOCAL_SHIPPING, {
      purchaseOrderId: localShipping.purchaseOrder.id,
      dispatchNumber: localShipping.dispatchNumber,
      localCarrier: localShipping.localCarrier,
      localTrackingNumber: localShipping.localTrackingNumber,
      localCarrierInvoiceNumber: localShipping.localCarrierInvoiceNumber,
      originAddress: localShipping.originAddress,
      deliveryDate: localShipping.deliveryDate,
      amount: localShipping.amount,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error al crear el envío local",
          description: error.response.data.message || "Error desconocido",
          color: "danger",
        });
      }
    }
    throw error;
  }
};

export const updateLocalShipping = async (localShipping: LocalShipping) => {
  try {
    const response = await axios.put(
      `${ENDPOINT.LOCAL_SHIPPING}/${localShipping.purchaseOrder.id}`,
      {
        purchaseOrderId: localShipping.purchaseOrderId,
        dispatchNumber: localShipping.dispatchNumber,
        localCarrier: localShipping.localCarrier,
        localTrackingNumber: localShipping.localTrackingNumber,
        originAddress: localShipping.originAddress,
        deliveryDate: localShipping.deliveryDate,
        amount: localShipping.amount,
        localCarrierInvoiceNumber: localShipping.localCarrierInvoiceNumber,
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error al actualizar el envío local",
          description: error.response.data.message || "Error desconocido",
          color: "danger",
        });
      }
    }
    throw error;
  }
};
