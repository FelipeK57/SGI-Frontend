import axios from "axios";
import { ENDPOINT } from "../config/apiConfig";
import type { PurchaseInvoice } from "../Clases";

export const createPurchaseInvoice = async (purchaseInvoice: PurchaseInvoice) => {
  try {
    const response = await axios.post(`${ENDPOINT.PURCHASE_INVOICES}/`, {
      purchaseOrderId: purchaseInvoice.purchaseOrder.id,
      invoiceNumber: purchaseInvoice.invoiceNumber,
      date: purchaseInvoice.date,
      amount: purchaseInvoice.amount,
      deliveryIncluded: purchaseInvoice.deliveryIncluded,
      quotationType: purchaseInvoice.purchaseOrder.providerQuotation.quotationType,
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
    });
    return response;
  } catch (error) {
    throw error
  }
}