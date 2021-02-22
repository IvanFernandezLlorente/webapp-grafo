import Application from "../models/Application";
import User from "../models/User";
import * as emailSend from '../libs/email';

export const getApplications = async (req, res) => {
    try {
        const applications = await Application.find();
        return res.status(200).json(applications)
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

export const createApplication = async (req, res) => {
    try {
        const { email, name, description } = req.body;
        
        const emailFound = await User.findOne({ email });
            
        if (emailFound){
            return res.status(400).json({ message: "The email already exists" });
        } 

        const emailRequested = await Application.findOne({ email });
            
        if (emailRequested){
            return res.status(400).json({ message: "The email already send a request" });
        } 
        
        const newApplication = new Application({
            email,
            name,
            description
        });

        const applicationSaved = await newApplication.save();

        return res.status(200).json(applicationSaved);
    } catch (error) {
        return res.status(500).json({ message: "Error" });
    }
}

export const acceptApplication = async (req, res) => {
    try {
        const applicationFound = await Application.findById(req.params.id)
        if (!applicationFound) {
            return res.status(404).json({ message: "Application not found" });
        }

        if (req.body.accepted) {
            applicationFound.accepted = true;
            const applicationSaved = await applicationFound.save();
            await emailSend.emailAccepted(applicationFound.email, applicationFound.name);
            return res.status(200).json(applicationSaved);
        } 
        return res.status(400).json({ message: "Application not accepted" });
    } catch (error) {
        return res.status(500).json({message: "Error"});
    }
}

export const rejectApplication = async (req, res) => {
    try {
        const applicationFound = await Application.findById(req.params.id)
        if (!applicationFound) {
            return res.status(404).json({ message: "Application not found" });
        }
       
        await emailSend.emailRejected(applicationFound.email, applicationFound.name);
        await Application.findOneAndDelete({ _id: req.params.id });
                 
        return res.status(200).json();
    } catch (error) {
        return res.status(500).json({message: "Error"});
    }
}