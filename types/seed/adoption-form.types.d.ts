import { Document, Types } from "mongoose";

export type HousingType = "Piso" | "Casa" | "Finca";
export type TenureType = "Alquiler" | "Propiedad";

export interface AdoptionFormInput {
  user_id: Types.ObjectId;
  animal_id: Types.ObjectId;
  telf: string;
  dni: string;
  city: string;
  direccion: string;
  postal: number;
  petFriendly: boolean;
  tieneMascotas: boolean;
  tipoVivienda: HousingType;
  alquilerOCompra: TenureType;
  permisoCasero: boolean;
  tieneJardin: boolean;
  acuerdoVisitas: boolean;
}

export interface AdoptionFormDocument extends AdoptionFormInput, Document {}
