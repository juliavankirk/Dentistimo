import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./layouts/HomePage";
import OfficeDashboard from "./layouts/OfficeDashboard";
import PatientDashboard from "./layouts/Patient/PatientDashboard";
import DentistDashboard from "./layouts/Dentist/DentistDashboard";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Register from "./layouts/Register";
import NotFound from "./layouts/NotFound";

const mongoose = require("mongoose");
const express = require("express");
//const morgan = require("morgan");

const app = express();



mongoose.connect('mongodb://localhost:27017')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...'));

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/office-dashboard" element={<OfficeDashboard />} />
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/dentist-dashboard" element={<DentistDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
