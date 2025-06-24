import { ENDPOINT } from "../config/apiConfig";
import axios from "axios";

export const getProviderQuotations = async () => {
  try {
    const response = await axios.get(`${ENDPOINT.PROVIDER_QUOTATIONS}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
