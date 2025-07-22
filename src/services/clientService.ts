import axios from "axios";
import { ENDPOINT } from "../config/apiConfig";
import type { Client } from "../Clases";
import { addToast } from "@heroui/react";

export const fetchClients = async () => {
  try {
    const response = await axios.get(`${ENDPOINT.CLIENTS}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateClient = async (
  clientId: string | undefined,
  client: Client
) => {
  try {
    const response = await axios.put(`${ENDPOINT.CLIENTS}/${clientId}`, client);
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

export const createClient = async (client: Client) => {
  try {
    const response = await axios.post(`${ENDPOINT.CLIENTS}`, {
      name: client.name,
      email: client.email,
      phone: client.phone,
    });
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