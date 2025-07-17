import { addToast } from "@heroui/react";
import type { NewOutput } from "../Clases";
import { ENDPOINT } from "../config/apiConfig";
import axios from "axios";

export const createOutput = async (output: NewOutput) => {
  try {
    const response = await axios.post(`${ENDPOINT.OUTPUT}`, output);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error al crear la salida",
          description:
            error.response.data.message || "Error al crear la salida.",
          color: "danger",
        });
      }
    }
    throw error;
  }
};

export const getOutputs = async () => {
  try {
    const response = await axios.get(`${ENDPOINT.OUTPUT}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching outputs:", error);
    throw error;
  }
};
