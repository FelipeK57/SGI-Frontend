import axios from "axios";
import { ENDPOINT } from "../config/apiConfig";
import { addToast } from "@heroui/react";
import { useAuth } from "../store/useAuth";

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${ENDPOINT.AUTH}/login`, {
      email,
      password,
      apiKey: `${import.meta.env.VITE_API_KEY_SGU}`,
    });
    if (response.status === 200) {
      const { setUser, setRole } = useAuth.getState();
      setUser(response.data.user);
      if (response.data.user.role === "Administrador") {
        setRole("admin");
      } else if (response.data.user.role === "Auxiliar") {
        setRole("auxiliary");
      } else {
        setRole("services");
      }
      addToast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido al sistema de gestión de inventario",
        timeout: 3000,
      });
      return response.data;
    }
  } catch (error) {
    console.log(error);
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
    return;
  }
};
