import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import ProtectedRoute from './components/ProtectedRoute';
import GenerateNotes from './pages/GenerateNotes';
import GenerateTests from './pages/GenerateTests';
import PublishNotes from './pages/PublishNotes';
import Layout from './components/Layout'; // Import the Layout component

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes - Wrap them with ProtectedRoute */}
                <Route path="/" element={<Layout />}>
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="generate-notes" element={<GenerateNotes />} />
                        <Route path="generate-tests" element={<GenerateTests />} />
                        <Route path="publish-notes" element={<PublishNotes />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
