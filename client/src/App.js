import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import Pets from "./pages/Pets";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddPet from "./pages/AddPet";
import AdminDashboard from "./pages/AdminDashboard";
import AdoptionForm from "./pages/AdoptionForm";
import "./App.css";
import Home from "./pages/Home";
import PetDetails from "./pages/PetDetails";
import Favorites from "./pages/Favorites";
function App() {
  return (
      <Router>
        <Header />

        <Routes>
          {/*<Route path="/" element={<Pets />} />*/}
          <Route path="/pets" element={<Pets />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-pet" element={<AddPet />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/pet/:id" element={<PetDetails />} />
            <Route path="/adoption-form/:petId" element={<AdoptionForm />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
        </Routes>
      </Router>
  );
}

export default App;