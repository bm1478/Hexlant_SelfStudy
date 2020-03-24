const {sequelize}= require('../models/index');

// 0. Connect localhost Database
async function connectDB() {
  try {
    await sequelize.sync();
    console.log("DB Connect");
    return true;
  } catch (err) {
    return err;
  }
}
connectDB();
