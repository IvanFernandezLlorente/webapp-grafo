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
    description: {
        content: String,
        visible: Boolean,
    },
    state: {
        content: String,
        visible: Boolean,
    },
    instances: {
        content: String,
        visible: Boolean,
    },
    computationalExperience: {
        content: String,
        visible: Boolean,
    },
    reference: {
        content: String,
        visible: Boolean,
    },
    user: [{
        type: String
    }],
    publications: [{
        type: String
    }],
    usersNotRegistered: [{
        type: String
    }],
    attachments: [{
        type: String
    }],
    visible: Boolean,
    tags: [{
        key: String,
        value: String
    }]
  },
  {
    versionKey: false,
  }
);

export default model("Problem", problemSchema);