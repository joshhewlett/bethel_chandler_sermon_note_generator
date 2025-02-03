// controllers/apiController.js
export default {
  // Example API endpoint returning JSON data
  getData: function (req, res) {
    // Imagine some business logic here that could involve MongoDB queries.
    res.json({
      message: 'API data response'
    });
  },

  // Render a page with dynamic content
  getDynamicContent: function (req, res) {
    const dynamicData = {
      time: new Date().toISOString(),
      message: 'Dynamic Content'
    };
    res.render('dynamic', dynamicData);
  }
};