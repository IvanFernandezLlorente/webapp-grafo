import User from "../models/User";
import Application from '../models/Application';
import Problem from '../models/Problem';
import Publication from '../models/Publication';
import jwt from 'jsonwebtoken';
import config from '../config';
import * as emailSend from '../libs/email';

export const getUsers = async (req, res) => {
    const users = await User.find({},{password: 0});
    return res.status(200).json(users);
};

export const getUsersPaginated = async (req, res) => {
    const users = await User.find({ showPeople: true },{password: 0}).sort({ _id: -1 }).skip(req.params.page * 10).limit(10);
    return res.status(200).json(users);
};

export const imageProfile = async (req, res) => {
    try {
        const userFound = await User.findOne({ userId: req.params.userId });
        if (!userFound) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.isAdmin || req.userId == req.params.userId) { 
            const updatedUser = await User.findOneAndUpdate(
                { userId: req.params.userId },
                req.body,
                {
                    new: true
                }
            )
            return res.status(200).json();
        }
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
};

export const getUserByUserId = async (req, res) => {
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

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
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
                roles: user.roles,
                // orcid: user.orcid
                orcid: user.orcidPlainText
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

            if (req.body.banned) {
                await emailSend.emailBan(updatedUser);
            }

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

export const changePassword = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.isAdmin || req.userId == req.params.userId) {
            if (!req.isAdmin) {
                const checkPassword = await User.comparePassword(req.body.currentPassword,user.password);
                if (!checkPassword) {
                    return res.status(401).json({ message: "The current password is not the same"});
                }
            }

            const encryptedPassword = await User.encryptPassword(req.body.newPassword);

            const updatedUser = await User.findOneAndUpdate(
                { userId: req.params.userId },
                { password: encryptedPassword },
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

export const deleteUserById = async (req, res) => {
    try {
        const userFound = await User.findOne({ userId: req.params.userId });
        if (!userFound) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.isAdmin || req.userId == req.params.userId) { 
            const { userId } = req.params;
            
            const publications = await Publication.find({ user: userFound._id });
            await Promise.all(deleteReferences(publications, userFound));

            
            const problems = await Problem.find({ user: userFound._id });
            await Promise.all(deleteReferences(problems, userFound));

            const user = await User.findOneAndDelete({ userId });
            
            return res.status(200).json();
        }
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

const deleteReferences = (array, user) => {
    const promises = [];
    
    array.forEach( item => {
        const index = item.user.indexOf(user._id);
        item.user.splice(index, 1);
        promises.push(item.save());
    });

    return promises;
}

export const signUp = async (req,res) => {
    try {
        const { email, name, password, token } = req.body;
        
        const emailFound = await User.findOne({ email });
        if (emailFound){
            return res.status(400).json({ message: "The email already exists" });
        }   

        const applicationFound = await Application.findOne({ email, accepted: true });
        if (!applicationFound){
            return res.status(400).json({ message: "The email is not accepted" });
        }

        const decoded = jwt.verify(token,config.SECRET);
        if (!((decoded.email === applicationFound.email) && (token === applicationFound.token))) {
            return res.status(403).json({ message: "Invalid token" });
        }

        const newUser = new User({
            email,
            password: await User.encryptPassword(password),
            name,
            showPeople: true
        });
        
        if(req.body.roles) {
            newUser.roles = req.body.roles
        } else {
            newUser.roles = ["user"]
        }

        const finalUser = await saveNewUser(newUser);
        await Application.findOneAndDelete({ email, accepted: true });

        const newToken = jwt.sign({ id: finalUser._id, userId: finalUser.userId }, config.SECRET, {
            expiresIn: 86400
        });

        // Send Email
        await emailSend.emailWelcome(finalUser);

        return res.status(200).json({
            token: newToken,
            id: finalUser._id,
            userId: finalUser.userId,
            roles: finalUser.roles
        });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

export const signUpAdmin = async (req,res) => {
    try {
        if (req.isAdmin) {
            const { email, name, password } = req.body;
        
            const emailFound = await User.findOne({ email });
            if (emailFound){
                return res.status(400).json({ message: "The email already exists" });
            }   
        
            const newUser = new User({
                email,
                password: await User.encryptPassword(password),
                name,
                showPeople: true
            });
            
            if(req.body.roles) {
                newUser.roles = req.body.roles
            } else {
                newUser.roles = ["user"]
            }

            const finalUser = await saveNewUser(newUser);

            
            // Send Email
            await emailSend.emailWelcome(finalUser);

            return res.status(200).json({
                id: finalUser._id,
                userId: finalUser.userId,
                roles: finalUser.roles
            });
        }
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error" });
    }
}

export const connectSocial = async (req,res) => {
    try {
        let responseHTML = '<html><head><title>Main</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
        if (req.user.message) {
            responseHTML = responseHTML.replace('%value%', JSON.stringify({
                message: req.user.message,
                method: req.user.method
            }));
            return res.status(400).send(responseHTML);
        }

        responseHTML = responseHTML.replace('%value%', JSON.stringify({
                user: req.user 
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
        const user =  await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        const checkPassword = await User.comparePassword(req.body.password,user.password);
        if (!checkPassword) {
            return res.status(401).json({ message: "Invalid password"});
        }

        if (user.banned) {
            return res.status(401).json({ message: "Your account is blocked"});
        }

        // const orcid = ((user.orcid) && (user.orcid.hasOwnProperty('orcid')) && (user.orcid.orcid)) ? user.orcid.orcid : undefined;
        
        const token = jwt.sign({ id: user._id, userId: user.userId }, config.SECRET, {
            expiresIn: 86400
        });

        return res.status(200).json({
            token,
            id: user._id,
            userId: user.userId,
            roles: user.roles,
            orcid: user.orcidPlainText
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
                message: "Account not registered.",
                method: req.user.method
            }));
            return res.status(400).send(responseHTML);
        }

        if (req.user.message == 'Your account is blocked') {
            responseHTML = responseHTML.replace('%value%', JSON.stringify({
                message: "Your account is blocked",
                method: req.user.method
            }));
            return res.status(400).send(responseHTML);
        }

        const token = jwt.sign({ id: req.user.user._id, userId: req.user.user.userId }, config.SECRET, {
            expiresIn: 86400
        });

        responseHTML = responseHTML.replace('%value%', JSON.stringify({
            token,
            id: req.user.user._id,
            userId: req.user.user.userId,
            roles: req.user.user.roles,
            method: req.user.method,
            //orcid: req.user.method == "signinORCID" ? req.user.user.orcid.orcid : undefined
            orcid: req.user.user.orcidPlainText
        }));
        return res.status(200).send(responseHTML);
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}