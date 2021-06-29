import { Schema, model } from "mongoose";


const textSchema = new Schema(
  {
    type: String,  
    en: String,
    es: String,
  },
  {
    versionKey: false,
  }
);

export default model("Text", textSchema);