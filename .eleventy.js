const CleanCSS = require("clean-css");
const embedTwitter = require("eleventy-plugin-embed-twitter");
const luxon = require("luxon");
const htmlMinifier = require("html-minifier-terser");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItPrism = require("markdown-it-prism");
const markdownItReplaceLink = require("markdown-it-replace-link");
const minifyXML = require("minify-xml");
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
  // Embed Twitter posts
  eleventyConfig.addPlugin(embedTwitter, {
    cacheText: true,
  });

  // Support .yaml Extension in _data
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy favicon, images, and netlify to /_site
  eleventyConfig.addPassthroughCopy({ "./src/static/favicon": "." });
  eleventyConfig.addPassthroughCopy("./src/static/img");
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
      return htmlMinifier.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    } else if (outputPath.endsWith(".xml")) {
      return minifyXML.minify(content);
    } else if (outputPath.endsWith(".css")) {
      return new CleanCSS({ level: 2 }).minify(content).styles;
    }

    return content;
  });

  // Set custom excerpt separator
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_separator: "<!-- excerpt -->",
  });

  // Set custom markdown options
  eleventyConfig.setLibrary("md", markdownIt(MARKDOWN_OPTIONS));

  // Add anchor links to headings
  eleventyConfig.amendLibrary("md", (md) =>
    md.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink({
        safariReaderFix: true,
      }),
    }),
  );

  // Support footnotes
  eleventyConfig.amendLibrary("md", (md) => md.use(markdownItFootnote));

  // Add syntax highlighting
  eleventyConfig.amendLibrary("md", (md) => md.use(markdownItPrism));

  // TODO: Find a way to add `starlark` to `Prism.languages`. Then change all
  // references from `python` to `starlark`.
  // Prism.languages["starlark"] = Prism.languages.extend("python", {});

  // See `replaceLink` in `MARKDOWN_OPTIONS`
  eleventyConfig.amendLibrary("md", (md) => md.use(markdownItReplaceLink));

  // Add `absoluteURL` filter. Used for Atom and RSS.
  eleventyConfig.addFilter("absoluteURL", (href, base) => {
    return new URL(href, base).toString();
  });

  // Add `rfc2822` filter. Used for RSS.
  eleventyConfig.addFilter("rfc2822", (date) => {
    return luxon.DateTime.fromJSDate(date).setZone("CST").toRFC2822();
  });

  // Add `mostRecentRFC2822` filter. Used for Atom.
  eleventyConfig.addFilter("rfc3339", (date) => {
    return date.toISOString();
  });

  // Add `mostRecentRFC2822` filter. Used for Atom and RSS.
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

  // Add `readableDate` filter. Used fto show post dates.
  let readableDate = (date) => {
    return luxon.DateTime.fromJSDate(date).setZone("CST").toFormat("DDD");
  };
  eleventyConfig.addFilter("readableDate", readableDate);

  // Add `toHTML` filter for inline markdown.
  // Used for Atom, RSS, and post lists.
  eleventyConfig.addFilter("toHTML", (str) => {
    return new markdownIt(MARKDOWN_OPTIONS).renderInline(str);
  });

  // Add `outdated`, `update`, and `updates` shortcodes. Used to display update
  // banners.
  eleventyConfig.addPairedLiquidShortcode("outdated", (content, timestamp) => {
    let date = new Date(timestamp);
    return `<aside class="o">
<h1><time datetime="${date.toISOString()}">${readableDate(date)}</time></h1>
<p>The information in this post is out of date, and exists only as historical record.</p>
${content}
</aside>`;
  });
  eleventyConfig.addPairedLiquidShortcode("update", (content, timestamp) => {
    let date = new Date(timestamp);
    return `<aside class="u">
<h1><time datetime="${date.toISOString()}">${readableDate(date)}</time></h1>
${content}
</aside>`;
  });
  eleventyConfig.addPairedLiquidShortcode("updates", (content) => {
    return content + "<hr/>";
  });

  // Add `file` shortcode. Used to add a filename to a code snippet.
  eleventyConfig.addPairedLiquidShortcode("file", (content, filename) => {
    return `<div class="f">
<p><span class="h">In </span><code>${filename}</code><span class="h">:</span></p>
${content}
</div>`;
  });

  // Add `note` shortcode. Used to display notes.
  eleventyConfig.addPairedLiquidShortcode("note", (content) => {
    // We don't use `renderInline` because it doesn't handle links correctly
    let body = new markdownIt(MARKDOWN_OPTIONS).render(content);
    return `<div class="n">
<p><span class="t">Note<span class="h">:</span></span> ${body.substring(3)}
</div>`;
  });

  // Add `version` shortcode. Used to display version numbers pills.
  eleventyConfig.addLiquidShortcode("version", (version) => {
    return `<span class="v"><span class="h">[</span>${version}<span class="h">]</span></span>`;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      output: "_site",
      data: "_data",
    },
    htmlTemplateEngine: "njk",
  };
};
