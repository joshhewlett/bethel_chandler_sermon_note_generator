// config/config.js
// TODO: Figure out why i need to import dotenv here..
import dotenv from 'dotenv';
dotenv.config();

export default {
  port: 3000,
  mongoURI: 'mongodb://localhost:27017/whiteglove',
  sessionSecret: 'your_secret_key_here',
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  // White-glove auth: only these two users are allowed.
  // In production, always store hashed passwords.
  users: [{
      username: 'user1',
      password: 'password1'
    },
    {
      username: 'user2',
      password: 'password2'
    }
  ]
};