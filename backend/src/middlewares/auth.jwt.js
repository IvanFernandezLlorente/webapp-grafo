import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';
import Role from '../models/Rol';

export const verifyToken = async (req,res,next) => {
    try {
        const token = req.headers["token"];
        if (!token) {
            return res.status(403).json({message: "No token"});
        }

        const decoded = jwt.verify(token,config.SECRET);
        req.userId = decoded.id

        const user = await User.findById(req.userId, {password: 0});
        if (!user) {
            return res.status(404).json({message: "Invalid token"});
        }

        const roles = await Role.find({ _id: { $in: user.roles } });
        req.isAdmin = roles.some(rol => rol.name === "admin");
        
        next();
    } catch (error) {
        return res.status(401).json({message: "Unauthorized"})
    }
}

export const isAdmin = async (req,res,next) => {
    try {
        const user = await User.findById(req.userId);
        const roles = await Role.find({ _id: { $in: user.roles } });
        
        const isAdmin = roles.some(rol => rol.name === "admin");

        if (isAdmin) {
            next();
            return;
        }

        return res.status(403).json({ message: "Require Admin Role!" });
    } catch (error) {
        return res.status(500).send({ message: error });
    }
}