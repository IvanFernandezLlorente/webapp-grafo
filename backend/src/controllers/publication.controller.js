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
        
            newPublication.user.push(req.id);
            const publicationSaved = await newPublication.save();
            publicationSaved.publicationId = publicationId;
            const finalPublication = await publicationSaved.save();
            
            const user = await User.findOne({ userId: req.userId }, { password: 0 });
            user.publications.push(finalPublication._id);
            await user.save();

            return res.status(200).json(finalPublication);
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
            const user = await User.findOne({ publications: publication._id });

            if (req.isAdmin || req.id == user._id) {
                if (req.body.publicationId && await publicationIdUnique(req.body.publicationId)) {
                    return res.status(400).json({ message: "The publicationId already exists" });
                }
                const updatedPublication = await Publication.findOneAndUpdate(
                    { publicationId: req.params.publicationId },
                    req.body,
                    {
                        new: true
                    }
                );
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
    console.log(publication);
    return publication;
}

export const deletePublicationById = async (req, res) => {
    try {
        const publication = await Publication.findOne({ publicationId: req.params.publicationId });
        if (publication) {
            const user = await User.findOne({ publications: publication._id })
            if (req.isAdmin || req.id == user._id) {

                const index = user.publications.indexOf(publication._id);
                user.publications.splice(index, 1);
                await user.save();
                
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