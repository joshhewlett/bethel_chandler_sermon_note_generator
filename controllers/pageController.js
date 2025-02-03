// controllers/pageController.js
export default {
    // Home page (requires authentication)
    home: function (req, res) {
        res.render('generate_step1', {
            user: req.session.user
        });
    },

    // Serve a static page (could also be served via express.static)
    staticPage: function (req, res) {
        res.sendFile('static.html', {
            root: 'views'
        });
    }
};