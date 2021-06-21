import Tag from '../models/Tag';

export const getTags = async (req, res) => {
    const tags = await Tag.find({},{key: 1, value: 1, _id: 0});
    return res.status(200).json(tags);
}


export const createTag = async (req, res) => {
    try {
        await Tag.insertMany(req.body);
        return res.status(200).json();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error" });
    }
}
