import User from "../models/User";
import Role from "../models/Rol";

const checkDuplicateNameOrEmail = async (req, res, next) => {
    try {
        const email = await User.findOne({ email: req.body.email });
        
        if (email){
            return res.status(400).json({ message: "The email already exists" });
        }

        const user = await User.findOne({ name: req.body.name });
        if (user) {
            return res.status(400).json({ message: "The user already exists" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const checkRolesExisted = async (req, res, next) => {
    if (req.body.roles) {
        const roles = await Role.find();

        const rolesFound = roles.map( rol => rol.name); 
        req.body.roles.forEach(rol => {
            if (!rolesFound.includes(rol)) {
                return res.status(400).json({
                    message: `Role ${rol} does not exist`,
                });
            }
        });
    }

  next();
};

export { checkDuplicateNameOrEmail, checkRolesExisted };