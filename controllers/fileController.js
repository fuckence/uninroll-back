import path from 'path';
import User from '../models/User.js';
import File from '../models/File.js';
import fs from 'fs';
import fileFieldConfig  from "../helpers/fileFields.js";
import { getFormattedDate } from '../helpers/utilities.js';

// Ensure this path is correct

// Function to upload files
export const uploadFiles = async (req, res) => {
    try {
        // Fetch the user by their ID
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }


        // Validation to ensure all expected files are present
        const expectedFields = fileFieldConfig.fileFields.map(field => field.name);
        const receivedFields = Object.keys(req.files);
        const missingFields = expectedFields.filter(field => !receivedFields.includes(field));

        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Missing required files: ' + missingFields.join(', ') });
        }

        for (const fileId of user.files) {
            const oldFile = await File.findById(fileId);
            if (oldFile) {
                await File.deleteOne({ _id: fileId });
            }
        }

        // Process each file and save new entries in the database
        const files = await Promise.all(
            Object.entries(req.files).map(async ([fieldName, fileArray]) => {
                const file = fileArray[0];
                console.log(fieldName + ' ' + file);
                const currentDate = getFormattedDate()
                // Generate a custom filename using the field name for consistency
                const newFilename = `${fieldName}${path.extname(file.originalname)}`;

                // Create a new file record with the custom filename
                const newFile = new File({
                    filename: newFilename,
                    path: file.path,
                    user: user._id
                });
                await newFile.save();
                return newFile._id;
            })
        );
        user.files.push(...files);
        await user.save();

        // Respond with success message and file details
        res.status(201).send({ message: 'Files uploaded successfully', files });
    } catch (error) {
        console.error('Failed to upload files:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getFiles = async (req, res) => {
    try {
        // Fetch the user by their ID from authentication middleware
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Assume File model has a 'user' field that references User model
        const files = await File.find({ user: user._id });
        res.status(200).json({ files });
    } catch (error) {
        console.error('Failed to fetch files:', error);
        res.status(500).json({ message: error.message });
    }
};

export default {
    uploadFiles,
    getFiles
};

