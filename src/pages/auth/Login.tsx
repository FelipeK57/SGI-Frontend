import { Button, Form, Input } from "@heroui/react";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../../services/authService";

export interface PayloadJWT {
  id: string;
  email: string;
  role: string;
}

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const data = Object.fromEntries(new FormData(e.currentTarget));
      const response = await login(
        data.email as string,
        data.password as string
      );
      if (response) {
        navigate("/dashboard/parts");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-5 items-center justify-center min-h-screen">
      <div className="w-full text-center">
        <h1 className="font-semibold text-xl">Inicio de sesión</h1>
        <h3 className="text-sm font-normal">
          Sistema de gestión de inventario
        </h3>
      </div>
      <img
        alt="Logo de SEMCON"
        className="h-fit w-80 md:w-96"
        src="Logo_Semcon_2021.png"
      />
      <Form
        onSubmit={onSubmit}
        className="max-w-80 md:max-w-96 w-full flex flex-col gap-5"
      >
        <Input
          variant="bordered"
          name="email"
          autoComplete="email"
          isRequired
          label="Correo Electrónico"
          labelPlacement="outside"
          placeholder="Ingresa tu correo electrónico"
          type="email"
          validate={(value) => {
            if (!value) return "El campo no puede estar en blanco";
            if (!value.includes("@"))
              return "Ingresa un correo electrónico válido, como ejemplo@correo.com.";
          }}
        />
        <Input
          variant="bordered"
          name="password"
          isRequired
          label="Contraseña"
          labelPlacement="outside"
          type={passwordVisible ? "text" : "password"}
          placeholder="Ingresa tu contraseña"
          validate={(value) => {
            if (!value) return "El campo no puede estar en blanco";
          }}
          endContent={
            <div
              className="bg-transparent select-none text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer text-sm"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? "Ocultar" : "Mostrar"}
            </div>
          }
        />
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          type="submit"
          className="w-full bg-primary text-white font-semibold"
        >
          Iniciar sesión
        </Button>
        <Link
          to={"http://localhost:5174/recovery-password"}
          className="text-sm font-normal underline w-full text-center"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </Form>
    </main>
  );
};
