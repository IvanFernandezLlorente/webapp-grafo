import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    method: {
      type: String,
      enum: ['local', 'google', 'github'],
      required: true
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String
    },
    methodId: {
      type: String
    },
    userId: {
      type: String,
      unique: true,
    },
    organization: String,
    department: String,
    area: String,
    researchgroup: String,
    description: String,
    linkedinUrl:String,
    urjcUrl:String,
    scholarUrl:String,
    imagenPath: String,
    roles: [
      {
        type: String,
        enum: ['user', 'admin', 'collaborator']
      },
    ],
    publications: [{
        type: String
    }],
    problems: [{
       type: String
    }],
  },
  {
    versionKey: false,
  }
);


userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt);
}

userSchema.statics.comparePassword = async (password, recivedPassword) => {
    return await bcrypt.compare(password,recivedPassword)
}

export default model("User", userSchema);