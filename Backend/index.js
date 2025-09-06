require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pullRepo } = require("./controllers/pull");
const { pushRepo } = require("./controllers/push");
const { revertRepo } = require("./controllers/revert");
const mainRouter = require("./routes/main.router");

yargs(hideBin(process.argv))
  .command("start", "Starts a new server", {}, startServer)
  .command("init", "Initialise a new repository", {}, initRepo)
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "The file to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit changes to the repository",
    (yargs) => {
      yargs.positional("message", {
        describe: "The commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Push changes to the remote repository", {}, pushRepo)
  .command("pull", "Pull changes from the remote repository", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert changes to a file in the repository",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "The commit ID to revert changes",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need to specify a command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/", mainRouter);

  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((e) => {
      console.error("Error connecting to MongoDB: ", e);
    });

  const user = "test";
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("=====");
      console.log("User connected: ", userID);
      console.log("=====");
      socket.join(userID);
    });
  });

  const db = mongoose.connection;
  db.once("open", () => {
    console.log("CRUD operations called");
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
