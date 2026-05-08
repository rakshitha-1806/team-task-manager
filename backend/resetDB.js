const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

const resetDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connecting to database...');
    
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    
    console.log('✅ All Users, Projects, and Tasks have been completely removed!');
    process.exit();
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

resetDatabase();