// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
// @ts-ignore
import "@fontsource-variable/inter";
import { Parts } from "./pages/part/Parts.tsx";
import { DetailsPart } from "./pages/part/DetailsPart.tsx";
import { Login } from "./pages/auth/Login.tsx";
import { NewPart } from "./pages/part/NewPart.tsx";
import { EditPart } from "./pages/part/EditPart.tsx";
import { ClientsProvidersList } from "./pages/clients_providers/ClientsProvidersList.tsx";
import { Clients } from "./pages/clients_providers/Clients.tsx";
import { Providers } from "./pages/clients_providers/Providers.tsx";
import { ClientQuotations } from "./pages/client_quotation/ClientQuotations.tsx";
import { ReloadProvider } from "./context/ClientProviderContext.tsx";
import { NewClientQuotation } from "./pages/client_quotation/NewClientQuotation.tsx";
import { ClientQuotationDetails } from "./pages/client_quotation/ClientQuotationDetails.tsx";
import { ProviderQuotations } from "./pages/provider_quotation/ProviderQuotations.tsx";
import { NewProviderQuotation } from "./pages/provider_quotation/NewProviderQuotation.tsx";
import { ProviderQuotationDetails } from "./pages/provider_quotation/ProviderQuotationDetails.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <HeroUIProvider>
      <ToastProvider placement="top-center" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<App />}>
          <Route index element={<Navigate to="parts" replace />} />
          <Route index path="parts" element={<Parts />} />
          <Route path="parts/new" element={<NewPart />} />
          <Route path="parts/:partId/edit" element={<EditPart />} />
          <Route path="parts/:partId" element={<DetailsPart />} />
          <Route path="client-quotes" element={<ClientQuotations />} />
          <Route path="client-quotes/new" element={<NewClientQuotation />} />
          <Route path="client-quotes/:quotationId" element={<ClientQuotationDetails />} />
          <Route path="provider-quotes" element={<ProviderQuotations /> } />
          <Route path="provider-quotes/new" element={<NewProviderQuotation />} />
          <Route path="provider-quotes/:quotationId" element={<ProviderQuotationDetails />} />
          <Route
            path="clients-and-providers"
            element={
              <ReloadProvider>
                <ClientsProvidersList />
              </ReloadProvider>
            }
          >
            <Route index element={<Navigate to="clients" replace />} />
            <Route index path="clients" element={<Clients />} />
            <Route path="providers" element={<Providers />} />
          </Route>
        </Route>
        <Route
          path="*"
          element={<h1 className="text-center text-2xl">Page not found</h1>}
        />
      </Routes>
    </HeroUIProvider>
  </BrowserRouter>
  // </StrictMode>
);
