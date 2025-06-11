import { Outlet } from "react-router"
import { Sidebar } from "./components/Sidebar"

export const App = () => {
  return (
    <main className="flex flex-col lg:flex-row h-screen">
      <nav className="flex w-full items-center px-4 py-2 lg:hidden">
        <Sidebar />
      </nav>
      <aside className="hidden lg:flex w-1/3 h-full border-1">
      </aside>
      <main className="overflow-y-auto w-full px-4 py-2">
        <Outlet />
      </main>
    </main>
  )
}