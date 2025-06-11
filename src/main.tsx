import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter, Route, Routes } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>,
)
