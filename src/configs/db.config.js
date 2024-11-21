// MongoDB connection setup
const mongoose = require("mongoose");
const env = require('./env.config')

const DB_URL = `mongodb+srv://${env.MongoDB_USER}:${env.MongoDB_PASS}@${env.MongoDB_CLUSTER}.mongodb.net/${env.MongoDB_DB}?retryWrites=true&w=majority`; // Connection string

module.exports = () => mongoose.connect(DB_URL)


