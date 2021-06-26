import Tag from '../models/Tag';
import Problem from '../models/Problem';

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

export const deleteTag = async (req, res) => {
    try {
        const { key } = req.params;
        const tag = await Tag.findOne({ key });
        if (tag) {
            const problems = await Problem.find({ 'tags.key': key });

            if (problems.length != 0) {
                const promises = [];
                
                problems.forEach(problem => {
                    promises.push(Problem.findOneAndUpdate(
                        { problemId: problem.problemId },
                        { $pull: { tags: { key }}},
                        {
                            new: true
                        }
                    ));
                });

                await Promise.all(promises);
            }

            await Tag.findOneAndDelete({ key });
            return res.status(200).json();
        }
        return res.status(404).json({ message: "Tag not found" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error" });
    }
}