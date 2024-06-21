import React, { useState } from 'react';
import axios from 'axios';
import DashBoard from './DashBoard';
import Error from './Error';
import './FormData.css';

const FormDataComponent = () => {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    hobbies: [], 
    gender: '',
    file: null
  });
  const [submitStatus, setSubmitStatus] = useState(null); 
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormState({ ...formState, hobbies: [...formState.hobbies, value] });
    } else {
      setFormState({
        ...formState,
        hobbies: formState.hobbies.filter((hobby) => hobby !== value)
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      setFormState({ ...formState, file: null });
    } else {
      setError('');
      setFormState({ ...formState, file: selectedFile });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.file) {
      setError('Please select a file');
      return;
    }
    if (!/^\d{10}$/.test(formState.phoneNumber)) {
      setError('Phone number must be 10 digits');
      return;
    }

    const formData = new window.FormData();
    for (const key in formState) {
      if (key === 'hobbies') {
        formState.hobbies.forEach((hobby) => {
          formData.append('hobbies', hobby);
        });
      } else {
        formData.append(key, formState[key]);
      }
    }

    try {
      const response = await axios.post('http://localhost:5000/api/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSubmitStatus('success');
    } catch (error) {
      console.error('There was an error', error);
      setSubmitStatus('error');
    }
  };

  return (
    <div>
      {submitStatus === 'success' ? (
        <DashBoard/>
      ) : submitStatus === 'error' ? (
        <Error />
      ) : (
        <form onSubmit={handleSubmit}  className="form-container">
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formState.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formState.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formState.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Hobbies:</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                Swimming
                <input
                  type="checkbox"
                  name="Swimming"
                  value="Swimming"
                  checked={formState.hobbies.includes('Swimming')}
                  onChange={handleCheckboxChange}
                />
              </label>
              <label className="checkbox-label">
                Cricket
                <input
                  type="checkbox"
                  name="Cricket"
                  value="Cricket"
                  checked={formState.hobbies.includes('Cricket')}
                  onChange={handleCheckboxChange}
                />
              </label>
              <label className="checkbox-label">
                Coding
                <input
                  type="checkbox"
                  name="Coding"
                  value="Coding"
                  checked={formState.hobbies.includes('Coding')}
                  onChange={handleCheckboxChange}
                />
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <select
              name="gender"
              value={formState.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Upload File:</label>
            <input type="file" id="file" onChange={handleFileChange} />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default FormDataComponent;
