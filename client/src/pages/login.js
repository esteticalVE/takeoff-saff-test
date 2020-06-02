import React, { useContext, useState } from 'react'
import { Form, Container, Row, Col, Button, Alert } from 'react-bootstrap'
import { useFetch, useAlert } from '../hooks'
import { emailValidation, passwordValidation } from '../utils'
import { AuthContext } from '../context/authContext'
import styled from './styled.module.css'

export function Login() {
  const auth = useContext(AuthContext)
  const { loading, request } = useFetch()
  const { alert, setAlert } = useAlert()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  async function formSubmit() {
    try {
      emailValidation(form.email)
      passwordValidation(form.password)
      const userData = await request('/api/auth/login', 'POST', { ...form })
      auth.login(userData.token, userData.userId)
    } catch (error) {
      setAlert({ type: 'error', message: error.message })
    }
  }

  function changeFormHandler(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  return (
    <Container className={styled.loginContainer}>
      <Row>
        <Col>
          <Form className={styled.loginForm}>
            <Form.Group controlId='formGroupEmail'>
              <Form.Label>Email*</Form.Label>
              <Form.Control
                type='email'
                placeholder='test@test.com'
                name='email'
                required
                onChange={changeFormHandler}
              />
            </Form.Group>
            <Form.Group controlId='formGroupPassword'>
              <Form.Label>Password*</Form.Label>
              <Form.Control
                type='password'
                placeholder='secret'
                name='password'
                required
                onChange={changeFormHandler}
              />
            </Form.Group>
            <Button variant='success' onClick={formSubmit} disabled={loading}>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
      {alert && (
        <Alert
          style={{ position: 'absolute', top: 10, left: '45%' }}
          variant={alert.type === 'error' ? 'danger' : 'success'}
        >
          {alert.message}
        </Alert>
      )}
    </Container>
  )
}
