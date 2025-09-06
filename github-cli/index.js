#!/usr/bin/env node
const { Command } = require("commander");
const {statusRepo} = require("./status");

// Import your commands
const { initRepo } = require("./init");
const { addRepo } = require("./add");
const { commitRepo } = require("./commit");
const { pushRepo } = require("./push");
const { pullRepo } = require("./pull");
const { revertRepo } = require("./revert");

const program = new Command();

program
  .name("mygithub")
  .description("Custom GitHub-like CLI tool")
  .version("1.0.0");

// ---------------------- INIT ----------------------
program
  .command("init")
  .description("Initialize a new repository")
  .action(async () => {
    await initRepo();
  });

// ---------------------- ADD ----------------------
program
  .command("add <file>")
  .description("Stage a file")
  .action(async (file) => {
    await addRepo(file);
  });

// ---------------------- COMMIT ----------------------
program
  .command("commit <message>")
  .description("Commit staged changes with a message")
  .action(async (message) => {
    await commitRepo(message);
  });

// ---------------------- PUSH ----------------------
program
  .command("push")
  .description("Push commits to S3")
  .action(async () => {
    await pushRepo();
  });

// ---------------------- PULL ----------------------
program
  .command("pull")
  .description("Pull all commits from S3")
  .action(async () => {
    await pullRepo();
  });

// ---------------------- REVERT ----------------------
program
  .command("revert <commitId>")
  .description("Revert to a specific commit")
  .action(async (commitId) => {
    await revertRepo(commitId);
  });

// ---------------------- STATUS ----------------------
program
  .command("status")
  .description("Show repository status (staged files and last commit)")
  .action(async () => {
    await statusRepo();
  });

program.parse(process.argv);
