const { exampleMiddleware } = require("../middleware");
const exampleController = require("../controllers/exampleController");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept",
    );
    next();
  });

  const router = require("express").Router();

  router.get(
    "/refactor-1",
    [exampleMiddleware.exampleMiddlewareFunction],
    exampleController.refactoreMe1,
  );

  router.post(
    "/refactor-2",
    [exampleMiddleware.exampleMiddlewareFunction],
    exampleController.refactoreMe2,
  );

  router.get(
    "/socket",
    [exampleMiddleware.exampleMiddlewareFunction],
    exampleController.callmeWebSocket,
  );

  router.get(
    "/get-data",
    [exampleMiddleware.exampleMiddlewareFunction],
    exampleController.getData,
  );

  router.post("/login", exampleController.login);

  app.use("/api/data", router);
};
