import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';

export const verifyToken = async (req,res,next) => {
    try {
        const token = req.headers["token"];
        if (!token) {
            return res.status(401).json({ message: "No token" });
        }

        const decoded = jwt.verify(token,config.SECRET);
        req.id = decoded.id;
        req.userId = decoded.userId;
        
        const user = await User.findById(req.id, { password: 0 });
        if (!user) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.isAdmin = user.roles.some(rol => rol === "admin")
            
        next();
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

export const isCollaborator = async (req,res,next) => {
    try {
        const user = await User.findOne({ userId: req.userId });

        const isCollaborator = user.roles.some(rol => rol === "collaborator");

        if (isCollaborator) {
            next();
            return;
        }

        return res.status(403).json({ message: "Require Collaborator Role!" });
    } catch (error) {
        return res.status(500).send({ message: "Error" });
    }
}