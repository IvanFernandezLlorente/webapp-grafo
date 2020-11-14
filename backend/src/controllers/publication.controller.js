import Publication from '../models/Publication';
import User from '../models/User';

export const getPublications = async (req, res) => {
    const publications = await Publication.find();
    res.status(200).json(publications);
}

export const getPublicationById = async (req, res) => {
    try {
        const { publicationId } = req.params;
        const publication = await Publication.findById(publicationId);
        res.status(200).json(publication);
    } catch (error) {
        res.status(404).json({message: "Publication not found"});
    }
}

export const createPublication = async (req, res) => {
    try {
        
        if (!req.isAdmin) {   
            const publication = await Publication.findOne({ title: req.body.title });
            if (publication) {
                return res.status(400).json({ message: "The publication already exists" });
            }
            
            const newPublication = new Publication(req.body)
        
            newPublication.user.push(req.userId);
            const publicationSaved = await newPublication.save();

            const user = await User.findById(req.userId, { password: 0 });
            user.publications.push(publicationSaved._id);
            await user.save();

            return res.status(200).json(publicationSaved);
        }
        res.status(403).json({message: "You can not create a publication"});
    } catch (error) {
        res.status(500).json({message: "Error"});
    }
}

export const updatePublicationById = async (req, res) => {
    try {
        const updatedPublication = await Publication.findByIdAndUpdate(
            req.params.publicationId,
            req.body,
            {
                new: true
            }
        )
        res.status(200).json(updatedPublication);
    } catch (error) {
        res.status(404).json({message: "Publication not found"});
    }
}

export const deletePublicationById = async (req, res) => {
    try {
        const { publicationId } = req.params;
        const user = await User.findOne({ publications: publicationId });
        if (user) {
            const index = user.publications.indexOf(publicationId);
            user.publications.splice(index, 1);
            await user.save();
        }
        
        await Publication.findByIdAndDelete(publicationId);
        res.status(200).json();
    } catch (error) {
        res.status(404).json({message: "Publication not found"});
    }
}