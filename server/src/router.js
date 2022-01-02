const commentsController = require("./controllers/commentsController");
const updatesController = require("./controllers/updatesController");
const walletsController = require("./controllers/walletsController");
const errorHandler = require("./utils/errorHandler");

module.exports = (app) => {
  app.get("/", (req, res) => res.send("Welcome!"));
  
  app.get("/api/comments/find/:pool", errorHandler.asyncWrapper(commentsController.findAll));
  app.post("/api/comments/create/:pool", errorHandler.asyncWrapper(commentsController.create));
  
  app.get("/api/updates/find/:pool", errorHandler.asyncWrapper(updatesController.findAll));
  app.post("/api/updates/create/:pool", errorHandler.asyncWrapper(updatesController.create));
  
  app.get("/api/wallets/find/:id", errorHandler.asyncWrapper(walletsController.find));
  
  app.use(errorHandler.errorHandler);
};
