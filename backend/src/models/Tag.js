import { Schema, model } from "mongoose";


const tagSchema = new Schema(
  {
    key: String,
    value: String
  },
  {
    versionKey: false,
  }
);

export default model("Tag", tagSchema);