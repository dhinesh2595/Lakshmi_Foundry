import React, { useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';

// Initialize Firebase with your own configuration
const firebaseConfig = {
  // Your Firebase config details
};
const db = firebase.firestore();

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [editUser, setEditUser] = useState(null);

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
  };

  const handleUpdate = async (values) => {
    try {
      await db.collection('users').doc(editUser.id).update(values);

      const updatedUsers = users.map((user) => {
        if (user.id === editUser.id) {
          return {
            ...user,
            ...values,
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setEditUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container fluid>
      <h2 className="text-center mt-5">Users</h2>
      {currentUsers.map((user) => (
        <Row key={user.id} className="mb-3">
          <Col>
            {user === editUser ? (
              <Formik
                initialValues={{
                  name: user.name,
                  email: user.email,
                  role: user.role,
                  disabled: user.disabled || false,
                }}
                onSubmit={handleUpdate}
              >
                <Form>
                  <Row>
                    <Col>
                      <Form.Label>Name</Form.Label>
                      <Field type="text" name="name" className="form-control" />
                    </Col>
                    <Col>
                      <Form.Label>Email</Form.Label>
                      <Field type="email" name="email" className="form-control" disabled />
                    </Col>
                    <Col>
                      <Form.Label>Role</Form.Label>
                      <Field as="select" name="role" className="form-control">
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </Field>
                    </Col>
                    <Col>
                      <Form.Label>Status</Form.Label>
                      <div className="form-check">
                        <Field
                          type="checkbox"
                          id="disabled"
                          name="disabled"
                          className="form-check-input"
                        />
                        <Form.Label htmlFor="disabled" className="form-check-label">
                          Disabled
                        </Form.Label>
                      </div>
                    </Col>
                    <Col>
                      <Button variant="primary" type="submit">
                        Save
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Formik>
            ) : (
              <>
                <Row>
                  <Col>
                    <p>
                      <strong>Name:</strong> {user.name}
                    </p>
                  </Col>
                  <Col>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                  </Col>
                  <Col>
                    <p>
                      <strong>Role:</strong> {user.role}
                    </p>
                  </Col>
                  <Col>
                    <p>
                      <strong>Status:</strong> {user.disabled ? 'Disabled' : 'Enabled'}
                    </p>
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
      <Row>
        <Col className="d-flex justify-content-center">
          <Pagination
            usersPerPage={usersPerPage}
            totalUsers={users.length}
            currentPage={currentPage}
            paginate={paginate}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Pagination = ({ usersPerPage, totalUsers, currentPage, paginate }) => {
  const pageNumbers = Math.ceil(totalUsers / usersPerPage);

  const handlePagination = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > pageNumbers) {
      return; // Invalid page number, do nothing
    }
    paginate(pageNumber);
  };

  const renderPageNumbers = () => {
    const numbers = [];
    for (let i = 1; i <= pageNumbers; i++) {
      numbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePagination(i)}
        >
          <button className="page-link">{i}</button>
        </li>
      );
    }
    return numbers;
  };

  return (
    <nav>
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handlePagination(currentPage - 1)}>
            Previous
          </button>
        </li>
        {renderPageNumbers()}
        <li className={`page-item ${currentPage === pageNumbers ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => handlePagination(currentPage + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Users;
