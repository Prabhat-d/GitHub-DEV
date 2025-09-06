# ⚡ prabhat-github-cli  

[![npm version](https://img.shields.io/npm/v/prabhat-github-cli.svg)](https://www.npmjs.com/package/staminigit)
[![npm downloads](https://img.shields.io/npm/dt/staminigit.svg)](https://www.npmjs.com/package/staminigit)

A simple **GitHub-like CLI tool** built with Node.js.  
It lets you initialize repos, stage files, commit, push to S3, pull, and revert — a **mini git** made from scratch 🚀  

---

## ✨ Features

- `init` → Initialize a new repo (`.mygit` folder created)  
- `add <file>` → Stage a file for commit  
- `commit "<message>"` → Commit staged files with a message  
- `status` → Show staged files and last commit info  
- `push` → Push commits to AWS S3 bucket  
- `pull` → Pull commits from AWS S3 bucket  
- `revert <commitId>` → Revert to a specific commit  

---

## 📦 Installation

Install globally from npm:

```bash
npm install -g staminigit