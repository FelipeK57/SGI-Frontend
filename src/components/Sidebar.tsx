import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { Link, useLocation } from "react-router";

export const Sidebar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const routes = [
    { name: "Partes", path: "parts" },
    { name: "Cotizaciones clientes", path: "client-quotes" },
  ]

  const selectedRouteStyle = (path: string) => {
    const currentPath = useLocation().pathname;
    if (currentPath.includes(path)) {
      return "text-primary font-semibold";
    }
    return "text-zinc-400";
  }

  return (<>
    <div className="flex items-center justify-between w-full">
      <img src="/Logo.png" alt="Logo" className="h-6 w-auto" />
      <Button color="primary" isIconOnly variant="light" onPress={onOpen}>
        <IconSidebar />
      </Button>
    </div>
    <Drawer size="xs" isOpen={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col"><p className="text-xl">Menu</p></DrawerHeader>
            <DrawerBody>
              <ul className="flex flex-col gap-3">
                {
                  routes.map((route) => {
                    return (
                      <Link className={`text-base ${selectedRouteStyle(route.path)}`} to={route.path} key={route.name} onClick={() => {
                        onOpenChange();
                      }}>
                        {route.name}
                      </Link>
                    )
                  })
                }
              </ul>
            </DrawerBody>
            <DrawerFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar sesión
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  </>)
}

export const IconSidebar = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
  </svg>
}