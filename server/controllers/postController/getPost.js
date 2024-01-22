const FolderModel = require('../../models/taskSchema');

module.exports.getFolders = async (req, res) => {
  try {
    const folders = await FolderModel.find();
    res.json(folders);
  } catch (err) {
    res.status(500).json({ 'Message': `Error while retrieving folders: ${err.message}` });
  }
};
    