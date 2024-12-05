import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@nextui-org/react";
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  User,
  Mail,
  Hash,
  Edit,
  Upload,
  CreditCard,
  Settings,
  Notebook
} from 'lucide-react';
import api from '../../../axiosConfig';

function UserDashBoard() {
  const [userDetails, setUserDetails] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [testCount, setTestCount] = useState(0);
  const [publishedNotesCount, setPublishedNotesCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch user details
        const userResponse = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-details`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch counts
        const testResponse = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-tests`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const publishedNotesResponse = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/published-notes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const notesResponse = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-user-notes`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Set user details
        setUserDetails(userResponse.data);
        setEditedUser(userResponse.data);

        // Set counts
        setTestCount(testResponse.data.tests[0].tests.length);
        setNotesCount(notesResponse.data.notes.length);
        setPublishedNotesCount(publishedNotesResponse.data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
        // alert('Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const handleNavigationWithAuth = async (url) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await api.get(`${import.meta.env.VITE_BACKEND_URL}/api/validate-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          navigate(url);
        } else {
          alert("Invalid or expired token. Please log in again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during token validation:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("You need to log in first!");
      navigate("/login");
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`${import.meta.env.VITE_BACKEND_URL}/api/update-profile`, editedUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserDetails(editedUser);
      setEditModalOpen(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const token = localStorage.getItem('token');
        const response = await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload-avatar`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        setUserDetails(prev => ({ ...prev, avatar: response.data.avatarUrl }));
        setEditedUser(prev => ({ ...prev, avatar: response.data.avatarUrl }));
      } catch (error) {
        console.error('Error uploading avatar:', error);
        alert('Failed to upload avatar');
      }
    }
  };

  if (!userDetails) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-8 mt-14">
      <div className="container mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-blue-700">
            Your Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your profile, track your progress, and explore your learning journey
          </p>
        </div>

        {/* User Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card
            className="w-full p-6 rounded-3xl bg-white shadow-2xl border border-gray-200 col-span-1"
          >
            <div className="flex flex-col items-center">
              {/* Avatar Upload */}
              <div className="relative group">
                <img
                  src={userDetails.avatar || 'https://media.istockphoto.com/id/619400810/photo/mr-who.jpg?s=2048x2048&w=is&k=20&c=ajUh75eNfNRDL0M0pcCOfq82dlak8mKavlAKgNbMgl4='}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500 shadow-lg group-hover:opacity-50 transition-opacity"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                >
                  <Upload className="text-white w-10 h-10" />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-gray-800">{userDetails.username}</h2>
              <p className="text-gray-500">{userDetails.email}</p>

              {/* Profile Actions */}
              <div className="mt-6 flex space-x-4">
                <Button
                  onClick={() => setEditModalOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                  startContent={<Edit className="w-5 h-5" />}
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={() => navigate('/payments')}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                  startContent={<CreditCard className="w-5 h-5" />}
                >
                  Upgrade Plan
                </Button>
              </div>

              {/* Plan Information */}
              <div className="mt-6 w-full">
                <div className="bg-gray-100 p-4 rounded-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-gray-800">Current Plan</h3>
                      <p className="text-sm text-gray-600 capitalize">{userDetails.planType} Plan</p>
                    </div>
                    <Settings className="text-gray-500" />
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm text-gray-600">Generations Left</span>
                    <span className="font-bold text-cyan-600">{userDetails.generationsLeft}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* User Statistics Cards */}
          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Count Card */}
            <Card
              isPressable
              onClick={() => handleNavigationWithAuth("/your-tests")}
              className="w-full p-5 rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg transform transition-all duration-500 hover:scale-105"
            >
              <div className="flex items-center gap-5">
                <div className="bg-white/20 p-3 rounded-full">
                  <Hash className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Total Tests Generated</h4>
                  <h5 className="text-3xl font-bold">{testCount}</h5>
                </div>
              </div>
            </Card>

            {/* Notes Count Card */}
            <Card
              isPressable
              onClick={() => handleNavigationWithAuth("/your-notes")}
              className="w-full p-5 rounded-3xl bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg transform transition-all duration-500 hover:scale-105"
            >
              <div className="flex items-center gap-5">
                <div className="bg-white/20 p-3 rounded-full">
                  <Notebook className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Total Notes Generated</h4>
                  <h5 className="text-3xl font-bold">{notesCount}</h5>
                </div>
              </div>
            </Card>

            {/* Published Notes Count Card */}
            <Card
              isPressable
              onClick={() => handleNavigationWithAuth("/your-published-notes")}
              className="w-full p-5 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform transition-all duration-500 hover:scale-105"
            >
              <div className="flex items-center gap-5">
                <div className="bg-white/20 p-3 rounded-full">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Total Notes Published</h4>
                  <h5 className="text-3xl font-bold">{publishedNotesCount}</h5>
                </div>
              </div>
            </Card>

            {/* Additional Stats Card */}
            <Card
              className="w-full p-5 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
            >
              <div className="flex items-center gap-5">
                <div className="bg-white/20 p-3 rounded-full">
                  <Settings className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold">Account Settings</h4>
                  <p className="text-sm">Manage your preferences</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onOpenChange={setEditModalOpen}
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Edit Profile</ModalHeader>
          <ModalBody>
            <Input
              label="Username"
              value={editedUser.username}
              onChange={(e) => setEditedUser(prev => ({ ...prev, username: e.target.value }))}
            />
            <Input
              label="Email"
              value={editedUser.email}
              onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleUpdateProfile}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default UserDashBoard;