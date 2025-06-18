import { useLocation, useNavigate } from "react-router";
import { addToast, Button, Form, Input, Textarea } from "@heroui/react";
import { ArrowLeftIcon } from "./DetailsPart";
import { useEffect, useState } from "react";
import { fetchPart, updatePart } from "../../services/partService";
import type { Part } from "../../Clases";

export const EditPart = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [partData, setPartData] = useState<Part | null>(null);
  const partId = useLocation().pathname.split("/parts")[1].split("/")[1];

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

  useEffect(() => {
    const fetchPartData = async () => {
      try {
        const response = await fetchPart(partId);
        setPartData(response.part);
      } catch (error) {
        console.error("Error al obtener los datos de la parte:", error);
      }
    };

    fetchPartData();
  }, [partId]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]); 4

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      const part = {
        name: data.name,
        partNumber: data.partNumber,
        producer: data.producer,
        description: data.description,
        partImage: data.partImage
      }
      const response = await updatePart(partId, part);
      if (response.status === 200) {
        navigate(`/dashboard/parts/${partId}`);
        addToast({
          title: "Parte editada",
          description: "La parte se ha editado correctamente.",
          color: "success",
          timeout: 3000,
        });
      }
    } catch (error) {
      console.error("Error al editar la parte:", error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <main className="flex flex-col gap-4">
      <Button
        onPress={() => navigate(`/dashboard/parts/${partId}`)}
        isIconOnly
        variant="light"
        color="primary"
      >
        <ArrowLeftIcon />
      </Button>
      <h1 className="text-xl font-semibold 2xl:text-center">Editar campos de parte</h1>
      <Form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4 w-full sm:flex-row lg:w-2/3 2xl:w-1/2 2xl:mx-auto">
        <div className="flex flex-col gap-4 h- w-full">
          <Input
            value={partData?.name}
            onChange={(e) =>
              setPartData((prev) =>
                prev ? { ...prev, name: e.target.value } : prev
              )
            }
            isRequired
            name="name"
            label="Nombre"
            placeholder="Ingresa el nombre"
            labelPlacement="outside"
            variant="bordered"
          />
          <Input
            value={partData?.partNumber}
            onChange={(e) =>
              setPartData((prev) =>
                prev ? { ...prev, partNumber: e.target.value } : prev
              )
            }
            isRequired
            name="partNumber"
            label="Número de parte"
            placeholder="Ingresa el número de parte"
            labelPlacement="outside"
            variant="bordered"
          />
          <Input
            value={partData?.producer}
            onChange={(e) =>
              setPartData((prev) =>
                prev ? { ...prev, producer: e.target.value } : prev
              )
            }
            isRequired
            name="producer"
            label="Fabricante"
            placeholder="Ingresa el fabricante"
            labelPlacement="outside"
            variant="bordered"
          />
          <Textarea
            value={partData?.description}
            onChange={(e) =>
              setPartData((prev) =>
                prev ? { ...prev, description: e.target.value } : prev
              )
            }
            isRequired
            maxLength={200}
            classNames={{
              input: "min-h-14 max-h-14 sm:min-h-36 sm:max-h-36",
            }}
            name="description"
            label="Descripción"
            placeholder="Ingresa la descripción"
            labelPlacement="outside"
            variant="bordered"
          />
          <div className="hidden md:block">
            <Button isLoading={isLoading} type="submit" color="primary" className="w-full">
              {isLoading ? "Editando parte..." : "Editar parte"}
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Input onChange={handleImageChange} isRequired type="file" name="partImage" label="Imagen" placeholder="Selecciona una imagen" labelPlacement="outside" variant="bordered" />
          <div className="flex flex-col gap-1">
            <span className="text-xs hidden sm:block">Vista previa</span>
            <img src={imagePreview || `${partData?.image}`} alt="Vista previa" className="hidden sm:block w-full aspect-square bg-zinc-50 object-contain p-2 rounded-md" />
          </div>
        </div>
        <div className="block md:hidden w-full">
          <Button isLoading={isLoading} type="submit" color="primary" className="w-full">
            {isLoading ? "Editando parte..." : "Editar parte"}
          </Button>
        </div>
      </Form>
    </main>
  );
}