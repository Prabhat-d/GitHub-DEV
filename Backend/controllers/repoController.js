const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

const createRepo = async (req, res) => {
  const { name, owner, content, description, visibility, issues } = req.body;

  try {
    const ownerId = new mongoose.Types.ObjectId(owner);
    if (!name) {
      return res.status(400).json({ message: "Repository name is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(ownerId)) {
      return res.status(400).json({ message: "Invalid owner ID" });
    }

    const newRepo = new Repository({
      name,
      description,
      content,
      visibility,
      owner : ownerId,
      issues,
    });
    const result = await newRepo.save();

    await User.findByIdAndUpdate(ownerId, {
      $push: { repositories: result._id },
    });

    res.status(201).json({
      message: "Repository created successfully",
      repositoryId: result._id,
    });
  } catch (error) {
    console.error("Error creating repository:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllRepos = async (req, res) => {
  try {
    const repos = await Repository.find({}).populate("owner issues");
    res.status(200).json(repos);
  } catch (error) {
    console.error("Error fetching repositories:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchRepoByID = async (req, res) => {
  const repoId = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(repoId)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    const repo = await Repository.findById(repoId).populate("owner issues");
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    res.status(200).json(repo);
  } catch (error) {
    console.error("Error fetching repository by ID:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const fetchRepoByName = async (req, res) => {
  const repoName = req.params.name;

  try {
    const repo = await Repository.findOne({ name: repoName }).populate(
      "owner issues"
    );
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }
    res.status(200).json(repo);
  } catch (error) {
    console.log("Error fetching repository by name: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchReposForUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const repos = await Repository.find({ owner: userId }).populate(
      "owner issues"
    );
    if (repos.length === 0 || !repos) {
      return res
        .status(404)
        .json({ message: "No repositories found for this user" });
    }
    res.status(200).json({
      message: "Repositories fetched successfully",
      repositories: repos,
    });
  } catch (error) {
    console.log("Error fetching repositories for user: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateRepoByID = async (req, res) => {
  const id = req.params.id;
  const { content, description } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repo.content.push(content);
    repo.description = description;
    await repo.save();

    res
      .status(200)
      .json({ message: "Repository updated successfully", repository: repo });
  } catch (error) {
    console.error("Error updating repository:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const toggleVisibilityByID = async (req, res) => {
  const id = req.params.id;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    repo.visibility = !repo.visibility;
    await repo.save();

    res.status(200).json({
      message: "Repository visibility toggled successfully",
      repository: repo,
    });
  } catch (error) {
    console.error("Error toggling repository visibility:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRepoByID = async (req, res) => {
  const { userId, id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid repository ID" });
    }

    const repo = await Repository.findById(id);
    if (!repo) {
      return res.status(404).json({ message: "Repository not found" });
    }

    if (repo.owner.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await Repository.findByIdAndDelete(id);

    await User.findByIdAndUpdate(userId, { $pull: { repositories: id } });

    res.status(200).json({ message: "Repository deleted successfully" });
  } catch (error) {
    console.error("Error deleting repository:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getReposWithStar = async (req, res) => {
  try {
    const { userId } = req.params;

    // find user (to get starRepos array)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // get all repos (or suggested repos)
    const repos = await Repository.find();

    // attach isStarred property dynamically
    const reposWithStar = repos.map((repo) => ({
      ...repo.toObject(),
      isStarred: user.starRepos.some(
        (id) => id.toString() === repo._id.toString()
      ),
    }));

    res.status(200).json(reposWithStar);
  } catch (err) {
    console.error("Error fetching repos:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createRepo,
  getAllRepos,
  fetchRepoByID,
  fetchRepoByName,
  fetchReposForUser,
  updateRepoByID,
  toggleVisibilityByID,
  deleteRepoByID,
  getReposWithStar,
};
