# ⚡ staminigit  

[![npm version](https://img.shields.io/npm/v/staminigit.svg)](https://www.npmjs.com/package/staminigit)
[![npm downloads](https://img.shields.io/npm/dt/staminigit.svg)](https://www.npmjs.com/package/staminigit)
[![license](https://img.shields.io/npm/l/staminigit.svg)](LICENSE)

A simple **GitHub-like CLI tool** built with Node.js.  
It lets you initialize repos, stage files, commit, check status, and even sync with AWS S3.  
Think of it as a **mini git** made from scratch 🚀  

---

## ✨ Features

- `init` → Initialize a new repo (`.mygit` folder created)  
- `add <file>` → Stage a file for commit  
- `commit "<message>"` → Commit staged files with a message  
- `status` → Show staged files and last commit info  
- `revert <commitId>` → Revert to a specific commit  
- `push` → Push commits to AWS S3 bucket (requires AWS setup)  
- `pull` → Pull commits from AWS S3 bucket (requires AWS setup)  

---

## 📦 Installation

Install globally from npm:

```bash
npm install -g staminigit
```

Check version:

```bash
mygithub --version
```

---

## 🚀 Usage

### Local commands (work out-of-the-box ✅)

```bash
mygithub init
mygithub add index.js
mygithub commit "Initial commit"
mygithub status
mygithub revert <commitId>
```

### Cloud commands (require AWS setup ⚠️)

```bash
mygithub push
mygithub pull
```

⚠️ To use cloud commands, create a `.env` file with your AWS credentials:

```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=your-region
S3_BUCKET=your-bucket-name
```

---

## 📂 Example Workflow

```bash
mkdir demo
cd demo
mygithub init
echo "Hello" > hello.txt
mygithub add hello.txt
mygithub commit "first commit"
mygithub status
mygithub push   # if AWS is configured
```

---

## 🛠 Requirements

- Node.js (>= 14)  
- npm  
- AWS S3 account (only if using push/pull)  

---

## 📜 License

MIT © 2025 [Prabhat](https://github.com/Prabhat-d)
