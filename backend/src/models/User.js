import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    organization: String,
    department: String,
    area: String,
    researchgroup: String,
    description: String,
    linkedinUrl:String,
    urjcUrl:String,
    scholarUrl:String,
    roles: [
      {
        ref: "Role",
        type: Schema.Types.ObjectId,
      },
    ],
    publications: [{
        ref: "Publication",
        type: Schema.Types.ObjectId
    }]
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