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
    alias: String,
    description: String,
    state: String,
    instances: String,
    computationalExperience: String,
    reference: String,
    user: [{
        type: String
    }],
    publications: [{
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

export default model("Problem", problemSchema);