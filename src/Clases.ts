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
