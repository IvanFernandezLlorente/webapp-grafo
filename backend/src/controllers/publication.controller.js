import Publication from '../models/Publication';
import User from '../models/User';
import Problem from '../models/Problem';

export const getPublications = async (req, res) => {
    const publications = await Publication.find();
    return res.status(200).json(publications);
}

export const getPublicationById = async (req, res) => {
    try {
        const { publicationId } = req.params;
        const publication = await Publication.findOne({ publicationId });
        if (publication) {
            return res.status(200).json(publication);
        }
        return res.status(404).json({ message: "Publication not found" });
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
}

export const createPublication = async (req, res) => {
    try {
        const publicationId = (req.body.title.toLowerCase().split(" ")).join('-');

        const publication = await Publication.findOne({ publicationId });
        if (publication) {
            return res.status(400).json({ message: "The publication already exists" });
        }
        
        const newPublication = new Publication(req.body)
        newPublication.publicationId = publicationId;
        const publicationSaved = await newPublication.save();

        const promises = [];
        const promises2 = [];
        
        publicationSaved.user.forEach( userId => promises.push(User.findOne({ userId }, { password: 0 })))
        const users = await Promise.all(promises);
        await Promise.all(saveReferences(users, publicationSaved));

        
        publicationSaved.problems.forEach( problemId => promises2.push(Problem.findOne({ problemId })));
        const problems = await Promise.all(promises2);
        await Promise.all(saveReferences(problems, publicationSaved));

        return res.status(200).json(publicationSaved);
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
}

export const updatePublicationById = async (req, res) => {
    try {
        const publication = await Publication.findOne({ publicationId: req.params.publicationId });
        if (publication) {
            const users = await User.find({ publications: publication.publicationId });
            if (req.isAdmin || (users.some(user => user._id == req.id))) {
                
                if (req.body.publicationId && await publicationIdUnique(req.body.publicationId)) {
                    return res.status(400).json({ message: "The publicationId already exists" });
                }
                const promises = [];
                const promises2 = [];
                // Quitar las referencias de la publicacion a todos los users
                await Promise.all(deleteReferences(users, publication));

                const problems = await Problem.find({ publications: publication.publicationId });
                await Promise.all(deleteReferences(problems, publication));

                const updatedPublication = await Publication.findOneAndUpdate(
                    { publicationId: req.params.publicationId },
                    req.body,
                    {
                        new: true
                    }
                );
                
                // poner las referencias de la publicacion a los nuevos users
                updatedPublication.user.forEach( userId => promises.push(User.findOne({ userId }, { password: 0 })))
                const users2 = await Promise.all(promises);
                await Promise.all(saveReferences(users2, updatedPublication));


                updatedPublication.problems.forEach(problemId => promises2.push(Problem.findOne({ problemId })));
                const problems2 = await Promise.all(promises2);
                await Promise.all(saveReferences(problems2, updatedPublication));

                return res.status(200).json(updatedPublication);
            }
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(404).json({ message: "Publication not found" });
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
}

const publicationIdUnique = async (publicationId) => {
    const publication = await Publication.findOne({ publicationId });
    return publication;
}

export const deletePublicationById = async (req, res) => {
    try {
        const publication = await Publication.findOne({ publicationId: req.params.publicationId });
        if (publication) {
            const users = await User.find({ publications: publication.publicationId })
            if (req.isAdmin || (users.some( user => user._id == req.id))) {
                await Promise.all(deleteReferences(users, publication));

                const problems = await Problem.find({ publications: publication.publicationId });
                await Promise.all(deleteReferences(problems, publication));
                
                await Publication.findOneAndDelete({ publicationId: publication.publicationId });

                return res.status(200).json();
            }
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(401).json({ message: "Publication not found" });
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

const saveReferences = (array, publication) => {
    const promises = [];

    array.forEach( item => {
        item.publications.push(publication.publicationId);
        promises.push(item.save());
    });

    return promises;
}

const deleteReferences = (array, publication) => {
    const promises = [];
    
    array.forEach( item => {
        const index = item.publications.indexOf(publication.publicationId);
        item.publications.splice(index, 1);
        promises.push(item.save());
    });

    return promises;
}