import User from "../models/User";
import config from '../config';

const checkDuplicateNameOrEmail = async (req, res, next) => {
    try {
        const { email, name } = req.body; 

        if (email) {
            const emailFound = await User.findOne({email});
            
            if (emailFound){
                return res.status(400).json({ message: "The email already exists" });
            }   
        }

        if (name) {
            const user = await User.findOne({name});
            if (user) {
                return res.status(400).json({ message: "The user already exists" });
            }    
        }
        
        
        next();
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const checkRolesExisted = async (req, res, next) => {
    if (req.body.roles) {
        const roles = config.ROLES;

        req.body.roles.forEach(rol => {
            if (!roles.includes(rol)) {
                return res.status(400).json({
                    message: `Role ${rol} does not exist`,
                });
            }
        });
    }

  next();
};

export { checkDuplicateNameOrEmail, checkRolesExisted };