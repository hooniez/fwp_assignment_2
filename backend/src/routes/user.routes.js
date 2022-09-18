module.exports = (express, app) => {
  const controller = require("../controllers/user.controller.js");
  const router = express.Router();

  // Select all users.
  router.get("/", controller.all);

  // Select a single user with email.
  router.get("/select/:email", controller.one);

  // Select one user from the database if email and password are a match.
  router.get("/login", controller.login);

  // Create a new user.
  router.post("/", controller.create);

  // Delete a single user with email
  router.delete("/delete/:email", controller.delete);

  router.put("/", controller.edit);

  // Add routes to server.
  app.use("/api/users", router);
};
