import User from "../models/User.js";
import Application from "../models/Application.js";

export const getApplications = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if(!user) {
            return res.json({
                message: 'This user does not exist'
            })
        }

        const applications = await Application.find({ user: user_id })
        if(!applications) {
            res.status(400).json({ message: 'Applications not found' })
        }
        res.status(200).json({ applications })
    } catch (error) {
        console.error('Failed to fetch applications:', error);
        res.status(500).json({ message: error.message });
    }
}