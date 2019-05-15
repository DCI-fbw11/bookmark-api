// This function parses the date format from the user
// user input query: /bookmarks?startDate=2018.12.01&endDate=2019.05.15
// parsed result = 2018,12,1 2019,5,15 which is the required format needed for new Date() in controller

const dateParser = (start, end) => {
  let parseStart = start.replace(/(\.)/g, ",")
  let parseEnd = end.replace(/(\.)/g, ",")
  let parsedStart = parseStart.replace(/,0/g, ",")
  let parsedEnd = parseEnd.replace(/,0/g, ",")
  return { parsedStart, parsedEnd }
}

module.exports = dateParser
