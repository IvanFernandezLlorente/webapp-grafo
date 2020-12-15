import User from "../models/User";
import Role from '../models/Rol';
import jwt from 'jsonwebtoken';
import config from '../config';
import fs from 'fs-extra';
import path from 'path';

export const getUsers = async (req, res) => {
    //const users = await User.find().populate("roles");
    const users = await User.find({},{password: 0});
    res.status(200).json(users);
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({userId});
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({message: "User not found"});
    }
};

export const updateUserById = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        if (req.isAdmin || req.userId == req.params.userId) {
            const { password, ...rest } = req.body;
            let allData;

            if (userIdUnique(rest)) {
                return res.status(400).json({ message: "The userId already exists" });
            }

            if (password) {
                const encryptedPassword = await User.encryptPassword(password);
                allData = Object.assign(rest, { password: encryptedPassword });
            } else {
                allData = rest;
            }
            
            const updatedUser = await User.findOneAndUpdate(
                { userId: req.params.userId },
                allData,
                {
                    new: true
                }
            )
            return res.status(200).json(updatedUser);
        }
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
        res.status(404).json({ message: "User not found" });
    }
}

const userIdUnique = async (rest) => {
    const { userId } = rest;
    const user = await User.findOne({ userId });
    return user;
}

export const deleteUserById = async (req, res) => {
    try {
        const userFound = await User.findOne({ userId: req.params.userId });
        if (!userFound) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.isAdmin || req.userId == req.params.userId) { 
            const { userId } = req.params;
            const user = await User.findOneAndDelete({ userId });
            // if (user) {
            //     await fs.unlink(path.resolve(user.imagenPath));
            // }
            return res.status(200).json();
        }
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
        res.status(404).json({ message: "User not found" });
    }
}

// Admin signUp
export const signUp = async (req,res) => {
    try {
        const { email } = req.body;
        const password = Math.random().toString(36).substring(2);
        const newUser = new User({
            email,
            password: await User.encryptPassword(password)
        })
        
        if(req.body.roles) {
            const rolesFound = await Role.find({name:{$in: req.body.roles}});
            newUser.roles = rolesFound.map(role => role._id);
        } else {
            const role = await Role.findOne({name: "user"});
            newUser.roles = [role._id]
        }
        const savedUser = await newUser.save();
        savedUser.userId = savedUser._id;
        const finalUser = await savedUser.save();
        // const token = jwt.sign({id: savedUser._id},config.SECRET,{
        //     expiresIn: 86400
        // });

        // TODO: Send Email
        res.status(200).json({
            email: finalUser.email,
            password: password,
            userId: finalUser.userId,
            //token
        });
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
}

export const signIn = async (req,res) => {
    try {
        const user =  await User.findOne({email: req.body.email}).populate("roles");
        if (!user) {
            return res.status(404).json({messge: "Email not found"});
        }

        const checkPassword = await User.comparePassword(req.body.password,user.password);
        if (!checkPassword) {
            return res.status(401).json({token: null, message: "Invalid password"});
        }

        const token = jwt.sign({id: user._id, userId: user.userId}, config.SECRET, {
            expiresIn:86400
        })

        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
}