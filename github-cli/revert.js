const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readDir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(commitID) {
  const repoPath = path.resolve(process.cwd(), ".mygit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitID);
    const files = await readDir(commitDir);
    const parentDir = path.resolve(repoPath, "..");

    for (const file of files) {
      const srcPath = path.join(commitDir, file);
      const destPath = path.join(parentDir, file);
      await copyFile(srcPath, destPath);
    }

    console.log(`Reverted to commit ${commitID} successfully`);
  } catch (error) {
    console.error("Error reverting commit: ", error);
  }
}

module.exports = { revertRepo };
