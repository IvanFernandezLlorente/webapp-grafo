import { Schema, model } from "mongoose";


const problemSchema = new Schema(
  {
    name:{
        type: String,
        unique: true
    },
    problemId:{
        type: String,
        unique: true
    },
    organization: String,
    alias: String,
    relatedProblems: [{
        ref: "Problem",
        type: Schema.Types.ObjectId
    }],
    description: String,
    state: String,
    instances: String,
    computationalExperience: String,
    reference: String,
    user: [{
        ref: "User",
        type: Schema.Types.ObjectId
    }],
    publications: [{
        ref: "Publication",
        type: Schema.Types.ObjectId
    }]
  },
  {
    versionKey: false,
  }
);

export default model("Problem", problemSchema);