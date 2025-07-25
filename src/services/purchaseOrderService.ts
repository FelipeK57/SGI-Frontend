import axios from "axios";
import { ENDPOINT } from "../config/apiConfig";
import { addToast } from "@heroui/react";

export const createPurchaseOrder = async (purchaseOrderData: any) => {
  try {
    const response = await axios.post(
      `${ENDPOINT.PURCHASE_ORDERS}`,
      purchaseOrderData
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error",
          description:
            error.response.data.message || "Error al crear la orden de compra",
          color: "danger",
          timeout: 5000,
        });
      }
    }
  }
};

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
    const response = await axios.get(
      `${ENDPOINT.PURCHASE_ORDERS}/${purchaseOrderId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// export const getQuotationParts = async (purchaseOrderId: string) => {
//   try {
//     const response = await axios.get(
//       `${ENDPOINT.PURCHASE_ORDERS}/quotation-parts/${purchaseOrderId}`
//     );
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
