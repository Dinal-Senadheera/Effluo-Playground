import Notification from '../models/NotificationModel.js';
import User from '../models/UserModel.js';
import Timetable from '../models/TimetableModel.js';

export const createNotification = async (req, res) => {
  const { userId, timetableId, message } = req.body;

  try {
    if (!userId) {
      throw Error('user is required');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let timetable = null;
    if (timetableId) {
      timetable = await Timetable.findById(timetableId);
      if (!timetable) {
        return res.status(404).json({ error: 'Timetable not found' });
      }
    }

    const notification = new Notification({
      user,
      timetable,
      message,
    });
    await notification.save();
    const savedNotification = await Notification.findOne({ user: userId })
      .populate({ path: 'user', select: '-password' })
      .populate('timetable');

    res.status(200).json({ notification: savedNotification });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      throw Error('userId is required');
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const notifications = await Notification.find({ user: userId })
      .populate({ path: 'user', select: '-password' })
      .populate('timetable');

    res.status(200).json({ notifications });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.body;

  try {
    if (!id) {
      throw Error('id is required');
    }

    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await notification.deleteOne();
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const updateNotification = async (req, res) => {
  const { id, userId, timetableId, message } = req.body;

  try {
    if (!id) {
      throw Error('id is required');
    }

    const notification = await Notification.findById(id);

    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      notification.user = userId;
    }

    if (timetableId) {
      const timetable = await Timetable.findById(timetableId);
      if (!timetable) {
        return res.status(404).json({ error: 'Timetable not found' });
      }
      notification.timetable = timetableId;
    }

    if (message) {
      notification.message = message;
    }

    await notification.save();
    const savedNotification = await Notification.findOne({ user: userId })
      .populate({ path: 'user', select: '-password' })
      .populate('timetable');

    res.status(200).json({ notification: savedNotification });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate({
      path: 'user',
      select: '-password',
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
