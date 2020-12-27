import Publication from '../models/Publication';
import User from '../models/User';

export const getPublications = async (req, res) => {
    const publications = await Publication.find();
    res.status(200).json(publications);
}

export const getPublicationById = async (req, res) => {
    try {
        const { publicationId } = req.params;
        const publication = await Publication.findOne({ publicationId });
        res.status(200).json(publication);
    } catch (error) {
        res.status(404).json({ message: "Publication not found" });
    }
}

export const createPublication = async (req, res) => {
    try {
        if (!req.isAdmin) {
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

            users.forEach( user => {
                user.publications.push(publicationSaved._id);
                promises2.push(user.save());
            });
            await Promise.all(promises2);

            return res.status(200).json(publicationSaved);
        }
        res.status(403).json({ message: "You can not create a publication" });
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
}

export const updatePublicationById = async (req, res) => {
    try {
        const publication = await Publication.findOne({ publicationId: req.params.publicationId });
        if (publication) {
            const users = await User.find({ publications: publication._id });
            if (req.isAdmin || (users.some(user => user._id == req.id))) {
                
                if (req.body.publicationId && await publicationIdUnique(req.body.publicationId)) {
                    return res.status(400).json({ message: "The publicationId already exists" });
                }

                const promises = [];
                const promises2 = [];

                // Quitar las referencias de la publicacion a todos los users
                users.forEach( user => {
                    const index = user.publications.indexOf(publication._id);
                    user.publications.splice(index, 1);
                    promises.push(user.save());
                });
                await Promise.all(promises);

                const updatedPublication = await Publication.findOneAndUpdate(
                    { publicationId: req.params.publicationId },
                    req.body,
                    {
                        new: true
                    }
                );

                promises.splice(0,promises.length);
                
                // poner las referencias de la publicacion a los nuevos users
                updatedPublication.user.forEach( userId => promises.push(User.findOne({ userId }, { password: 0 })))
                const users2 = await Promise.all(promises);

                users2.forEach( user => {
                    user.publications.push(updatedPublication._id);
                    promises2.push(user.save());
                });
                await Promise.all(promises2);

                return res.status(200).json(updatedPublication);
            }
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(401).json({ message: "Publication not found" });
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
            const users = await User.find({ publications: publication._id })
            if (req.isAdmin || (users.some( user => user._id == req.id))) {

                const promises = [];

                users.forEach( user => {
                    const index = user.publications.indexOf(publication._id);
                    user.publications.splice(index, 1);
                    promises.push(user.save());
                });
                await Promise.all(promises);
                
                await Publication.findOneAndDelete({ publicationId: publication.publicationId });
                return res.status(200).json();
            }
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(401).json({ message: "Publication not found" });
    } catch (error) {
        res.status(404).json({ message: "Error" });
    }
}