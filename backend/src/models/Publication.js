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
        ref: "User",
        type: Schema.Types.ObjectId
    }],
    relatedProblems: [{
        ref: "Problem",
        type: Schema.Types.ObjectId
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