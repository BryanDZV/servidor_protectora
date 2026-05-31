import { Document, Types } from "mongoose";

export interface UserInput {
  name: string;
  email: string;
  password: string;
  favPets: Types.ObjectId[];
}

export interface UserDocument extends UserInput, Document {}
