import User from "../models/User";

export const createImage = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (user.imagenPath && (user.imagenPath!=req.file.path)) {
            await fs.unlink(path.resolve(user.imagenPath));
        }
        user.imagenPath = req.file.path;
        const savedUser = await user.save();
        res.status(200).json(savedUser);
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
} 