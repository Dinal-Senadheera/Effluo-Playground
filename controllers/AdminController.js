const Admin = require('../models/AdminModule');
const jwt = require('jsonwebtoken');
const mongooose = require('mongoose');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

const createAdmin = async (req, res) => {
  const { username, pw, user_id } = req.body;

  try {
    const admin = await Admin.create({ username, pw, user_id });
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getaAdmin = async (req, res) => {
  const { id } = req.params;

  if (!mongooose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such staff' });
  }

  const admin = await Admin.findById(id);

  if (!admin) {
    return res.status(400).json({ error: 'No such staff' });
  }

  res.status(200).json(admin);
};

const getAdmin = async (req, res) => {
  const admin = await Admin.find({}).sort({ createdAt: -1 });

  res.status(200).json(admin);
};

const loginAdmin = async (req, res) => {
  const { username, pw } = req.body;

  try {
    const admin = await Admin.login(username, pw);
    const token = createToken(admin._id);

    res.status(200).json({ username, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAdmin,
  createAdmin,
  getaAdmin,
  loginAdmin,
};
