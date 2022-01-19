const smartquotes = require("smartquotes");

module.exports = {
  prettyTitle: (data) => {
    if (data.title) {
      return smartquotes(data.title);
    } else {
      return "Untitled";
    }
  },
  summary: (data) => {
    if (data.description) {
      return smartquotes(data.description);
    } else {
      return data.page.excerpt;
    }
  },
};
