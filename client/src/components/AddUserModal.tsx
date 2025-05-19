import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import type { User } from '../data/type';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

function AddUserModal({ showAddModal, handleClose }: { showAddModal: boolean; handleClose: () => void }) {

    const [newUser, setNewUser] = useState<User>({ id: 0, name: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUser({ id: uuidv4(), name: e.target.value })
    }

    const handleAddUser = () => {
        fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
        })
            .then((response) => {
                if (response.ok) {
                    toast.success('User added successfully');
                } else {
                    toast.error('Failed to add user');
                }
            })

        handleClose();
    }

    return (
        <>
            <Modal show={showAddModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New User</Modal.Title>
                </Modal.Header>


                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control placeholder="full name" name="name" onChange={handleChange} />
                    </Form.Group>
                </Modal.Body>


                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddUser}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddUserModal