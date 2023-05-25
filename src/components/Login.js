import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import firebase from "firebase"

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()
    firebase.auth().signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
    .then((userCredential) => {
      // Get the user reference
      const user = userCredential.user;
      // Retrieve the user's Firestore document
      const userDocRef = firebase.firestore().collection('users').doc(user.uid);
      // Get the user's Firestore document data
      userDocRef.get()
        .then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            const disabled = userData.disabled;
            setError("")
            if (disabled == 0) {
              // User is not disabled, proceed with signed-in user logic
              history.push("/")
            } else {
              // User is disabled, handle accordingly
              setError("Please wait till you account is approved");
            }
          } else {
            // User document does not exist
            setError("User does not exist")
          }
        })
        .catch((error) => {
          setError(error);
        });
    })
    .catch((error) => {
      setError(error.message);
    });

    setLoading(false)
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Log In</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Log In
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        Need an account? <Link to="/signup">Sign Up</Link>
      </div>
    </>
  )
}
