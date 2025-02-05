// app.js
import express from 'express';
import session from 'express-session';
import path from 'path';
import bodyParser from 'body-parser';
import expressLayouts from 'express-ejs-layouts';
import {
    fileURLToPath
} from 'url';
import {
    dirname
} from 'path';

import config from './config/config.js';
import mongoService from './services/mongoService.js';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import notesRoutes from './routes/notesRoutes.js';

// Set up __dirname in ESM
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
mongoService.connect();

const app = express();

// Set up view engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Session middleware (for authentication)
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false
}));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Add current path to all responses
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// Load routes
app.use('/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/', pageRoutes);
app.use('/', notesRoutes);

const PORT = config.port || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});