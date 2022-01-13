require("dotenv").config();

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  }
});

io.on("connection", (socket) => {
  const pool = socket.handshake.query.id;
  socket.join(pool);
  
  socket.on("refresh", (type) => {
    socket.to(pool).emit("refresh", type);
  });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

app.use(express.json({ limit: "100kb" }));

require("./src/router")(app);

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`Server up and running on port ${port}!`));
