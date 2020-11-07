import { Schema, model } from "mongoose";


const publicationSchema = new Schema(
  {
    title:{
        type: String,
        unique: true
    },
    userName: String,
    organization: String,
    description: String,
    state: String,
    instances: String,
    computationalExperience: String,
    reference: String,
    user: [{
        ref: "User",
        type: Schema.Types.ObjectId
    }]
  },
  {
    versionKey: false,
  }
);

export default model("Publication", publicationSchema);