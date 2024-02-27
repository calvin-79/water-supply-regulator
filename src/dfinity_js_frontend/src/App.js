import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ComplaintsPage from "./pages/Complaints";
import SuppliesPage from "./pages/Supplies";
import HomesPage from "./pages/Homes";

const App = function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomesPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route path="/supplies" element={<SuppliesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
