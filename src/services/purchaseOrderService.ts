import axios from "axios";
import { ENDPOINT } from "../config/apiConfig";

export const getPurchaseOrders = async () => {
  try {
    const response = await axios.get(`${ENDPOINT.PURCHASE_ORDERS}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPurchaseOrderById = async (purchaseOrderId: string) => {
  try {
    const response = await axios.get(`${ENDPOINT.PURCHASE_ORDERS}/${purchaseOrderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getQuotationParts = async (purchaseOrderId: string) => {
  try {
    const response = await axios.get(
      `${ENDPOINT.PURCHASE_ORDERS}/quotation-parts/${purchaseOrderId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};