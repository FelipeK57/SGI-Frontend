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

export const getClientQuotationById = async (quotationId: string) => {
  try {
    const response = await axios.get(
      `${ENDPOINT.CLIENT_QUOTATIONS}/${quotationId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateClientQuotation = async (
  quotationId: string,
  state: string,
  parts: PartAdded[]
) => {
  try {
    const response = await axios.put(`${ENDPOINT.CLIENT_QUOTATIONS}/`, {
      clientQuotationId: quotationId,
      state,
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

export const deleteQuotationPart = async (quotationId: string) => {
  try {
    const response = await axios.delete(
      `${ENDPOINT.QUOTATION_PART}/${quotationId}`
    );
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

export const getQuotationParts = async (purchaseOrderId: string) => {
  try {
    const response = await axios.get(`${ENDPOINT.QUOTATION_PART}/${purchaseOrderId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getClientQuotationByCode = async (quotationCode: string) => {
  try {
    const response = await axios.get(
      `${ENDPOINT.CLIENT_QUOTATIONS}/code/${quotationCode}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Problemas",
          description: error.response.data.message,
          color: "warning",
          timeout: 3000,
        });
      }
      throw error;
    }  
  }
};
