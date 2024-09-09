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
import NotesReadingPage from "./components/NotesReadingPage"
import McqTestDisplay from "./components/TestDisplayPages/McqTestDisplay";
import FillUpsTestPage from "./components/TestDisplayPages/FillUpsTestPage";
import UserDashboard from "./components/UserDashboard/UserDashBoard";
import TestDetails from "./components/UserDashboard/TestDetails";

// Import other components as needed


const App = () => {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/publish-notes" element={<PublishNotesPage />} />
                    <Route path="/generate-notes" element={<GenerateNotesPage />} />
                    <Route path="/notes-reading" element={<NotesReadingPage />} />
                    
                    <Route path="/generate-test" element={<GenerateTestPage />} />
                    <Route path="/test-display/mcq" element={<McqTestDisplay />} />
                    <Route path="/test-display/fill-ups" element={<FillUpsTestPage />} />

                    <Route path="/userDashboard" element={<UserDashboard />} />
                    <Route path="/test-details/:testId" element={<TestDetails />} />
                </Route>


                {/* Routes without MainLayout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />


            </Routes>
        </Router>
    );
};

export default App;
