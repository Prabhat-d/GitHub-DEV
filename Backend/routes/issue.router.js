const express = require("express");
const issueController = require("../controllers/issueController");
const issueRouter = express.Router();

issueRouter.post("/issue/create", issueController.createIssue);
issueRouter.get("/issue/all", issueController.getAllIssues);
issueRouter.get("/issue/:id", issueController.getIssueByID);
issueRouter.put("/issue/update/:id", issueController.updateIssuebyID);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssuebyID);

module.exports = issueRouter;
