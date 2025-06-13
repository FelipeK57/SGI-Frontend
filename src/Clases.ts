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
