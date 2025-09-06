const fs = require("fs").promises;
const path = require("path");

async function statusRepo() {
  const repoPath = path.resolve(process.cwd(), ".mygit");
  const stagingPath = path.join(repoPath, "staging");
  const commitsPath = path.join(repoPath, "commits");

  try {
    // 🔹 Check if repo initialized
    try {
      await fs.access(repoPath);
    } catch {
      console.log("❌ Not a mygithub repo (run `mygithub init` first).");
      return;
    }

    console.log("📌 Repository status:\n");

    // 🔹 Show staged files
    let stagedFiles = [];
    try {
      stagedFiles = await fs.readdir(stagingPath);
    } catch {
      stagedFiles = [];
    }

    if (stagedFiles.length > 0) {
      console.log("✅ Staged files:");
      stagedFiles.forEach((f) => console.log("   •", f));
    } else {
      console.log("⚠️  No files staged.");
    }

    // 🔹 Show last commit
    let commitDirs = [];
    try {
      commitDirs = await fs.readdir(commitsPath);
    } catch {
      commitDirs = [];
    }

    if (commitDirs.length > 0) {
      commitDirs.sort(); // latest commit is last (assuming commitId = timestamp or uuid)
      const lastCommit = commitDirs[commitDirs.length - 1];
      console.log(`\n📝 Last commit: ${lastCommit}`);
    } else {
      console.log("\nℹ️  No commits yet.");
    }
  } catch (error) {
    console.error("Error checking status:", error);
  }
}

module.exports = { statusRepo };