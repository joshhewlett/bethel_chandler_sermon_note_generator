// services/mongoService.js
import mongoose from 'mongoose';
import config from '../config/config.js';

export default {
    connect: function () {
        mongoose.connect(config.mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            })
            .then(() => console.log('MongoDB connected'))
            .catch(err => console.error('MongoDB connection error:', err));
    }
};