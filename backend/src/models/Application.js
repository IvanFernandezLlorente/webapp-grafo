import { Schema, model } from "mongoose";


const applicationSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    description: String,
    accepted: Boolean,
    token: {
        type: String,
        required: true
    }
  },
  {
    versionKey: false,
  }
);

export default model("Application", applicationSchema);