const CleanCSS = require("clean-css");
const embedTwitter = require("eleventy-plugin-embed-twitter");
const luxon = require("luxon");
const htmlMin = require("html-minifier");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItPrism = require("markdown-it-prism");
const markdownItReplaceLink = require("markdown-it-replace-link");
const xmlMin = require("minify-xml");
const yaml = require("js-yaml");

const isProduction = process.env.NODE_ENV === `production`;

const MARKDOWN_OPTIONS = {
  html: true,
  linkify: true,
  replaceLink: function (link, env) {
    let parts = link.split("#", 2);
    let base = parts[0];
    let fragmentIdentifier = parts[1];
    let additional = fragmentIdentifier ? "#" + fragmentIdentifier : "";
    // Convert relative post markdown links to correct paths
    if (
      (post = env.collections.posts.find(
        (post) => post.template.parsed.base == base,
      ))
    ) {
      return post.data.page.url + additional;
    }
    return link;
  },
  typographer: true,
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
    yaml.safeLoad(contents),
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

  // Prevent widows
  // Copied from https://github.com/ekalinin/typogr.js/blob/4c1d4afc5457c4b1456dc1d56af2d9cf8171b8e2/typogr.js#L137-L154
  eleventyConfig.addTransform("widont", (content, outputPath) => {
    if (!outputPath.endsWith(".html")) {
      return content;
    }

    var inline_tags = "a|em|span|strong|i|b";
    var word =
      "(?:<(?:" +
      inline_tags +
      ")[^>]*?>)*?[^\\s<>]+(?:</(?:" +
      inline_tags +
      ")[^>]*?>)*?";
    var re_widont = new RegExp(
      "(" + // matching group 1
        "\\s+" +
        word + // space and a word with a possible bordering tag
        "\\s+" +
        word + // space and a word with a possible bordering tag
        ")" +
        "(?:\\s+)" + // one or more space characters
        "(" + // matching group 2
        "[^<>\\s]+" + // nontag/nonspace characters
        "(?:\\s*</(?:a|em|span|strong|i|b)[^>]*?>\\s*\\.*)*?" + // one or more inline closing tags
        // can be surrounded by spaces
        // and followed by a period.
        "(?:\\s*?</(?:p|h[1-6]|li|dt|dd)>|$)" + // allowed closing tags or end of line
        ")",
      "gi",
    );
    return content.replace(re_widont, '$1<span class="widont"> </span>$2');
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

  eleventyConfig.setLibrary("md", markdownIt(MARKDOWN_OPTIONS));
  eleventyConfig.amendLibrary("md", md => md.use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink({ safariReaderFix: true }),
  }));
  eleventyConfig.amendLibrary("md", md => md.use(markdownItFootnote));
  eleventyConfig.amendLibrary("md", md => md.use(markdownItPrism));
  eleventyConfig.amendLibrary("md", md => md.use(markdownItReplaceLink));

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
        }),
      ),
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

  eleventyConfig.addLiquidShortcode("version", (version) => {
    return `<span class="v"><span class="h">[</span>${version}<span class="h">]</span></span>`;
  });

  return {
    dir: { input: "src", output: "_site", data: "_data" },
    htmlTemplateEngine: "njk",
  };
};
