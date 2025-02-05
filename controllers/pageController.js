// controllers/pageController.js
export default {
    // Serve a static page (could also be served via express.static)
    staticPage: function (req, res) {
        res.sendFile('static.html', {
            root: 'views'
        });
    }
};