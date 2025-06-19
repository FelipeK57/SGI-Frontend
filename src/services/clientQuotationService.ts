import axios from "axios";
import { ENDPOINT } from "../config/apiConfig";

export const getClientQuotations = async () => {
  try {
    const response = await axios.get(`${ENDPOINT.CLIENT_QUOTATIONS}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};