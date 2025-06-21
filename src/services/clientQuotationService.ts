import axios from "axios";
import { ENDPOINT } from "../config/apiConfig";
import type { PartAdded } from "../pages/client_quotation/NewClientQuotation";
import { addToast } from "@heroui/react";

export const getClientQuotations = async () => {
  try {
    const response = await axios.get(`${ENDPOINT.CLIENT_QUOTATIONS}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createClientQuotation = async (
  clientId: number,
  parts: PartAdded[]
) => {
  try {
    const response = await axios.post(`${ENDPOINT.CLIENT_QUOTATIONS}`, {
      clientId,
      parts,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error",
          description: error.response.data.message,
          color: "danger",
          timeout: 3000,
        });
      }
      throw error;
    }
  }
};
