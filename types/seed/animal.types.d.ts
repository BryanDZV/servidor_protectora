import { Document } from "mongoose";

export type AnimalSpecies = "Perro" | "Gato" | "Ave" | "Conejo";
export type AnimalAgeRange = "Cachorro" | "Joven" | "Adulto" | "Senior";
export type AnimalGender = "Macho" | "Hembra";
export type AnimalSize = "Pequeño" | "Mediano" | "Grande";
export type AnimalAdoptionState = "Disponible" | "Reservado" | "Adoptado";

export interface AnimalHealth {
  vacunado: boolean;
  desparasitado: boolean;
  sano: boolean;
  esterilizado: boolean;
  identificado: boolean;
  microchip: boolean;
}

export interface AnimalInput {
  especie: AnimalSpecies;
  rangoEdad: AnimalAgeRange;
  fechaNacimiento: Date;
  genero: AnimalGender;
  size: AnimalSize;
  peso: number;
  salud: AnimalHealth;
  nombre: string;
  foto: string;
  ubicacion: string;
  personalidad: string[];
  historia: string;
  aSaber: string;
  requisitosAdopcion: string;
  tasaAdopcion: number;
  permiteEnvio: boolean;
  estadoAdopcion: AnimalAdoptionState;
}

export interface AnimalDocument extends AnimalInput, Document {}
