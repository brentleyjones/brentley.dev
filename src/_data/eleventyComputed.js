module.exports = {
    summary: data => { return data.description ?? data.page.excerpt },
};
