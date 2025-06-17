import { useLocation } from "react-router";

export const EditPart = () => {
  const partId = useLocation().pathname.split("/").pop();
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Editar datos de parte</h1>
      <p>{partId}</p>
    </div>
  );
}