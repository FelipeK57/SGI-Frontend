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
  email?: string;
  phone?: string;
}

export interface ClientQuotation {
  id?: number;
  code: string;
  client: Client;
  createdAt: string;
  state: "Aceptada" | "Cancelada" | "Pendiente";
  totalPrice?: number;
  requesterName: string;

  offerValidity?: number;
  estimatedDeliveryDate?: string;
  markupPercentage?: number;
  iva?: number;

  freightCost?: number;
  insuranceCost?: number;
  localTransportCost?: number;

  customsDuties?: number;
  customsHandlingCost?: number;

  incoterm?: string;
  currency?: "USD" | "EUR" | "COP";
  exchangeRate?: number;
  isInternational?: boolean;
}

export interface ProviderQuotation {
  id?: number;
  code: string;
  provider: Provider;
  createdAt: string;
  state: "Aceptada" | "Cancelada" | "Pendiente";
}

export interface PurchaseOrder {
  id?: number;
  code: string;
  providerQuotation?: ProviderQuotation
  clientQuotation?: ClientQuotation;
  createdAt: string;
  state:
    | "Pend. Factura"
    | "Pend. Envío"
    | "Pend. Aduana"
    | "Pend. Entrega"
    | "Pend. Ingreso"
    | "Finalizada";
}

export interface Quotation {
  id?: number;
  clientQuotation: ClientQuotation;
}

export interface PurchaseInvoice {
  id?: number;
  purchaseOrder: PurchaseOrder;
  invoiceNumber: string;
  date: string;
  amount: number;
  deliveryIncluded?: boolean;
  currency: string;
  deliveryAmount?: number;
}

export interface Delivery {
  id?: number;
  deliveryNumber: string;
  purchaseOrder: PurchaseOrder;
  carrier: string;
  trackerNumber: string;
  deliveryDate: string;
  estimatedDeliveryDate: string;
  purchaseOrderId?: number;
  cost: number;
}

export interface Aduana {
  id?: number;
  purchaseOrder: PurchaseOrder;
  purchaseOrderId?: number;
  declarationNumber: string;
  declarationDate: string;
  agencyName: string;
  agencyContact: string;
  amount: number;
  releaseDate: string;
}

export interface QuotationPart {
  id?: number;
  clientQuotationId?: number;
  clientQuotation?: ClientQuotation;
  providerQuotationId?: number;
  providerQuotation?: ProviderQuotation;
  partId: number;
  part: Part;
  quantity: number;
  receivedQuantity?: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface LocalShipping {
  id?: number;
  purchaseOrder: PurchaseOrder;
  purchaseOrderId?: number;
  dispatchNumber: string;
  localCarrier: string;
  localTrackingNumber: string;
  originAddress: string;
  deliveryDate: string;
  amount: number;
  localCarrierInvoiceNumber: string;
}

export interface UnitPart {
  id?: number;
  serial: string;
  partId: number;
  part: Part;
  intake?: {
    id?: number;
    purchaseOrder: PurchaseOrder;
    purchaseOrderId?: number;
    quotationPart: QuotationPart;
  };
  intakeId?: number | null;
  outputId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartOutput {
  part?: Part;
  partId: number;
  serial: string;
}

export interface NewOutput {
  id?: number;
  clientId: number;
  type: string;
  returnDate?: string;
  saleValue?: number;
  parts: PartOutput[];
}

export interface UnitsPendingIntake {
  id?: number;
  part?: Part;
  quantity: number;
  receivedQuantity?: number;
  clientQuotation?: {
    id?: number;
    code: string;
    client: Client;
    quotations: {
      id?: number;
      providerQuotation: {
        id?: number;
        purchaseOrder: {
          id?: number;
          code: string;
          date: string;
          state: "Pend. Ingreso";
        };
      };
    };
  };
}
