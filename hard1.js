import Resource from '../models/ResourceModel.js';

export const createResource = async (req, res) => {
  const { code, name, description, type } = req.body;
  try {
    if (!code || !name || !type) {
      throw Error('code, name, type are required');
    }
    const exists = await Resource.findOne({ code });
    if (exists) {
      return res.status(400).json({ error: 'Resource already exists' });
    }
    const resource = new Resource({
      code,
      name,
      description,
      type,
    });
    await resource.save();
    res.status(200).json({ resource });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteResource = async (req, res) => {
  const { code } = req.body;
  try {
    if (!code) {
      throw Error('code is required');
    }
    const resource = await Resource.findOneAndDelete({ code });
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    return res.status(200).json({ resource });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getAResource = async (req, res) => {
  const { code } = req.params;
  try {
    const resource = await Resource.findOne({ code });
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    return res.status(200).json({ resource });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    if (!resources) {
      return res.status(404).json({ error: 'Resources not found' });
    }
    return res.status(200).json({ resources });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const updateResource = async (req, res) => {
  const { code, newCode, name, description, type } = req.body;
  try {
    if (!code) {
      throw Error('code is required');
    }
    const resource = await Resource.findOne({ code });
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    resource.code = newCode ?? resource.code;
    resource.name = name ?? resource.name;
    resource.description = description ?? resource.description;
    resource.type = type ?? resource.type;
    await resource.save();
    res.status(200).json({ resource });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
