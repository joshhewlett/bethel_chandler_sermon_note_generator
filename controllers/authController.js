// controllers/authController.js
import config from '../config/config.js'

export default {
    showLogin: function (req, res) {
        res.render('login', {
            currentPath: '/login'
        });
    },

    login: function (req, res) {
        const {
            username,
            password
        } = req.body;
        const user = config.users.find(u => u.username === username && u.password === password);
        req.session.destroy();

        if (user) {
            req.session.user = {
                username: user.username
            };
            res.redirect('/generate-new-notes');
        } else {
            res.render('login', {
                error: 'Invalid credentials',
                currentPath: '/login'
            });
        }
    },

    logout: function (req, res) {
        req.session.destroy();
        res.redirect('/auth/login');
    }
};