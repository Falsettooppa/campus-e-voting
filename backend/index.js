const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config({ quiet: true });

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/voting-db';
const JWT_SECRET = process.env.JWT_SECRET;

let mongoConnectPromise;
let connectedUri;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});


const validateConfig = () => {
  if (!JWT_SECRET || !JWT_SECRET.trim()) {
    throw new Error('JWT_SECRET is missing. Set it in backend/.env.');
  }
};

const connectToMongo = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2 && mongoConnectPromise) {
    return mongoConnectPromise;
  }

  if (connectedUri && connectedUri !== MONGODB_URI) {
    throw new Error(
      `MongoDB is already connected with a different URI (${connectedUri}). ` +
      'Stop the process and restart with a single MONGODB_URI value.'
    );
  }

  connectedUri = MONGODB_URI;
  mongoConnectPromise = mongoose.connect(MONGODB_URI);

  return mongoConnectPromise;
};

const startServer = async () => {
  try {
    validateConfig();
    await connectToMongo();
    console.log(`MongoDB connected (${MONGODB_URI})`);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`DB connection error: ${error.message}`);
    console.error('Make sure MongoDB is running and only one MONGODB_URI is used in backend/.env.');
    process.exit(1);
  }
};

startServer();

module.exports = { app, startServer, connectToMongo };
