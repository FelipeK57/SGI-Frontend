import axios from "axios";
import { ENDPOINT } from "../config/apiConfig";
import type { PurchaseInvoice } from "../Clases";
import { addToast } from "@heroui/react";

export const createPurchaseInvoice = async (purchaseInvoice: PurchaseInvoice) => {
  try {
    const response = await axios.post(`${ENDPOINT.PURCHASE_INVOICES}/`, {
      purchaseOrderId: purchaseInvoice.purchaseOrder.id,
      invoiceNumber: purchaseInvoice.invoiceNumber,
      date: purchaseInvoice.date,
      amount: purchaseInvoice.amount,
      deliveryIncluded: purchaseInvoice.deliveryIncluded,
      quotationType: purchaseInvoice.purchaseOrder.providerQuotation.quotationType,
      currency: purchaseInvoice.currency,
      deliveryAmount: purchaseInvoice.deliveryAmount,
    });
    return response;
  } catch (error) {
    throw error
  }
}

export const updatePurchaseInvoice = async (purchaseInvoice: PurchaseInvoice) => {
  try {
    const response = await axios.put(`${ENDPOINT.PURCHASE_INVOICES}/${purchaseInvoice.id}`, {
      invoiceNumber: purchaseInvoice.invoiceNumber,
      date: purchaseInvoice.date,
      amount: purchaseInvoice.amount,
      deliveryIncluded: purchaseInvoice.deliveryIncluded,
      currency: purchaseInvoice.currency,
      deliveryAmount: purchaseInvoice.deliveryAmount,
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error al actualizar la factura de compra",
          description: error.response.data.message || "Error desconocido",
          color: "danger",
        })
      }
    }
    throw error
  }
}