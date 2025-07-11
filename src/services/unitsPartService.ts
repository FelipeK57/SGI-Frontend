import { addToast } from "@heroui/react";
import { ENDPOINT } from "../config/apiConfig";
import axios from "axios";

export const getUnitPartBySerial = async (serial: string, clientId: number) => {
  try {
    const response = await axios.get(
      `${ENDPOINT.UNITS_PART}/serial/${serial}/${clientId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching unit part by serial:", error);
    throw error;
  }
};

export const getUnitPartByPartNumber = async (
  partNumber: string,
  clientId: number,
  outputType: string
) => {
  try {
    const response = await axios.get(
      `${ENDPOINT.UNITS_PART}/part-number/${partNumber}/${clientId}/${outputType}/`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        if (error.response.status === 404) {
          addToast({
            title: "Unidades no encontradas",
            description:
              error.response.data.message ||
              "Error al obtener las unidades de parte.",
            color: "warning",
          });
        }
        if (error.response.status === 500) {
          addToast({
            title: "Error del servidor",
            description: "Ocurrió un error al procesar la solicitud.",
            color: "danger",
          });
        }
      }
    }
    throw error;
  }
};
