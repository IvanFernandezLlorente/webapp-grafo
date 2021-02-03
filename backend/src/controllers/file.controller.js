import File from "../models/File";
import fs from 'fs-extra';
import path from 'path';

export const getFileById = async (req, res) => {
    try {
        const file = await File.findOne({ fileId: req.params.fileId });
        if (file) {
            return res.status(200).json(file)
        }
        return res.status(401).json({ message: "File not found" });
    } catch (error) {
        return res.status(500).json({message: "Error"});
    }
}

export const downloadFile = async (req, res) => {
    try {
        const file = await File.findOne({ fileId: req.params.fileId });
        if (file) {
            return res.status(200).download(path.join( __dirname, '..', '..',  file.path ))
        }
        return res.status(401).json({ message: "File not found" });
    } catch (error) {
        return res.status(500).json({message: "Error"});
    }
}

export const uploadFile = async (req, res) => {
    try {
        const newFile = new File({ name: req.file.originalname, path: req.file.path, fileId: req.body.fileId, section: req.body.section });
        const fileSave = await newFile.save();
        return res.status(200).json(fileSave);
    } catch (error) {
        return res.status(500).json({message: "Error"});
    }
} 

export const deleteFile = async (req, res) => {
    try {
        const file = await File.findOne({ fileId: req.params.fileId });
        if (file) {
            await fs.unlink(path.resolve(file.path));
            await File.findOneAndDelete({ fileId: req.params.fileId });
            return res.status(200).json();
        }
        return res.status(401).json({ message: "File not found" });
    } catch (error) {
        return res.status(500).json({message: "Error"});
    }
}