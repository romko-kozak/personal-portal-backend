require('dotenv').config();
require('colors');
require('./models');
const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authMiddleware = require('./middleware/authMiddleware');
const UserService = require('./services/user-service');

const PORT = process.env.PORT || 8888;
const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/auth', require('./routes/auth-routes'));
app.use(authMiddleware);
app.use('/api/users', require('./routes/user-routes'));
app.use('/api/permissions', require('./routes/permissions-routes'));
app.use(errorHandler);

cron.schedule('0 0 * * *', () => { // Run at midnight every day
  UserService.updateAvatarUrls();
});

const start = async () => {
  try {
    await sequelize.authenticate(); // You can use the .authenticate() function to test if the connection is OK

    console.log('\n               🔐 DB CONNECTION WAS SUCCESSFULL! 🗄'.bgGreen.bold);

    await sequelize.sync({ alter: true }); // You can use sequelize.sync() to automatically synchronize all models

    console.log('\n         🔄 ALL MODELS WERE SYNCHRONIZED SUCCESSFULLY! 👌'.bgGreen.bold);

    app.listen(PORT, () => console.log(`\n\n                          🦾 Welcome! \n\n          This server 💻 is running 🏃 on port ${PORT} 👀 \n`.cyan.bold));
  } catch (err) {
    console.log(`\n               😱 AN ERROR OCCURED DURING SERVER START! 💩\n`.red.bold);
    console.error(err);
  }
};

start();