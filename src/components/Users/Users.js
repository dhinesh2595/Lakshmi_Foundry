import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

// Initialize Firebase with your own configuration
const firebaseConfig = {
  // Your Firebase config details
};
const db = firebase.firestore();

const Users = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedRole, setEditedRole] = useState('');
  const [editedDisabled, setEditedDisabled] = useState(false);

  useEffect(() => {
    // Fetch users from Firebase
    const fetchUsers = async () => {
      try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        const fetchedUsers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditUser(user);
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditedRole(user.role);
    setEditedDisabled(user.disabled || false);
  };

  const handleUpdate = async () => {
    try {
      const updatedUsers = users.map((user) => {
        if (user.id === editUser.id) {
          return {
            ...user,
            name: editedName,
            email: editedEmail,
            role: editedRole,
            disabled: editedDisabled,
          };
        }
        return user;
      });

      await db.collection('users').doc(editUser.id).update({
        name: editedName,
        email: editedEmail,
        role: editedRole,
        disabled: editedDisabled,
      });

      setUsers(updatedUsers);
      setEditUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
      <Container fluid>
        <h2 className="text-center mt-5">Users</h2>
        {users.map((user) => (
          <Row key={user.id} className="mb-3">
            <Col>
              {user === editUser ? (
                <Form>
                  <Row>
                    <Col>
                      <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" value={editedEmail} disabled />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formRole">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                          as="select"
                          value={editedRole}
                          onChange={(e) => setEditedRole(e.target.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="formDisabled">
                        <Form.Label>Status</Form.Label>
                        <Form.Check
                          type="switch"
                          id="formSwitch"
                          label={editedDisabled ? 'Disabled' : 'Enabled'}
                          checked={editedDisabled}
                          onChange={(e) => setEditedDisabled(e.target.checked)}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Button variant="primary" onClick={handleUpdate}>
                        Save
                      </Button>
                    </Col>
                  </Row>
                </Form>
              ) : (
                <>
                  <Row>
                    <Col>
                      <p><strong>Name:</strong> {user.name}</p>
                    </Col>
                    <Col>
                      <p><strong>Email:</strong> {user.email}</p>
                    </Col>
                    <Col>
                      <p><strong>Role:</strong> {user.role}</p>
                    </Col>
                    <Col>
                      <p><strong>Status:</strong> {user.disabled ? 'Disabled' : 'Enabled'}</p>
                    </Col>
                    <Col>
                      <Button variant="secondary" onClick={() => handleEdit(user)}>
                        Edit
                      </Button>
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        ))}
      </Container>
  );
  
};

export default Users;