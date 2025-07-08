import { addToast, Button, Form, Input, Textarea } from "@heroui/react"
import { useNavigate } from "react-router"
import { ArrowLeftIcon } from "./DetailsPart"
import { createPart } from "../../services/partService"
import { useEffect, useState } from "react"

export const NewPart = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const response = await createPart(data);
      if (response.status === 201) {
        navigate("/dashboard/parts");
        addToast({
          title: "Parte registrada",
          description: "La parte se ha registrado correctamente.",
          color: "success",
          timeout: 3000,
        });
      }
    } catch (error) {
      console.error("Error al registrar la parte:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  return (
    <main className="flex flex-col gap-4">
      <Button
        onPress={() => navigate("/dashboard/parts")}
        isIconOnly
        variant="light"
        color="primary"
      >
        <ArrowLeftIcon />
      </Button>
      <h1 className="text-xl font-semibold 2xl:text-center">Registrar nueva parte</h1>
      <Form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4 w-full sm:flex-row lg:w-2/3 2xl:w-1/2 2xl:mx-auto">
        <div className="flex flex-col gap-4 h- w-full">
          <Input isRequired name="name" label="Nombre" placeholder="Ingresa el nombre" labelPlacement="outside" variant="bordered" />
          <Input isRequired name="partNumber" label="Número de parte" placeholder="Ingresa el número de parte" labelPlacement="outside" variant="bordered" />
          <Input isRequired name="producer" label="Fabricante" placeholder="Ingresa el fabricante" labelPlacement="outside" variant="bordered" />
          <Textarea isRequired maxLength={200} classNames={{
            input: "min-h-14 max-h-14 sm:min-h-36 sm:max-h-36",
          }} name="description" label="Descripción" placeholder="Ingresa la descripción" labelPlacement="outside" variant="bordered" />
          <div className="hidden md:block">
            <Button isLoading={isLoading} type="submit" color="primary" className="w-full">
              Registrar parte
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Input onChange={handleImageChange} isRequired type="file" name="partImage" label="Imagen" placeholder="Selecciona una imagen" labelPlacement="outside" variant="bordered" />
          <div className="flex flex-col gap-1">
            <span className="text-xs hidden sm:block">Vista previa</span>
            <img src={imagePreview || "/default.png"} alt="Vista previa" className="hidden sm:block w-full aspect-square bg-zinc-100 object-contain p-2 rounded-md" />
          </div>
        </div>
        <div className="block md:hidden w-full">
          <Button isLoading={isLoading} type="submit" color="primary" className="w-full">
            {isLoading ? "Registrando parte..." : "Registrar parte"}
          </Button>
        </div>
      </Form>
    </main>
  )
}