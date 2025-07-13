import axios from "axios";
import { ENDPOINT } from "../config/apiConfig";
import type { Provider } from "../Clases";
import { addToast } from "@heroui/react";

export const fetchProviders = async () => {
  try {
    const response = await axios.get(`${ENDPOINT.PROVIDERS}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateProvider = async (
  providerId: string | undefined,
  provider: Provider
) => {
  try {
    const response = await axios.put(
      `${ENDPOINT.PROVIDERS}/${providerId}`,
      provider
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error",
          description: error.response.data.message,
          color: "danger",
          timeout: 3000,
        });
      }
    }
    throw error;
  }
};

export const createProvider = async (provider: Provider) => {
  try {
    const response = await axios.post(`${ENDPOINT.PROVIDERS}`, provider);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error",
          description: error.response.data.message,
          color: "danger",
          timeout: 3000,
        });
      }
    }
    throw error;
  }
};
