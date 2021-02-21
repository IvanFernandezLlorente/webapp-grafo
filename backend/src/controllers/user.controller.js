import User from "../models/User";
import Application from '../models/Application';
import jwt from 'jsonwebtoken';
import config from '../config';
import * as emailSend from '../libs/email';

export const getUsers = async (req, res) => {
    //const users = await User.find().populate("roles");
    const users = await User.find({},{password: 0});
    return res.status(200).json(users);
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findOne({userId});
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json({ message: "User not found" });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
};

export const getToken = async (req, res) => {
    try {
        const user = await User.findById(req.id, { password: 0 });
        if (user) {
            const token = jwt.sign({ id: user._id, userId: user.userId }, config.SECRET, {
                expiresIn: 86400
            });
            return res.status(200).json({
                token,
                id: user._id,
                userId: user.userId,
                roles: user.roles
            });
        }
        return res.status(404).json({ message: "User not found" });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
};

export const updateUserById = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.isAdmin || req.userId == req.params.userId) {
            const { password, ...rest } = req.body;
            let allData;
            if (rest.userId && await userIdUnique(rest.userId)) {
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
        return res.status(500).json({ message: "Error" });
    }
}

const userIdUnique = async (userId) => {
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
        return res.status(500).json({ message: "Error" });
    }
}

export const signUp = async (req,res) => {
    try {
        const { email, name, password } = req.body;
        
        const emailFound = await User.findOne({ email });
        if (emailFound){
            return res.status(400).json({ message: "The email already exists" });
        }   

        const applicationFound = await Application.findOne({ email, accepted: true });
        if (!applicationFound){
            return res.status(400).json({ message: "The email is not accepted" });
        }

        const newUser = new User({
            email,
            password: await User.encryptPassword(password),
            name,
            method: 'local'
        });
        
        if(req.body.roles) {
            newUser.roles = req.body.roles
        } else {
            newUser.roles = ["user"]
        }

        const finalUser = await saveNewUser(newUser);
        await Application.findOneAndDelete({ email, accepted: true });

        const token = jwt.sign({ id: finalUser._id, userId: finalUser.userId }, config.SECRET, {
            expiresIn: 86400
        });

        // Send Email
        await emailSend.emailWelcome(finalUser.email, finalUser.name);

        return res.status(200).json({
            token,
            id: finalUser._id,
            userId: finalUser.userId,
            roles: finalUser.roles
        });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

export const signUpSocial = async (req,res) => {
    try {
        let responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
        if (req.user.message == 'Account already used.') {
            responseHTML = responseHTML.replace('%value%', JSON.stringify({
                message: "Account already used."
            }));
            return res.status(400).send(responseHTML);
        }
        const method = req.authInfo.method;
        const newUser = new User({
            method,
            name: method == 'google' ? req.user.displayName : req.user.username,
            email: method == 'google' ? req.user.emails[0].value : '',
            methodId: req.user.id
        });

        newUser.roles = ["user"]

        const finalUser = await saveNewUser(newUser);

        const token = jwt.sign({ id: finalUser._id, userId: finalUser.userId }, config.SECRET, {
            expiresIn: 86400
        });

        if (finalUser.email) {
            await emailSend.emailWelcome(finalUser.email, finalUser.name);
        }

        responseHTML = responseHTML.replace('%value%', JSON.stringify({
                id: finalUser._id,
                userId: finalUser.userId,
                token,
                roles: finalUser.roles
        }));
        return res.status(200).send(responseHTML);
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

const saveNewUser = async (newUser) => {
    const savedUser = await newUser.save();
    savedUser.userId = savedUser._id;
    return await savedUser.save();
}

export const signIn = async (req,res) => {
    try {
        const user =  await User.findOne({ email: req.body.email, method: 'local' });
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        const checkPassword = await User.comparePassword(req.body.password,user.password);
        if (!checkPassword) {
            return res.status(401).json({ message: "Invalid password"});
        }

        const token = jwt.sign({ id: user._id, userId: user.userId }, config.SECRET, {
            expiresIn: 86400
        });

        return res.status(200).json({
            token,
            id: user._id,
            userId: user.userId,
            roles: user.roles
        });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

export const signInSocial = async (req, res) => {
    try {
        let responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';

        if (req.user.message == 'Account not registered.') {
            responseHTML = responseHTML.replace('%value%', JSON.stringify({
                message: "Account not registered."
            }));
            return res.status(400).send(responseHTML);
        }

        const token = jwt.sign({ id: req.user._id, userId: req.user.userId }, config.SECRET, {
            expiresIn: 86400
        });

        responseHTML = responseHTML.replace('%value%', JSON.stringify({
            token,
            id: req.user._id,
            userId: req.user.userId,
            roles: req.user.roles
        }));
        return res.status(200).send(responseHTML);
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}