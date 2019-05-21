const app = require("./app")
const chalk = require("chalk")

const PORT = process.env.PORT || 4000

app.listen(PORT, console.log(chalk.green("Server is listening on port:", PORT))) // eslint-disable-line no-console
