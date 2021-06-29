import Text from "../models/Text";

export const getTextByType = async (req, res) => {
    try {
        const text = await Text.findOne({ type: req.params.type });
        return res.status(200).json(text);
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

export const updateTextByType = async (req, res) => {
    try {
        if (req.isAdmin) {
            const text = await Text.findOne({ type: req.params.type });
            const { en, es } = req.body;

            if (!(text)) {
                const newtext = new Text({
                    type: req.params.type,
                    en,
                    es
                });

                const textSaved = await newtext.save();
                return res.status(200).json(textSaved);
            } else {
                text.en = en;
                text.es = es;
                const textSaved = await text.save();
                return res.status(200).json(textSaved);
            }
        }
        return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error" });
    }
}