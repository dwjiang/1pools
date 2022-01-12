const commentsController = require("./controllers/commentsController");
const updatesController = require("./controllers/updatesController");
const walletsController = require("./controllers/walletsController");
const filesController = require("./controllers/filesController");
const viewsController = require("./controllers/viewsController");
const errorHandler = require("./utils/errorHandler");

module.exports = (app) => {
  app.get("/", (req, res) => res.send("Welcome!"));
  
  app.get("/api/comments/find/:pool", errorHandler.asyncWrapper(commentsController.findAll));
  app.post("/api/comments/create/:pool", errorHandler.asyncWrapper(commentsController.create));
  
  app.get("/api/updates/find/:pool", errorHandler.asyncWrapper(updatesController.findAll));
  app.post("/api/updates/create/:pool", errorHandler.asyncWrapper(updatesController.create));
  
  app.get("/api/wallets/find/:id", errorHandler.asyncWrapper(walletsController.find));
  
  app.post("/api/files/metadata", errorHandler.asyncWrapper(filesController.uploadMetadata));
  
  app.get("/api/pools/get-views", errorHandler.asyncWrapper(viewsController.getViews));
  app.post("/api/pools/view", errorHandler.asyncWrapper(viewsController.view));
  
  app.use(errorHandler.errorHandler);
};
