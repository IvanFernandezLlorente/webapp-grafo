import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';
import Role from '../models/Rol';

export const verifyToken = async (req,res,next) => {
    try {
        const token = req.headers["token"];
        if (!token) {
            return res.status(403).json({ message: "No token" });
        }

        const decoded = jwt.verify(token,config.SECRET);
        req.id = decoded.id;
        req.userId = decoded.userId;
        
        const user = await User.findById(req.id, { password: 0 });
        if (!user) {
            return res.status(404).json({ message: "Invalid token" });
        }

        const roles = await Role.find({ _id: { $in: user.roles } });
        req.isAdmin = roles.some(rol => rol.name === "admin");
        
        next();
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}
