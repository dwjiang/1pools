const express = require("express");
const app = express();
const server = require("http").Server(app);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

require("./src/router")(app);

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server up and running on port ${port}!`));
