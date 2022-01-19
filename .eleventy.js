const anchor = require("markdown-it-anchor");
const CleanCSS = require("clean-css");
const fs = require("fs");
const footnote = require("markdown-it-footnote");
const embedTwitter = require("eleventy-plugin-embed-twitter");
const luxon = require("luxon");
const htmlMin = require("html-minifier");
const replaceLink = require("markdown-it-replace-link");
const slugify = require("slugify");
const xmlMin = require("minify-xml");
const yaml = require("js-yaml");

const isProduction = process.env.NODE_ENV === `production`;

const MARKDOWN_OPTIONS = {
  html: true,
  linkify: true,
  typographer: true,
  replaceLink: function (link, env) {
    let parts = link.split("#", 2);
    let base = parts[0];
    let fragmentIdentifier = parts[1];
    let additional = fragmentIdentifier ? "#" + fragmentIdentifier : "";
    // Convert relative post markdown links to correct paths
    if (
      (post = env.collections.posts.find(
        (post) => post.template.parsed.base == base
      ))
    ) {
      return post.data.page.url + additional;
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

  // Copy images folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to /_site
  eleventyConfig.addPassthroughCopy({ "./src/static/favicon": "." });

  // Copy netlify to /_site
  eleventyConfig.addPassthroughCopy({ "./src/static/netlify": "." });

  // Serve 404 during development
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync("_site/404.html");

          // Provides the 404 content without redirect.
          res.write(content_404);

          // Add 404 http status code in request header.
          // res.writeHead(404, { "Content-Type": "text/html" });
          res.writeHead(404);

          res.end();
        });
      },
    },
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
        collapseWhitespace: true,
      });
    } else if (outputPath.endsWith(".xml")) {
      return xmlMin.minify(content);
    } else if (outputPath.endsWith(".css")) {
      return new CleanCSS({ level: 2 }).minify(content).styles;
    }

    return content;
  });

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });

  let markdownIt = require("markdown-it");
  let prism = require("markdown-it-prism");

  let md = markdownIt(MARKDOWN_OPTIONS);
  md.use(anchor, {
    permalink: anchor.permalink.headerLink({ safariReaderFix: true }),
  });
  md.use(footnote);
  md.use(prism);
  md.use(replaceLink);

  eleventyConfig.setLibrary("md", md);

  let filenameRegex = /\d+-\d+-\d+-(.*)/;

  eleventyConfig.addFilter("slugifyFilename", (string) => {
    let preSlug = string.match(filenameRegex) ?? string;
    return slugify(preSlug, {
      lower: true,
      remove: /['":]/g,
    });
  });

  eleventyConfig.addFilter("absoluteURL", (href, base) => {
    return new URL(href, base).toString();
  });

  eleventyConfig.addFilter("rfc2822", (date) => {
    return luxon.DateTime.fromJSDate(date).setZone("CST").toRFC2822();
  });

  eleventyConfig.addFilter("rfc3339", (date) => {
    return date.toISOString();
  });

  eleventyConfig.addFilter("mostRecentUpdated", (collection) => {
    if (!collection || !collection.length) {
      throw new Error("Collection is empty in mostRecentRFC2822 filter.");
    }

    return new Date(
      Math.max(
        ...collection.map((item) => {
          return item.data.updated ?? item.date;
        })
      )
    );
  });

  let readableDate = (date) => {
    return luxon.DateTime.fromJSDate(date).setZone("CST").toFormat("DDD");
  };

  eleventyConfig.addFilter("readableDate", readableDate);

  eleventyConfig.addFilter("toHTML", (str) => {
    return new markdownIt(MARKDOWN_OPTIONS).renderInline(str);
  });

  eleventyConfig.addPairedLiquidShortcode("update", (content, timestamp) => {
    let date = new Date(timestamp);
    let body = new markdownIt(MARKDOWN_OPTIONS).render(content);
    return `<aside>
<h1><time datetime="${date.toISOString()}">${readableDate(date)}</time></h1>
${body}
</aside>`;
  });

  eleventyConfig.addPairedLiquidShortcode("updates", (content) => {
    return content + "<hr/>";
  });

  return {
    dir: { input: "src", output: "_site", data: "_data" },
    htmlTemplateEngine: "njk",
  };
};
