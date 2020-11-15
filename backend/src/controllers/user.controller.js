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
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({message: "User not found"});
    }
};

export const updateUserById = async (req, res) => {
    try {
        const { password, ...rest } = req.body;

        const encryptedPassword = await User.encryptPassword(password);
        const allData = Object.assign(rest, { password: encryptedPassword });
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            allData,
            {
                new: true
            }
        )
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(404).json({message: "User not found"});
    }
}

export const deleteUserById = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findByIdAndDelete(userId);
        if (user) {
            await fs.unlink(path.resolve(user.imagenPath));
        }
        res.status(200).json();
    } catch (error) {
        res.status(404).json({message: "User not found"});
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
        // const token = jwt.sign({id: savedUser._id},config.SECRET,{
        //     expiresIn: 86400
        // });

        // TODO: Send Email
        res.status(200).json({
            email: savedUser.email,
            password: password
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

        const token = jwt.sign({id: user._id}, config.SECRET, {
            expiresIn:86400
        })

        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
}