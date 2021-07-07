import User from '../models/User';

export const createUser = async () => {
    try {
        const user = await User.findOne({ userId: "HeuristicasResearch" });
        if (!user) {
             await new User({
                roles: [
                    "admin",
                    "user"
                ],
                name: "Heuristicas Research",
                email: "heuristicas.research@gmail.com",
                userId: "HeuristicasResearch",
                showPeople: true,
                password: await User.encryptPassword('admin')
            }).save();    
        }
    } catch (error) {
        console.error(error);
    }
} 