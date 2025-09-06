const express = require("express");
const repoController = require("../controllers/repoController");
const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepo);
repoRouter.get("/repo/all", repoController.getAllRepos);
repoRouter.get("/repo/:id", repoController.fetchRepoByID);
repoRouter.get("/repo/name/:name", repoController.fetchRepoByName);
repoRouter.get("/repo/user/:userId", repoController.fetchReposForUser);
repoRouter.put("/repo/update/:id", repoController.updateRepoByID);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityByID);
repoRouter.delete("/repo/delete/:userId/:id", repoController.deleteRepoByID);
repoRouter.get("/repo/withStar/:userId", repoController.getReposWithStar);

module.exports = repoRouter;
