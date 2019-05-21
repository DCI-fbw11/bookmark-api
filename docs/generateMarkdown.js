const marked = require("marked")
const fs = require("fs")
// this file needs to be run in terminal to generate the inner.html file from the docs.md file
// node generateMarkdown.js
// then the inner html gets pasted in the docs html div with the id content
const generateMarkdown = () => {
  const readMe = fs.readFileSync("DOCS.md", "utf-8")
  const markdownReadMe = marked(readMe)

  fs.writeFileSync("INNER.html", markdownReadMe)
}

generateMarkdown()
