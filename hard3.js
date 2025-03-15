import Faculty from '../models/FacultyModel.js';

const createFaculty = async (req, res) => {
  const { code, name } = req.body;
  try {
    if (!code || !name) {
      throw Error('Faculty must have an Code and a Name');
    }
    const exists = await Faculty.findOne({ code });
    if (exists) {
      return res.status(400).json({ error: 'Faculty already exists' });
    }
    const faculty = new Faculty({ code, name });
    await faculty.save();
    res.status(200).json({ faculty });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const updateFaculty = async (req, res) => {
  const { currentCode, newCode, newName } = req.body;
  try {
    if (!currentCode && (!newCode || !newName)) {
      throw Error('Current Code and (New Code or New Name) are required');
    }
    const faculty = await Faculty.findOne({ code: currentCode });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    faculty.code = newCode || faculty.code;
    faculty.name = newName || faculty.name;
    await faculty.save();
    res.status(200).json({ faculty });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const deleteFaculty = async (req, res) => {
  const { code } = req.body;
  try {
    const faculty = await Faculty.findOneAndDelete({ code });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    return res.status(200).json({ faculty });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getAFaculty = async (req, res) => {
  const { code } = req.params;
  try {
    const faculty = await Faculty.findOne({ code });
    if (!faculty) {
      return res.status(404).json({ error: 'Faculty not found' });
    }
    return res.status(200).json({ faculty });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

const getAllFaculties = async (_, res) => {
  try {
    const faculties = await Faculty.find();
    res.status(200).json({ faculties });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export {
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getAFaculty,
  getAllFaculties,
};
