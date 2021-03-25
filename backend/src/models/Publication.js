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
    journal: String,
    volume: String,
    pages: String,
    year: String,
    publisher: String,
    issn: String,
    doi: String,
    url: String,
    keywords: String,
    abstract: String,
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
    problems: [{
        type: String
    }],
    usersNotRegistered: [{
        type: String
    }],
    attachments: [{
        type: String
    }],
    pdf: String,
    bibtex: String,
  },
  {
    versionKey: false,
  }
);

export default model("Publication", publicationSchema);