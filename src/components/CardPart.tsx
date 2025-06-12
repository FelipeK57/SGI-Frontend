import { Link } from "react-router";
import type { Part } from "../Clases";
import { Skeleton } from "@heroui/react";

interface CardPartProps {
  part: Part | null;
}

export const CardPart = ({ part }: CardPartProps) => {
  if (!part) {
    return (
      <article className="flex flex-col gap-2 w-full">
        <div className="w-full aspect-square">
          <Skeleton className="w-full h-full rounded-md" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-2/3 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
          <Skeleton className="h-3 w-full rounded" />
        </div>
      </article>
    );
  }

  return (
    <Link
      to={`${part.id}`}
      className="flex flex-col gap-1 w-full rounded-md group"
    >
      <div className="w-full aspect-square bg-white rounded-md overflow-hidden ">
        {part.image ? (
          <img
            src={part.image}
            alt={part.name}
            className="w-full h-full object-contain group-hover:scale-110 p-2 transition-transform duration-300"
          />
        ) : (
          <DefaultPhoto />
        )}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <p className="text-base line-clamp-2 min-h-7 max-h-14">{part.name}</p>
        <p className="text-xs text-zinc-700 truncate">{part.partNumber}</p>
        <p className="text-xs text-zinc-500 line-clamp-3">{part.description}</p>
      </div>
    </Link>
  );
};

export const DefaultPhoto = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-12 mx-auto text-zinc-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
};
