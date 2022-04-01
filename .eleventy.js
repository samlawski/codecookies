const markdownIt = require("markdown-it")
const markdownItAnchor = require("markdown-it-anchor")

module.exports = eleventyConfig => {
  // Make the /assets directory public
  eleventyConfig.addPassthroughCopy("assets")

  // Turn markdown headers into permalinks
  eleventyConfig.setLibrary("md", markdownIt({
    html: true,
    linkify: false,
    breaks: true
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "article__header--js",
    permalinkSymbol: "🔗"
  }))
}