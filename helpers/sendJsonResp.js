const sendJsonResp = (req, res) =>
  res.json({ error: "", data: res.locals.response })

module.exports = sendJsonResp
