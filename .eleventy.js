const anchor = require("markdown-it-anchor");
const fs = require("fs");
const embedTwitter = require("eleventy-plugin-embed-twitter");
const luxon = require("luxon");
const htmlMin = require("html-minifier");
const replaceLink = require('markdown-it-replace-link');
const xmlMin = require("minify-xml")
const yaml = require("js-yaml");

const isProduction = process.env.NODE_ENV === `production`;

const MARKDOWN_OPTIONS = {
  html: true,
  linkify: true,
  typographer: true,
  replaceLink: function (link, env) {
    // Convert relative post markdown links to correct paths
    if (post = env.collections.posts.find(post => post.template.parsed.base == link)) {
      return post.data.page.url;
    }
    return link;
  },
};

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Plugins
  eleventyConfig.addPlugin(embedTwitter, {
    cacheText: true,
  });

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) =>
    yaml.safeLoad(contents)
  );

  // Copy Netlify CSM config to /_site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
  });

  // Copy AlpineJS to /_site
  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/alpine.js": "./static/js/alpine.js",
  });

  // Copy PrismJS to /_site
  eleventyConfig.addPassthroughCopy({
    "./node_modules/prism-themes/themes/prism-vsc-dark-plus.css":
    "./static/css/prism-vsc-dark-plus.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Serve 404 during development
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, bs) {

        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync('_site/404.html');

          // Provides the 404 content without redirect.
          res.write(content_404);

          // Add 404 http status code in request header.
          // res.writeHead(404, { "Content-Type": "text/html" });
          res.writeHead(404);

          res.end();
        });
      }
    }
  });

  // Minify HTML/XML
  eleventyConfig.addTransform("minify", (content, outputPath) => {
    if (!isProduction) {
      return content;
    }

    if (outputPath.endsWith(".html")) {
      return htmlMin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
    } else if (outputPath.endsWith(".xml")) {
      return xmlMin.minify(content);
    }

    return content;
  });

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });

  let markdownIt = require("markdown-it");
  let prism = require('markdown-it-prism');

  let md = markdownIt(MARKDOWN_OPTIONS);
  md.use(anchor);
  md.use(prism);
  md.use(replaceLink);

  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addFilter("absoluteURL", (href, base) => {
    return (new URL(href, base)).toString();
  });

  eleventyConfig.addFilter("relativeDate", date => {
    return luxon.DateTime.fromJSDate(date).toRelative();
  });

  eleventyConfig.addFilter("rfc2822", date => {
    return luxon.DateTime.fromJSDate(date).setZone("CST").toRFC2822();
  });

  eleventyConfig.addFilter("mostRecentUpdated", collection => {
    if (!collection || !collection.length) {
      throw new Error("Collection is empty in mostRecentRFC2822 filter.");
    }

    return new Date(Math.max(...collection.map(item => {return item.data.updated ?? item.date})));
  });

  eleventyConfig.addFilter("readableDate", date => {
    return luxon.DateTime.fromJSDate(date).setZone("CST").toLocaleString({
      year: 'numeric',
      weekday: 'long',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short',
    });
  });

  eleventyConfig.addFilter("toHTML", str => {
    return new markdownIt(MARKDOWN_OPTIONS).renderInline(str);
  });

  return {
    dir: { input: 'src', output: '_site', data: '_data' },
    htmlTemplateEngine: "njk",
  };
};
