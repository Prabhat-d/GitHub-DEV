const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createIssue = async (req, res) => {
  const { title, description, repoId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(repoId)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    const newIssue = new Issue({
      title,
      description,
      repo: repoId,
    });

    await newIssue.save();
    res
      .status(201)
      .json({ message: "Issue created successfully", issueId: newIssue._id });
  } catch (error) {
    console.error("Error creating issue:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateIssuebyID = async (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    issue.title = title || issue.title;
    issue.description = description || issue.description;
    issue.status = status || issue.status;
    await issue.save();
    res.status(200).json({
      message: "Issue updated successfully",
      issue: issue,
    });
  } catch (error) {
    console.error("Error updating issue:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteIssuebyID = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedIssue = await Issue.findByIdAndDelete(id);
    if (!deletedIssue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (error) {
    console.error("Error deleting issue:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllIssues = async (req, res) => {
  const id = req.params.id;

  try {
    const issues = await Issue.find({ repository: id });

    if (!issues || issues.length === 0) {
      return res.status(404).json({ message: "No issues found" });
    }
    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getIssueByID = async (req, res) => {
  const id = req.params.id;

  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.status(200).json(issue);
  } catch (error) {
    console.error("Error fetching issue:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createIssue,
  updateIssuebyID,
  deleteIssuebyID,
  getAllIssues,
  getIssueByID,
};
