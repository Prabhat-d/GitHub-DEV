const fs = require("fs").promises;
const path = require("path");

async function addRepo(file) {
    const repoPath = path.resolve(process.cwd(), ".mygit");
    const stagingPath = path.join(repoPath, "staging");

    try {
        await fs.mkdir(stagingPath, { recursive: true });
        await fs.copyFile(file, path.join(stagingPath, path.basename(file)));
        console.log(`File ${file} added to the staging area.`);
    } catch (e) {
        console.error("Error adding file to the repository:", e);
    }
}

module.exports = {addRepo};
