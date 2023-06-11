import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Card, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";

import "./Login.css"; // Import the CSS file for the loader

export default function Login() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setError("");

      await login(values.email, values.password);

      const user = firebase.auth().currentUser;

      if (user) {
        const userDocRef = firebase
          .firestore()
          .collection("users")
          .doc(user.uid);
        const doc = await userDocRef.get();

        if (doc.exists) {
          const userData = doc.data();
          const disabled = userData.disabled;
          const isAdmin = userData.is_admin;

          if (!disabled || isAdmin === 1) {
            // User is not disabled, proceed with signed-in user logic
            history.push("/");
            return;
          }
        }
      }

      setError("Please wait until your account is approved");
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
    setSubmitting(false);
  };

  return (
    <>
      <div className="auth-form-container">
        <Card className={`auth-card ${error ? "error" : ""}`}>
          <Card.Body>
            <h2 className="text-center mb-4">Log In</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validate={(values) => {
                const errors = {};

                if (!values.email) {
                  errors.email = "Email is required";
                } else if (!/\S+@\S+\.\S+/.test(values.email)) {
                  errors.email = "Invalid email address";
                }

                if (!values.password) {
                  errors.password = "Password is required";
                }

                return errors;
              }}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      disabled={loading} // Disable the field when loading is true
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
                      disabled={loading} // Disable the field when loading is true
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || loading} // Disable the button when submitting or when loading is true
                  >
                    {isSubmitting && !error ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                      ></span>
                    ) : (
                      "Log In"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
            <div className="text-center mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            <div className="text-center mt-2 login-link">
              Need an account? <Link to="/signup">Sign Up</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
