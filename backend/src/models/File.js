import { Schema, model } from "mongoose";


const fileSchema = new Schema(
  {
    fileId:{
        type: String,
        unique: true
    },
    name: String,
    path: String,
    section: String
  },
  {
    versionKey: false,
  }
);

export default model("File", fileSchema);