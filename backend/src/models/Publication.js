import { Schema, model } from "mongoose";


const publicationSchema = new Schema(
  {
    title:{
        type: String,
        unique: true
    },
    publicationId:{
        type: String,
        unique: true
    },
    description: String,
    state: String,
    instances: String,
    computationalExperience: String,
    reference: String,
    user: [{
        type: String
    }],
    relatedProblems: [{
        type: String
    }],
    usersNotRegistered: [{
        type: String
    }]
  },
  {
    versionKey: false,
  }
);

export default model("Publication", publicationSchema);