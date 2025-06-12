import { Button, User } from "@heroui/react";
import { routes, selectedRouteStyle } from "./Sidebar";
import { Link } from "react-router";

export const SidebarDesktop = () => {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:gap-12 w-1/4 h-full border-1 p-5">
      <img src="/Logo_Semcon_2021.png" alt="Logo" className="w-2/3 h-auto" />
      <div className="flex flex-col gap-2 2xl:gap-5">
        {routes.map((route) => (
          <Link
            className={`xl:text-sm 2xl:text-lg py-2 px-5 hover:text-primary transition-colors ${selectedRouteStyle(route.path)}`}
            to={route.path}
            key={route.path}
          >
            {route.name}
          </Link>
        ))}
      </div>
      <div className="flex justify-between items-center mt-auto">
        <User
          className="justify-start"
          avatarProps={{
            src: "https://ui-avatars.com/api/?name=Juan+Perez&?background=random",
          }}
          name="Juan Perez"
          description="Auxiliar"
        />
        <Button isIconOnly variant="light" color="danger">
          <LogoutIcon />
        </Button>
      </div>
    </aside>
  );
};

export const LogoutIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6 rotate-180 text-current"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
      />
    </svg>
  );
};
