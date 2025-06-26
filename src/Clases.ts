export interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: "services" | "auxiliary" | "admin";
}

export interface Part {
  id: number;
  name: string;
  partNumber: string;
  producer: string;
  description: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id?: number;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
}

export interface Output {
  type: string;
  client: Client;
}

export interface OutputPart {
  serial: string;
  createdAt: string;
  output: Output;
}

export interface Provider {
  id?: number;
  name: string;
  email: string;
  phone: string;
}

export interface ClientQuotation {
  id?: number;
  code: string;
  client: Client;
  createdAt: string;
  state: "Aceptada" | "Cancelada" | "Pendiente";
  totalPrice?: number;
}

export interface ProviderQuotation {
  id?: number;
  code: string;
  provider: Provider;
  createdAt: string;
  state: "Aceptada" | "Cancelada" | "Pendiente";
  quotationType: "Exterior" | "Local";
}

export interface PurchaseOrder {
  id?: number;
  code: string;
  providerQuotation: ProviderQuotation;
  createdAt: string;
  state:
    | "Pend. Factura"
    | "Pend. Envío"
    | "Pend. Ingreso"
    | "Pend. Aduana"
    | "Finalizada";
}

export interface Quotation {
  id?: number;
  clientQuotation: ClientQuotation;
}