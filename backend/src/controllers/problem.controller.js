import Problem from '../models/Problem';
import User from '../models/User';
import Publication from '../models/Publication';

export const getProblems = async (req, res) => {
    const problems = await Problem.find();
    return res.status(200).json(problems);
}

export const getProblemById = async (req, res) => {
    try {
        const { problemId } = req.params;
        const problem = await Problem.findOne({ problemId });
        if (problem) {
            return res.status(200).json(problem);
        }
        return res.status(404).json({ message: "Problem not found" });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

export const createProblem = async (req, res) => {
    try {
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
        await Promise.all(saveReferences(users, problemSaved));

        problemSaved.publications.forEach( publicationId => promises2.push(Publication.findOne({ publicationId })));
        const publications = await Promise.all(promises2);
        await Promise.all(saveReferences(publications, problemSaved));

        return res.status(200).json(problemSaved);
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

export const updateProblemById = async (req, res) => {
    try {
        const problem = await Problem.findOne({ problemId: req.params.problemId });
        if (problem) {
            const users = await User.find({ problems: problem.problemId });
            if (req.isAdmin || (users.some(user => user._id == req.id))) {
                
                if (req.body.problemId && await problemIdUnique(req.body.problemId)) {
                    return res.status(400).json({ message: "The problem already exists" });
                }

                const promises = [];
                const promises2 = [];

                // Quitar las referencias del problema a todos los user
                await Promise.all(deleteReferences(users, problem));

                const publications = await Publication.find({ problems: problem.problemId });
                await Promise.all(deleteReferences(publications, problem));

                const updatedProblem = await Problem.findOneAndUpdate(
                    { problemId: req.params.problemId },
                    req.body,
                    {
                        new: true
                    }
                );
                
                
                // poner las referencias del problema a los nuevos users
                updatedProblem.user.forEach( userId => promises.push(User.findOne({ userId }, { password: 0 })))
                const users2 = await Promise.all(promises);
                await Promise.all(saveReferences(users2, updatedProblem));

                updatedProblem.publications.forEach(publicationId => promises2.push(Publication.findOne({ publicationId })));
                const publications2 = await Promise.all(promises2);
                await Promise.all(saveReferences(publications2, updatedProblem));

                return res.status(200).json(updatedProblem);
            }
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(404).json({ message: "Problem not found" });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
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
            const users = await User.find({ problems: problem.problemId })
            if (req.isAdmin || (users.some( user => user._id == req.id))) {
                await Promise.all(deleteReferences(users, problem));
                
                const publications = await Publication.find({ problems: problem.problemId });
                await Promise.all(deleteReferences(publications, problem));

                await Problem.findOneAndDelete({ problemId: problem.problemId });
                
                return res.status(200).json();
            }
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(401).json({ message: "Problem not found" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error" });
    }
}

const saveReferences = (array, problemSaved) => {
    const promises = [];

    array.forEach( item => {
        item.problems.push(problemSaved.problemId);
        promises.push(item.save());
    });

    return promises;
}

const deleteReferences = (array, problem) => {
    const promises = [];
    
    array.forEach( item => {
        const index = item.problems.indexOf(problem.problemId);
        item.problems.splice(index, 1);
        promises.push(item.save());
    });

    return promises;
}