require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");
const ReturnDocument = require("mongodb").ReturnDocument;
const objectId = require("mongodb").ObjectId;
const upload = require("../config/cloudConfig").upload;

let uri = process.env.MONGO_URI;
let client;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  await client.connect();
}

const signup = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    await connectToDatabase();
    const db = client.db("githubclone");
    const userCollection = await db.collection("users");

    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userCollection.insertOne({
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
      profilePic: "https://res.cloudinary.com/dp0z1bebl/image/upload/v1757063677/ProfileImage_wmzd10.png"
    });

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, userId: result.insertedId });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    await connectToDatabase();
    const db = client.db("githubclone");
    const userCollection = await db.collection("users");

    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    await connectToDatabase();
    const db = client.db("githubclone");
    const userCollection = await db.collection("users");

    const users = await userCollection.find({}).toArray();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserProfile = async (req, res) => {
  const userId = req.params.id;
  try {
    await connectToDatabase();
    const db = client.db("githubclone");
    const userCollection = await db.collection("users");

    const user = await userCollection.findOne({ _id: new objectId(userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { password, email } = req.body;

  try {
    await connectToDatabase();
    const db = client.db("githubclone");
    const userCollection = await db.collection("users");

    const user = await userCollection.findOne({ _id: new objectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (password) {
      await userCollection.updateOne(
        { _id: new objectId(userId) },
        { $set: { password: await bcrypt.hash(password, 10), email } },
        { ReturnDocument: "after" }
      );
    } else {
      await userCollection.updateOne(
        { _id: new objectId(userId) },
        { $set: { email } },
        { ReturnDocument: "after" }
      );
    }

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUserProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    await connectToDatabase();
    const db = client.db("githubclone");
    const userCollection = await db.collection("users");

    const user = await userCollection.findOne({ _id: new objectId(userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await userCollection.deleteOne({ _id: new objectId(userId) });
    await db
      .collection("repositories")
      .deleteMany({ owner: new objectId(userId) });
    res.status(200).json({
      message: "User profile and their repositories deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user profile:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const starRepos = async (req, res) => {
  const { userId, repoId } = req.params;

  try {
    await connectToDatabase();
    const db = client.db("githubclone");
    const userCollection = await db.collection("users");

    if (!objectId.isValid(userId) || !objectId.isValid(repoId)) {
      return res
        .status(400)
        .json({ message: "Invalid user ID or repository ID" });
    }

    const user = await userCollection.findOne({ _id: new objectId(userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyStarredRepos = user.starRepos.some(
      (id) => id.toString() === repoId
    );
    const repoObjectId = new objectId(repoId);
    if (alreadyStarredRepos) {
      await userCollection.updateOne(
        { _id: new objectId(userId) },
        { $pull: { starRepos: repoObjectId } }
      );
      return res
        .status(200)
        .json({ message: "Repository unstarred successfully", user: user });
    } else {
      await userCollection.updateOne(
        { _id: new objectId(userId) },
        { $push: { starRepos: repoObjectId } }
      );
    }

    const updatedUser = await userCollection.findOne({
      _id: new objectId(userId),
    });

    res
      .status(200)
      .json({ message: "Repository starred successfully", user: updatedUser });
  } catch (error) {
    console.error("Error starring repository:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const uploadProfilePic = async (req, res) => {
  const userId = req.params.userId;
  const profilePic = req.body.profilePic;

  try {
    await connectToDatabase();
    const db = client.db("githubclone");
    const userCollection = await db.collection("users");

    const user = await userCollection.findOne({ _id: new objectId(userId) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await userCollection.updateOne(
      { _id: new objectId(userId) },
      { $set: { profilePic: profilePic } }
    );

    const updatedUser = await userCollection.findOne({
      _id: new objectId(userId),
    });

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  starRepos,
  uploadProfilePic,
};
