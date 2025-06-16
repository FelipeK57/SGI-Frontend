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

export const fetchPart = async (partId: string) => {
  try {
    const response = await axios.get(`${ENDPOINT.PARTS}/${partId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching part:", error);
    throw error;
  }
};

export const createPart = async (partData: any) => {
  console.error("Creating part with data:", partData);
  try {
    const response = await axios.post(ENDPOINT.PARTS, partData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Part created successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error creating part:", error);
    throw error;
  }
};
