import { Button } from "@heroui/react"

export const App = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to My App</h1>
      <Button color="primary">Press me!</Button>
    </main>
  )
}