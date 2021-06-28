import { Schema, model } from "mongoose";


const descriptionSchema = new Schema(
  {
    en: String,
    es: String,
  },
  {
    versionKey: false,
  }
);

export default model("Description", descriptionSchema);