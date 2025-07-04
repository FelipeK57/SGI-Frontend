import axios from "axios";
import type { Aduana } from "../Clases";
import { ENDPOINT } from "../config/apiConfig";
import { addToast } from "@heroui/react";

export const createAduana = async (aduana: Aduana) => {
  try {
    const response = axios.post(`${ENDPOINT.ADUANA}`, {
      purchaseOrderId: aduana.purchaseOrder.id,
      declarationDate: aduana.declarationDate,
      declarationNumber: aduana.declarationNumber,
      agencyName: aduana.agencyName,
      agencyContact: aduana.agencyContact,
      amount: aduana.amount,
      releaseDate: aduana.releaseDate,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error al crear la aduana",
          description: error.response.data.message || "Error desconocido",
          color: "danger",
        });
      }
    }
    throw error;
  }
};

export const updateAduana = async (aduana: Aduana) => {
  try {
    const response = axios.put(`${ENDPOINT.ADUANA}/${aduana.id}`, {
      purchaseOrderId: aduana.purchaseOrderId,
      declarationDate: aduana.declarationDate,
      declarationNumber: aduana.declarationNumber,
      agencyName: aduana.agencyName,
      agencyContact: aduana.agencyContact,
      amount: aduana.amount,
      releaseDate: aduana.releaseDate,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error al actualizar la aduana",
          description: error.response.data.message || "Error desconocido",
          color: "danger",
        });
      }
    }
    throw error;
  }
};
