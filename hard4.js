import Room from '../models/RoomModel.js';
import Booking from '../models/BookingModel.js';
import Resource from '../models/ResourceModel.js';
import moment from 'moment';

export const createBooking = async (req, res) => {
  const { date, from, to, bookedItemCode, type, reason } = req.body;
  const { _id: userId } = req.user;
  try {
    if (!date || !from || !to || !bookedItemCode || !type) {
      throw Error('date, from, to, type, bookedItemCode are required');
    }
    if (type.toLowerCase() !== 'room' && type.toLowerCase() !== 'resource') {
      throw Error('type must be either "room" or "resource"');
    }

    let item;
    if (type.toLowerCase() === 'room') {
      item = await Room.findOne({ code: bookedItemCode });
    } else if (type.toLowerCase() === 'resource') {
      item = await Resource.findOne({ code: bookedItemCode });
    }
    if (!item) {
      return res.status(404).json({ error: `${bookedItemCode} not found` });
    }

    const convertedDate = moment(date).format('YYYY/MM/DD');
    const convertedFrom = moment(`${date} ${from}`);
    const convertedTo = moment(`${date} ${to}`);

    const bookings = await Booking.find({
      date: convertedDate,
      bookedItem: item?._id,
    });

    for (const book of bookings) {
      const alreadyBookedFrom = moment(book.from);
      const alreadyBookedTo = moment(book.to);
      if (
        convertedFrom.isBetween(alreadyBookedFrom, alreadyBookedTo) ||
        convertedTo.isBetween(alreadyBookedFrom, alreadyBookedTo) ||
        alreadyBookedFrom.isBetween(convertedFrom, convertedTo) ||
        alreadyBookedTo.isBetween(convertedFrom, convertedTo) ||
        convertedFrom.isSame(alreadyBookedFrom) ||
        convertedTo.isSame(alreadyBookedTo)
      ) {
        throw Error('Booking overlaps with existing booking');
      }
    }

    const booking = new Booking({
      date: convertedDate,
      from: convertedFrom,
      to: convertedTo,
      type,
      bookedItem: item?._id,
      reason,
      createdBy: userId,
    });
    await booking.save();
    res.status(200).json({ booking });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  const { id } = req.body;
  const { _id: userId, userType } = req.user;

  try {
    if (!id) {
      throw Error('id is required');
    }
    const booking = await Booking.findOne({ _id: id });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    if (booking.createdBy != userId && userType.toLowerCase() !== 'admin') {
      return res.status(401).json({
        error:
          'Access Denied. Admin Level access required to perform this action',
      });
    }
    await booking.deleteOne();
    return res.status(200).json({ booking });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const updateBooking = async (req, res) => {
  const { id, date, from, to, bookedItemCode, type, reason } = req.body;
  const { _id: userId, userType } = req.user;
  try {
    if (!id) {
      throw Error('id is required');
    }
    const booking = await Booking.findOne({ _id: id });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    if (booking.createdBy != userId && userType.toLowerCase() !== 'admin') {
      return res.status(401).json({
        error:
          'Access Denied. Admin Level access required to perform this action',
      });
    }
    if (date) {
      booking.date = new Date(date);
    }
    if (from) {
      const day = booking.date.toISOString().split('T')[0];
      booking.from = new Date(`${day}T${from}`);
    }
    if (to) {
      const day = booking.date.toISOString().split('T')[0];
      booking.to = new Date(`${day}T${to}`);
    }
    if (bookedItemCode) {
      let item = undefined;
      if (type.toLowerCase() === 'room') {
        item = await Room.findOne({ _id: bookedItemCode });
      } else if (type.toLowerCase() === 'resource') {
        item = await Resource.findOne({ _id: bookedItemCode });
      }
      if (!item) {
        return res.status(404).json({ error: `${bookedItemCode} not found` });
      }
      booking.bookedItem = item._id;
    }
    if (type) {
      booking.type = type;
    }
    if (reason) {
      booking.reason = reason;
    }
    await booking.save();
    res.status(200).json({ booking });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    if (!bookings) {
      return res.status(404).json({ error: 'Bookings not found' });
    }
    return res.status(200).json({ bookings });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getABooking = async (req, res) => {
  const { id } = req.params;
  try {
    const booking = await Booking.findOne({ _id: id });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    return res.status(200).json({ booking });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllBookingsByDate = async (req, res) => {
  const params = req.query;
  try {
    const convertedDate = params.date;
    const bookings = await Booking.find({ date: convertedDate });
    if (!bookings) {
      return res.status(404).json({ error: 'Bookings not found' });
    }
    return res.status(200).json({ bookings });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllBookingsByItem = async (req, res) => {
  const { bookedItemCode } = req.params;
  try {
    const bookings = await Booking.find({ bookedItem: bookedItemCode });
    if (!bookings) {
      return res.status(404).json({ error: 'Bookings not found' });
    }
    return res.status(200).json({ bookings });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
