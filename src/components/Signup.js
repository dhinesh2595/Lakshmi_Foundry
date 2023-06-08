import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, resetForm } from "formik";
import { Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";
import { auth, createUserDocument } from "../firebase";

export default function Signup() {
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // Adjust the delay in milliseconds (e.g., 3000 for 3 seconds)

      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);
  return (
    <>
      <Card className="signup-card">
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              passwordConfirm: "",
            }}
            validate={(values) => {
              const errors = {};

              if (!values.name) {
                errors.name = "Name is required";
              }

              if (!values.email) {
                errors.email = "Email is required";
              } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                errors.email = "Invalid email address";
              }

              if (!values.password) {
                errors.password = "Password is required";
              } else if (values.password.length < 6) {
                errors.password = "Password must be at least 6 characters long";
              }

              if (!values.passwordConfirm) {
                errors.passwordConfirm = "Password Confirmation is required";
              } else if (values.passwordConfirm !== values.password) {
                errors.passwordConfirm = "Passwords do not match";
              }

              return errors;
            }}
            onSubmit={async (
              values,
              { setSubmitting, setStatus, resetForm }
            ) => {
              try {
                setLoading(true);
                setError("");

                const userCredential = await firebase
                  .auth()
                  .createUserWithEmailAndPassword(
                    values.email,
                    values.password
                  );

                const user = userCredential.user;

                const additionalData = {
                  name: values.name,
                };

                await createUserDocument(user, additionalData);
                setStatus({
                  success: "Please wait until your account is approved",
                });
                setShowSuccessMessage(true);
                setSuccessMessage("Please wait until your account is approved");
                resetForm();
              } catch (error) {
                setError(error.message);
                setStatus({ error: error.message });
              }

              setLoading(false);
            }}
          >
            {({ isSubmitting, status }) => (
              <>
                {status && status.error && (
                  <Alert variant="danger">{status.error}</Alert>
                )}
                {showSuccessMessage && (
                  <Alert variant="success">{successMessage}</Alert>
                )}
                <Form>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field
                      type="password"
                      id="password"
                      name="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="passwordConfirm">
                      Password Confirmation
                    </label>
                    <Field
                      type="password"
                      id="passwordConfirm"
                      name="passwordConfirm"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="passwordConfirm"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Sign Up
                  </button>
                </Form>
              </>
            )}
          </Formik>
        </Card.Body>
      </Card>
      <div className="text-center mt-2 signup-link">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  );
}
