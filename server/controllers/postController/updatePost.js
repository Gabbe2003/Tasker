const FolderModel = require('../../models/taskSchema');
const mongoose = require('mongoose');

module.exports.updateFolder = async (req, res) => {
    const { folderId } = req.params;
    const updatedData = req.body;
    const userId = req.user.id.toString(); // Ensure the userId is a string to match the schema

    // Define a list of fields that can be updated
    const updatableFields = ['name', 'favorite', 'tasks'];

    // Filter updatedData to include only updatable fields
    const filteredData = Object.keys(updatedData)
        .filter(key => updatableFields.includes(key))
        .reduce((obj, key) => {
            obj[key] = updatedData[key];
            return obj;
        }, {});

    if (!mongoose.Types.ObjectId.isValid(folderId)) {
        return res.status(400).json({ 'Message': 'Invalid folder ID format' });
    }

    try {
        // Check if the folder exists and belongs to the authenticated user
        const folder = await FolderModel.findOne({ _id: mongoose.Types.ObjectId(folderId), owner: userId });
        if (!folder) {
            return res.status(404).json({ 'Message': 'Folder not found or you do not have permission to access this folder.' });
        }

        // Check if a folder with the new name already exists for this user (if name is being updated)
        if (filteredData.name) {
            const existingFolder = await FolderModel.findOne({ name: filteredData.name, owner: userId, _id: { $ne: mongoose.Types.ObjectId(folderId) } });
            if (existingFolder) {
                return res.status(409).json({ 'Message': 'Another folder with the same name already exists.' });
            }
        }

        // Update the folder
        const updatedFolder = await FolderModel.findByIdAndUpdate(
            folderId,
            filteredData,
            { new: true }
        );

        res.json(updatedFolder);
    } catch (err) {
        console.error(`Error while updating folder: ${err.message}`, err);
        res.status(500).json({ 'Message': 'An error occurred while updating the folder. Please try again later.' });
    }
};
