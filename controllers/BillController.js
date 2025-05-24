const Bill = require('../models/BillModel');
const mongoose = require('mongoose');

// get all bills
const getBills = async (req, res) => {
  const bills = await Bill.find({}).sort({ createdAt: -1 });

  res.status(200).json(bills);
};

// get a single bill
const getBill = async (req, res) => {
  const { id } = req.params; // get id from url

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such bill' });
  }

  const bill = await Bill.findById(id);

  if (!bill) {
    return res.status(404).json({ error: 'No such bill' });
  }

  res.status(200).json(bill);
};

// create new bill
const createBill = async (req, res) => {
  const {
    patientId,
    patientName,
    normalServices: services,
    outsourceServices,
    Total: total,
    referredDoctor,
  } = req.body;

  let emptyFields = [];

  if (!total > 0) {
    emptyFields.push('total');
    return res.status(400).json({ error: 'Invalid total', emptyFields });
  }
  if (!patientId) {
    emptyFields.push('patientId');
  }
  if (!patientName) {
    emptyFields.push('patientName');
  }
  if (!services) {
    emptyFields.push('services');
  }
  if (!outsourceServices) {
    emptyFields.push('outsourceServices');
  }
  if (!total) {
    emptyFields.push('total');
  }
  if (!referredDoctor) {
    emptyFields.push('referredDoctor');
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill in all the fields', emptyFields });
  }
  // add doc to db
  try {
    const bill = await Bill.create({
      patientId,
      patientName,
      services,
      outsourceServices,
      total,
      referredDoctor,
    });
    res.status(200).json(bill);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a bill
const deleteBill = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such bill' });
  }

  const bill = await Bill.findByIdAndDelete({ _id: id }); //delete

  if (!bill) {
    return res.status(400).json({ error: 'No such bill' });
  }

  res.status(200).json(bill);
};

// update a bill
const updateBill = async (req, res) => {
  const { id } = req.params;
  const {
    patientId,
    patientName,
    services,
    outsourceServices,
    total,
    referredDoctor,
  } = req.body;

  let emptyFields = [];

  if (!total > 0) {
    emptyFields.push('total');
    return res.status(400).json({ error: 'Invalid total', emptyFields });
  }
  if (!patientId) {
    emptyFields.push('patientId');
  }
  if (!patientName) {
    emptyFields.push('patientName');
  }
  if (!services) {
    emptyFields.push('services');
  }
  if (!outsourceServices) {
    emptyFields.push('outsourceServices');
  }
  if (!total) {
    emptyFields.push('total');
  }
  if (!referredDoctor) {
    emptyFields.push('referredDoctor');
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill in all the fields', emptyFields });
  } else {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such bill' });
    }

    const bill = await Bill.findByIdAndUpdate(
      { _id: id },
      {
        ...req.body, // update with request body
      }
    );

    if (!bill) {
      return res.status(400).json({ error: 'No such bill' });
    }

    return res.status(200).json(bill);
  }
};

module.exports = {
  getBills,
  getBill,
  createBill,
  deleteBill,
  updateBill,
};
