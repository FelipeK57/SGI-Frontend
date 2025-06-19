export const URL = `${import.meta.env.VITE_DEV_URL}`;
export const API_URL = `${import.meta.env.VITE_API_URL}`;

export const ENDPOINT = {
  PARTS: `${URL}/part`,
  OUTPUT: `${URL}/output`,
  CLIENTS: `${URL}/client`,
  PROVIDERS: `${URL}/provider`,
  CLIENT_QUOTATIONS: `${URL}/client-quotation`,
  AUTH: `${API_URL}/external-systems-auth`,
};
