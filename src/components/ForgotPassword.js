import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setStatus }
  ) => {
    try {
      await resetPassword(values.email);
      setSubmitting(false);
      resetForm();
      setStatus({
        message: "Check your inbox for further instructions",
        error: false,
      });
    } catch (error) {
      console.error(error);
      setStatus({ message: "Failed to reset password", error: true });
    }
  };

  return (
    <>
      <div className="auth-form-container">
        <Card className="auth-card">
          <Card.Body>
            <h2 className="text-center mb-4">Password Reset</h2>
            <Formik
              initialValues={{
                email: "",
              }}
              validate={(values) => {
                const errors = {};

                if (!values.email) {
                  errors.email = "Email is required";
                }

                return errors;
              }}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, status }) => (
                <Form>
                  {status && status.message && (
                    <Alert variant={status.error ? "danger" : "success"}>
                      {status.message}
                    </Alert>
                  )}
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

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Reset Password
                  </button>
                </Form>
              )}
            </Formik>
            <div className="w-100 text-center mt-3">
              <Link to="/login">Login</Link>
            </div>
            <div className="w-100 text-center mt-2">
              Need an account? <Link to="/signup">Sign Up</Link>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
