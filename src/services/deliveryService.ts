import { ENDPOINT } from "../config/apiConfig";
import type { Delivery } from "../Clases";
import axios from "axios";
import { addToast } from "@heroui/react";

export const createDelivery = async (delivery: Delivery) => {
  try {
    const response = await axios.post(ENDPOINT.DELIVERY, {
      deliveryNumber: delivery.deliveryNumber,
      purchaseOrderId: delivery.purchaseOrder.id,
      carrier: delivery.carrier,
      trackerNumber: delivery.trackerNumber,
      deliveryDate: delivery.deliveryDate,
      estimatedDeliveryDate: delivery.estimatedDeliveryDate,
      cost: delivery.cost,
      quotationType: delivery.purchaseOrder.quotationType,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error al crear el envío",
          description: error.response.data.message || "Error desconocido",
          color: "danger",
        });
      }
    }
    console.error(error);
    throw error;
  }
};

export const updateDelivery = async (delivery: Delivery) => {
  try {
    const response = await axios.put(`${ENDPOINT.DELIVERY}/${delivery.id}`, {
      deliveryNumber: delivery.deliveryNumber,
      carrier: delivery.carrier,
      trackerNumber: delivery.trackerNumber,
      deliveryDate: delivery.deliveryDate,
      estimatedDeliveryDate: delivery.estimatedDeliveryDate,
      cost: delivery.cost,
      purchaseOrderId: delivery.purchaseOrderId,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error al actualizar el envío",
          description: error.response.data.message || "Error desconocido",
          color: "danger",
        });
      }
    }
    throw error;
  }
};
