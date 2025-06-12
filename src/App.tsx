import { Outlet } from "react-router"
import { Sidebar } from "./components/Sidebar"
import { SidebarDesktop } from "./components/SidebarDesktop"

export const App = () => {
  return (
    <main className="flex flex-col lg:flex-row h-screen">
      <nav className="flex w-full items-center px-7 py-2 border-b-1 border-zinc-200 lg:hidden">
        <Sidebar />
      </nav>
      <SidebarDesktop />
      <main className="overflow-y-auto w-full px-7 py-2 md:py-5">
        <Outlet />
      </main>
    </main>
  )
}