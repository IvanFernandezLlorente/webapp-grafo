import Description from "../models/Description";

export const getDescription = async (req, res) => {
    try {
        const description = await Description.findOne();
        return res.status(200).json(description);
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

export const updateDescription = async (req, res) => {
    try {
        if (req.isAdmin) {
            const description = await Description.findOne();
            const { en, es } = req.body;

            if (!(description)) {
                const newdescription = new Description({
                    en,
                    es
                });

                const descriptionSaved = await newdescription.save();
                return res.status(200).json(descriptionSaved);
            } else {
                description.en = en;
                description.es = es;
                const descriptionSaved = await description.save();
                return res.status(200).json(descriptionSaved);
            }
        }
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error" });
    }
}