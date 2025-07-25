export const URL = `${import.meta.env.VITE_DEV_URL}`;
export const API_URL = `${import.meta.env.VITE_API_URL}`;

export const ENDPOINT = {
  PARTS: `${URL}/part`,
  OUTPUT: `${URL}/output`,
  CLIENTS: `${URL}/client`,
  PROVIDERS: `${URL}/provider`,
  CLIENT_QUOTATIONS: `${URL}/client-quotation`,
  PROVIDER_QUOTATIONS: `${URL}/provider-quotation`,
  QUOTATION_PART: `${URL}/quotation-part`,
  PURCHASE_ORDERS: `${URL}/purchase-order`,
  PURCHASE_INVOICES: `${URL}/purchase-invoice`,
  DELIVERY: `${URL}/delivery`,
  ADUANA: `${URL}/aduana`,
  LOCAL_SHIPPING: `${URL}/local-shipping`,
  PARTS_INTAKE: `${URL}/parts-intake`,
  UNITS_PART: `${URL}/units-part`,
  OUTPUT_PART: `${URL}/output`,
  AUTH: `${API_URL}/external-systems-auth`,
};
