import { Input } from "@heroui/react"
import { SearchIcon } from "../part/Parts"
import { useEffect, useState } from "react"
import { getPurchaseOrders } from "../../services/purchaseOrderService"
import type { PurchaseOrder } from "../../Clases"
import { PurchaseOrderRow } from "../../components/PurchaseOrderRow"

export const PurchaseOrders = () => {
  const [search, setSearch] = useState("")
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPurchaseOrders()
      setPurchaseOrders(response.purchaseOrders)
    }
    fetchData()
  }, [])

  return <main className="flex flex-col gap-4">
    <h1 className="text-xl font-semibold">Órdenes de compra</h1>
    <Input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      type="search"
      placeholder="Buscar"
      className="w-full md:max-w-xs"
      variant="bordered"
      startContent={<SearchIcon />}
    />
    <div className="flex flex-col overflow-y-auto h-full">
      {
        purchaseOrders.length > 0 ? (
          <>
            <div className="grid grid-cols-[20%_1fr_1fr] md:grid-cols-5 gap-4 border-y-1 p-2 w-full text-sm font-semibold border-zinc-200 bg-zinc-100 sticky top-0 z-10">
              <p>Código</p>
              <p>Proveedor</p>
              <p className="hidden md:block">Fecha</p>
              <p>Estado</p>
              <p className="hidden md:block">Tipo de compra</p>
            </div>
            <div className="flex flex-col">
              {
                purchaseOrders.map((purchaseOrder) => (
                  <PurchaseOrderRow key={purchaseOrder.id} purchaseOrder={purchaseOrder} />
                ))
              }
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No hay ordenes de compras registradas.</p>
          </div>
        )
      }
    </div>
  </main>
}