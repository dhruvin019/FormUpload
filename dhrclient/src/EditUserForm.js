import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import './EditUserForm.css';

const EditUserForm = () => {
  const { id } = useParams();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    hobbies: [],
    gender: "",
    image: null, 
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleHobbiesChange = (e) => {
    setUser({
      ...user,
      hobbies: e.target.value.split(",").map((hobby) => hobby.trim()),
    });
  };

  const handleImageChange = (e) => {
    setUser({
      ...user,
      image: e.target.files[0], 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData();
        formData.append("firstName", user.firstName);
        formData.append("lastName", user.lastName);
        formData.append("email", user.email);
        formData.append("phoneNumber", user.phoneNumber);
        formData.append("hobbies", JSON.stringify(user.hobbies));
        formData.append("gender", user.gender);
        if (user.image) {
            formData.append("file", user.image); 
        }

        const response = await axios.put(`http://localhost:5000/api/edit/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log("User updated:", response.data);
        alert("User updated successfully");
    } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user");
    }
};
  
  return (
    <div className="container">
      <h2>Edit User</h2>
      <form onSubmit={handleSubmit} className="edit-user-form">
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            value={user.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            value={user.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="text"
            className="form-control"
            name="phoneNumber"
            value={user.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Hobbies (comma-separated):</label>
          <input
            type="text"
            className="form-control"
            name="hobbies"
            value={user.hobbies.join(", ")} 
            onChange={handleHobbiesChange}
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <input
            type="text"
            className="form-control"
            name="gender"
            value={user.gender}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Profile Image:</label>
          <input
            type="file"
            className="form-control-file"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit" className="btn btn-primary mr-2">
          Update User
        </button>
        <Link to="/dashboard" className="btn btn-secondary">
          Cancel
        </Link>
      </form>
    </div>
  
  );
};

export default EditUserForm;
