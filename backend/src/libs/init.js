import User from '../models/User';

export const createUser = async () => {
    try {
        const user = await User.findOne({ userId: "admin" });
        if (!user) {
             await new User({
                roles: [
                    "admin",
                    "user"
                ],
                name: "admin",
                email: "admin@gmail.com",
                userId: "admin",
                password: await User.encryptPassword('admin')
            }).save();    
        }
    } catch (error) {
        console.error(error);
    }
} 