// src/App.jsx or src/Routes.jsx
// import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import GenerateNotesPage from "./components/GenerateNote";
import GenerateTestPage from "./components/GenerateTestPage";
import PublishNotesPage from "./components/PublishNotesPage";
// Import other components as needed


const App = () => {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/generate-notes" element={<GenerateNotesPage />} />
                    <Route path="/generate-test" element={<GenerateTestPage />} />
                    <Route path="/publish-notes" element={<PublishNotesPage />} />
                </Route>


                {/* Routes without MainLayout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />


            </Routes>
        </Router>
    );
};

export default App;
