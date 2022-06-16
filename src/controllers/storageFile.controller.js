const StorageFile = require('../models/StorageFile');


const getFiles = async (name) => {
    const searchParemeters = name ? { name } : {};
    const files = await StorageFile.find(searchParemeters).lean();
}