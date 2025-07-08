import { addToast } from "@heroui/react";
import { ENDPOINT } from "../config/apiConfig";
import axios from "axios";

export const createPartsIntake = async (data: any) => {
  try {
    const response = await axios.post(`${ENDPOINT.PARTS_INTAKE}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        addToast({
          title: "Error",
          description:
            error.response.data.message ||
            "Error al crear la entrada de partes",
          color: "danger",
        });
      }
    }
  }
};
