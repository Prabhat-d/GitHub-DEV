import axios from "axios";
import React, { useState, useEffect } from "react";
import "./dashboard.css";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Navbar from "../navbar/Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedRepoSearchQuery, setSuggestedRepoSearchQuery] = useState("");
  const [suggestedSearchResults, setSuggestedSearchResults] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/repo/user/${userId}`
        );
        setRepositories(response.data.repositories);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/repo/withStar/${userId}`
        );
        setSuggestedRepositories(response.data);
      } catch (error) {
        console.error("Error fetching suggested repositories:", error);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  const handleStar = async (repoId) => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.post(`http://localhost:3000/${userId}/starRepo/${repoId}`);

      setSuggestedRepositories((prev) =>
        prev.map((repo) =>
          repo._id.toString() === repoId
            ? { ...repo, isStarred: !repo.isStarred }
            : repo
        )
      );
      // Optionally, update the UI or state to reflect the starring action
    } catch (error) {
      console.error("Error starring repository:", error);
    }
  };

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredResults = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
    }
  }, [searchQuery, repositories]);

  useEffect(() => {
    if (suggestedRepoSearchQuery === "") {
      setSuggestedSearchResults(suggestedRepositories);
    } else {
      const filteredResults = suggestedRepositories.filter((repo) =>
        repo.name.toLowerCase().includes(suggestedRepoSearchQuery.toLowerCase())
      );
      setSuggestedSearchResults(filteredResults);
    }
  }, [suggestedRepoSearchQuery, suggestedRepositories]);

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside className="section">
          <h3>Suggested Repositories</h3>
          <div id="search">
            <input
              type="text"
              value={suggestedRepoSearchQuery}
              onChange={(e) => setSuggestedRepoSearchQuery(e.target.value)}
              placeholder="search..."
            />
          </div>
          {suggestedSearchResults.length > 0 ? (
            suggestedSearchResults.map((repo, key) => {
              return (
                <div key={key}>
                  <h3>{repo.name}</h3>
                  <p>{repo.owner.username}</p>
                  <div
                    onClick={() => handleStar(repo._id)}
                    style={{ cursor: "pointer" }}
                  >
                    {repo.isStarred ? (
                      <StarIcon color="warning" />
                    ) : (
                      <StarBorderIcon />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No repositories found.</p>
          )}
        </aside>
        <main className="section">
          <h3>Your Repositories</h3>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search..."
            />
          </div>
          {searchResults.length === 0 ? (
            <p>No repositories found.</p>
          ) : (
            searchResults.map((repo, key) => {
              return (
                <div key={key}>
                  <h3>{repo.name}</h3>
                  <p>{repo.owner.username}</p>
                </div>
              );
            })
          )}
        </main>
        <aside className="section">
          <h3>Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 5</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
