const User = require('../models/User');


async function edit(userId, userData) {
    return await User.updateOne({ _id: userId }, { $set: { ...userData } });
}

async function getUserById(userId) {
    return await User.findById(userId).populate("createdSells").lean();
}

//매너온도 찾는용도
async function getUserById2(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Failed to get user by ID');
    }
  }


module.exports = {
    edit,
    getUserById,

    getUserById2

}