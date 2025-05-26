const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  pw: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    require: true,
  },
});

AdminSchema.statics.login = async function (username, pw) {
  if (!username || !pw) {
    throw Error('Fill all the fields');
  }

  const user = await this.findOne({ username });

  if (!user) {
    throw Error('Incorrect username');
  }

  //const match = await bcrypt.compare(pw, user.pw)

  if (pw != user.pw) {
    throw Error('Incorrect password');
  }

  return user;
};

module.exports = mongoose.model('Admin', AdminSchema);
