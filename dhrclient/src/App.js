import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import DashBoard from './DashBoard';
import EditUserForm from './EditUserForm';
import FormDataComponent from './FormData';

const App = () => {
  return (
    <div>
     
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<FormDataComponent />} />
        <Route exact path="/dashboard" element={<DashBoard />} />
        <Route path="/edit/:id" element={<EditUserForm />} />
      </Routes>
      </BrowserRouter>
     
      
    </div>
  );
};

export default App;
