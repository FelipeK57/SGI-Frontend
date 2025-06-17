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
  try {
    const response = await axios.post(ENDPOINT.PARTS, partData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating part:", error);
    throw error;
  }
};

export const outputsParts = async (partId: number) => {
  try {
    const response = await axios.get(`${ENDPOINT.OUTPUT}/${partId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching output parts:", error);
    throw error;
  }
};
