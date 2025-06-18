import axios from "axios";
import { ENDPOINT } from "../config/apiConfig";

export const fetchClients = async () => {
  try {
    const response = await axios.get(`${ENDPOINT.CLIENTS}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
