const { default: mongoose } = require('mongoose');
const config = require('./config');

const dbURL = config.MONGO_URL;

// Connect to the database
mongoose
  .connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000, // 60 seconds (default is 30s)
    socketTimeoutMS: 60000,
  })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
