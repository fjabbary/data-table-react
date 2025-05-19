import { useState, useEffect } from "react";
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import type { User } from "../data/type";
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

import AddUserModal from "../components/AddUserModal";
import { toast } from "react-toastify";


function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, _] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert("An unknown error occurred");
        }
      }
    };
  
    fetchUsers();
  }, [])
  

  const handleClose = () => setShowAddModal(false);
  const openAddUserModal = () => setShowAddModal(true)

  const deleteUser= (userId: string | number) => {
  
      fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (response.ok) {
          toast.error('User removed')
        }
      }
      )
      const filteredUsers = users.filter(user => user.id !== userId);
      setUsers(filteredUsers);
    }

  return (
    <div style={{ marginTop: '60px' }}>
      <Stack direction="horizontal" gap={3} className="mb-3">
        <h1>User Management</h1>
        <Button variant="success" className="ms-auto" onClick={openAddUserModal}>Add New User</Button>
      </Stack>
    
      
      {error && <p>{error}</p>}
      { loading ? <Spinner animation="border" variant="primary" /> : null }


      <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Full Name</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        { users.map(user => (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.name}</td>
          <td><span style={{ cursor: 'pointer' }}>📝</span></td>
          <td><span  onClick={() => deleteUser(user.id)} style={{ cursor: 'pointer' }}>🚮</span></td>
        </tr> 
      )) }
      </tbody>
    </Table>

    <AddUserModal showAddModal={showAddModal} handleClose={handleClose} />
    </div>
  )
}

export default UserManagement