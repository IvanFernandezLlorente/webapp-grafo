import Publication from '../models/Publication';

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
        res.status(404).json({message: 'Publication not found'});
    }
}

export const createPublication = async (req, res) => {
    try {
        const { title, userName, organization, description, state, instances, computationalExperience, reference } = req.body;
        const newPublication = new Publication({
            title,
            userName,
            organization,
            description,
            state,
            instances,
            computationalExperience,
            reference
        })

        if (!req.isAdmin) {
            newPublication.user.push(req.userId);
            const publicationSaved = await newPublication.save();
            const user = await User.findByIdAndUpdate(req.userId);
            //TODO: Update user
        }

    } catch (error) {
        
    }
}

export const updatePublicationById = async (req, res) => {
    
}

export const deletePublicationById = async (req, res) => {
    
}