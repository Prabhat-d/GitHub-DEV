# 📖 staminigit - Usage Guide

## Initialize a Repository
```bash
mygithub init
```
Creates a `.mygit` folder in the current directory.

---

## Stage a File
```bash
mygithub add index.js
```
Adds `index.js` to the staging area.

---

## Commit Changes
```bash
mygithub commit "Added index.js"
```
Commits all staged files with a message.

---

## Check Status
```bash
mygithub status
```
Shows:
- Files staged for commit
- Last commit ID

---

## Revert to a Commit
```bash
mygithub revert <commitId>
```
Restores files from a previous commit.

---

## Push to Cloud (S3)
```bash
mygithub push
```
Uploads commits to your configured AWS S3 bucket.

---

## Pull from Cloud (S3)
```bash
mygithub pull
```
Fetches commits from your configured AWS S3 bucket.

⚠️ Requires `.env` file with AWS credentials.
