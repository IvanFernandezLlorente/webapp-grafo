import Problem from '../models/Problem';
import User from '../models/User';

export const getProblems = async (req, res) => {
    const problems = await Problem.find();
    res.status(200).json(problems);
}

export const getProblemById = async (req, res) => {
    try {
        const { problemId } = req.params;
        const problem = await Problem.findOne({ problemId }).populate("relatedProblems").populate("publications");
        res.status(200).json(problem);
    } catch (error) {
        res.status(404).json({ message: "Problem not found" });
    }
}

export const createProblem = async (req, res) => {
    try {
        
        if (!req.isAdmin) {
            const problemId = (req.body.name.toLowerCase().split(" ")).join('-');

            const problem = await Problem.findOne({ problemId });
            if (problem) {
                return res.status(400).json({ message: "The problem already exists" });
            }
            
            const newProblem = new Problem(req.body)
            newProblem.user.push(req.id);
            newProblem.problemId = problemId;
            const problemSaved = await newProblem.save();
            
            const user = await User.findOne({ userId: req.userId }, { password: 0 });
            user.problems.push(problemSaved._id);
            await user.save();

            return res.status(200).json(problemSaved);
        }
        res.status(403).json({ message: "You can not create a problem" });
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
}

export const updateProblemById = async (req, res) => {
    try {
        const problem = await Problem.findOne({ problemId: req.params.problemId });
        if (problem) {
            const user = await User.findOne({ problems: problem._id });

            if (req.isAdmin || req.id == user._id) {
                if (req.body.problemId && await problemIdUnique(req.body.problemId)) {
                    return res.status(400).json({ message: "The problem already exists" });
                }
                const updatedProblem = await Problem.findOneAndUpdate(
                    { problemId: req.params.problemId },
                    req.body,
                    {
                        new: true
                    }
                );
                return res.status(200).json(updatedProblem);
            }
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(401).json({ message: "Problem not found" });
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
}

const problemIdUnique = async (problemId) => {
    const problem = await Problem.findOne({ problemId });
    return problem;
}

export const deleteProblemById = async (req, res) => {
    try {
        const problem = await Problem.findOne({ problemId: req.params.problemId });
        if (problem) {
            const user = await User.findOne({ problems: problem._id })
            if (req.isAdmin || req.id == user._id) {

                const index = user.problems.indexOf(problem._id);
                user.problems.splice(index, 1);
                await user.save();
                
                await Problem.findOneAndDelete({ problemId: problem.problemId });
                return res.status(200).json();
            }
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(401).json({ message: "Problem not found" });
    } catch (error) {
        res.status(404).json({ message: "Error" });
    }
}