import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosInstance.put(`/api/admin/users/${userId}/role?role=${newRole}`);
      alert('User role updated successfully!');
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to disable this user?')) {
      try {
        await axiosInstance.delete(`/api/admin/users/${userId}`);
        alert('User disabled successfully!');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to disable user');
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Total Users: {users.length}</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users by name, username, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="CUSTOMER">CUSTOMER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="VENDOR">VENDOR</option>
                  </select>
                </td>
                <td>
                  <span className={`status-badge ${user.enabled ? 'active' : 'inactive'}`}>
                    {user.enabled ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="btn-danger btn-sm"
                    disabled={!user.enabled}
                  >
                    Disable
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-data">No users found</div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
