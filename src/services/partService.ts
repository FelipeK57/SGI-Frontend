import axios from "axios";
import { ENDPOINT } from "../config/apiConfig";

export const fetchParts = async () => {
  try {
    const response = await axios.get(ENDPOINT.PARTS);
    return response.data;
  } catch (error) {
    console.error("Error fetching parts:", error);
    throw error;
  }
};
