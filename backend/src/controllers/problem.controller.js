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
            newProblem.problemId = problemId;
            const problemSaved = await newProblem.save();

            const promises = [];
            const promises2 = [];

            problemSaved.user.forEach( userId => promises.push(User.findOne({ userId }, { password: 0 })))
            const users = await Promise.all(promises);

            users.forEach( user => {
                user.problems.push(problemSaved._id);
                promises2.push(user.save());
            });
            await Promise.all(promises2);

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

                const promises = [];
                const promises2 = [];

                // Quitar las referencias del problema a todos los users
                problem.user.forEach( userId => promises.push(User.findOne({ userId }, { password: 0 })))
                const users = await Promise.all(promises);

                users.forEach( user => {
                    const index = user.problems.indexOf(problem._id);
                    user.problems.splice(index, 1);
                    promises2.push(user.save());
                });
                await Promise.all(promises2);

                const updatedProblem = await Problem.findOneAndUpdate(
                    { problemId: req.params.problemId },
                    req.body,
                    {
                        new: true
                    }
                );
                
                promises.splice(0,promises.length);
                promises2.splice(0, promises2.length);
                
                // poner las referencias del problema a los nuevos users
                updatedProblem.user.forEach( userId => promises.push(User.findOne({ userId }, { password: 0 })))
                const users2 = await Promise.all(promises);

                users2.forEach( user => {
                    user.problems.push(updatedProblem._id);
                    promises2.push(user.save());
                });
                await Promise.all(promises2);
                
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
            const users = await User.find({ problems: problem._id })
            if (req.isAdmin || (users.some( user => user._id == req.id))) {

                const promises = [];
                const promises2 = [];

                users.forEach(user => promises.push(User.findOne({ userId: user.userId }, { password: 0 })));
                const usersResolved = await Promise.all(promises);
                
                usersResolved.forEach( user => {
                    const index = user.problems.indexOf(problem._id);
                    user.problems.splice(index, 1);
                    promises2.push(user.save());
                });
                await Promise.all(promises2);

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