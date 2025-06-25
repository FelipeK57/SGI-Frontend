import { ENDPOINT } from "../config/apiConfig";
import axios from "axios";
import type { QuotationAdded } from "../pages/provider_quotation/NewProviderQuotation";
import { addToast } from "@heroui/react";

export const getProviderQuotations = async () => {
  try {
    const response = await axios.get(`${ENDPOINT.PROVIDER_QUOTATIONS}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createProviderQuotation = async (
  providerId: number,
  quotationType: string,
  quotations: QuotationAdded[]
) => {
  try {
    const response = await axios.post(`${ENDPOINT.PROVIDER_QUOTATIONS}`, {
      providerId,
      quotationType,
      quotations,
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
    }
  }
};

export const getProviderQuotationById = async (quotationId: string) => {
  try {
    const response = await axios.get(
      `${ENDPOINT.PROVIDER_QUOTATIONS}/${quotationId}`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProviderQuotation = async (
  quotationId: string,
  state: string,
  quotations: QuotationAdded[]
) => {
  try {
    const response = await axios.put(`${ENDPOINT.PROVIDER_QUOTATIONS}/`, {
      providerQuotationId: quotationId,
      state,
      quotations,
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
    }
  }
};

export const deleteClientQuotation = async (quotationId: number) => {
  try {
    const response = await axios.delete(
      `${ENDPOINT.PROVIDER_QUOTATIONS}/quotation/${quotationId}`
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
    }
  }
}