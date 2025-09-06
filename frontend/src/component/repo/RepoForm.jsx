import React, { useState } from "react";
import axios from "axios";
import "./RepoForm.css";
import { useNavigate } from "react-router-dom";

const RepoForm = () => {
  const [repoName, setRepoName] = useState("");
  const [repoDescription, setRepoDescription] = useState("");
  const [repoContent, setRepoContent] = useState("");
  const [repoVisibility, setRepoVisibility] = useState(true);
  const [toast, setToast] = useState(null); // ✅ state for custom notifications
  const navigate = useNavigate();

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000); // auto hide after 3s
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!repoName.trim()) {
      showToast("⚠️ Repository name is required", "error");
      return;
    }

    const userId = localStorage.getItem("userId");

    try {
      await axios.post("http://localhost:3000/repo/create", {
        name: repoName,
        description: repoDescription,
        content: repoContent,
        visibility: repoVisibility,
        owner: userId,
      });

      showToast("✅ Repository created successfully!", "success");
      setRepoName("");
      setRepoDescription("");
      setRepoContent("");
      setRepoVisibility(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Error creating repository:", error);
      showToast("Failed to create repository. Try again.", "error");
    }
  };

  return (
    <div>
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

      <h2>Create a New Repository</h2>

      <form onSubmit={handleSubmit} className="repo-form">
        <label>
          Repository Name
          <input
            type="text"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
          />
        </label>

        <label>
          Repository Description
          <textarea
            value={repoDescription}
            onChange={(e) => setRepoDescription(e.target.value)}
          />
        </label>

        <label>
          Repository Content
          <textarea
            value={repoContent}
            onChange={(e) => setRepoContent(e.target.value)}
          />
        </label>

        <label className="visibility-toggle">
          <input
            type="checkbox"
            checked={repoVisibility}
            onChange={(e) => setRepoVisibility(e.target.checked)}
          />
          Public
        </label>

        <button type="submit">Create Repository</button>
      </form>
    </div>
  );
};

export default RepoForm;
