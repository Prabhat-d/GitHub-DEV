import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../navbar/Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import { useAuth } from "../../authContext";
import { FaPen } from "react-icons/fa";
import HeatMapComponent from "./HeatMap";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `https://github-dev-backend.onrender.com/userProfile/${userId}`
          );
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "github-dev-preset");

    //Upload to Cloudinary
    const uploadRes = await axios.post(
      "https://api.cloudinary.com/v1_1/dp0z1bebl/image/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const imageUrl = uploadRes.data.secure_url;

    // Save URL in backend
    const userId = localStorage.getItem("userId");
    await axios.put(`https://github-dev-backend.onrender.com/uploadProfilePic/${userId}`, {
      profilePic: imageUrl,
    });

    setUserDetails((prev) => ({ ...prev, profilePic: imageUrl }));
  };

  return (
    <>
      <Navbar />

      <UnderlineNav
        aria-label="Repository"
        sx={{
          marginTop: "60px",
          borderBottom: "1px solid #5b6269ff",
        }}
      >
        <UnderlineNav.Item
          aria-current="page"
          icon={BookIcon}
          sx={{
            backgroundColor: "transparent",
            color: "white",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          onClick={() => navigate("/repo")}
          icon={RepoIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Starred Repositories
        </UnderlineNav.Item>

        <UnderlineNav.Item
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setCurrentUser(null);

            window.location.href = "/auth";
          }}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
            marginLeft: "auto",
          }}
          id="logout"
        >
          Logout
        </UnderlineNav.Item>
      </UnderlineNav>

      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div className="profile-image">
            <div className="image-container">
              {userDetails.profilePic ? (
                <img src={userDetails.profilePic} alt="Profile" />
              ) : (
                <img
                  src="https://res.cloudinary.com/dp0z1bebl/image/upload/v1757063677/ProfileImage_wmzd10.png"
                  alt="Default Profile"
                />
              )}
            </div>

            <label htmlFor="file-upload" className="edit-icon">
              <FaPen />
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleProfilePicUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="name">
            <h3>{userDetails.username}</h3>
          </div>

          <button className="follow-btn">Follow</button>

          <div className="follower">
            <p>10 Follower</p>
            <p>3 Following</p>
          </div>
        </div>

        <div className="heat-map-section">
          <HeatMapComponent />
        </div>
      </div>
    </>
  );
};

export default Profile;
