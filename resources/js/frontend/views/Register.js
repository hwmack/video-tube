import React from 'react'
import { Button, Col, Container, Form, Row, InputGroup } from "react-bootstrap"
import { Link } from "react-router-dom"
import Alert from "react-bootstrap/Alert"

import { apiRequest } from '../helpers/utils'
import { store } from '../models/Store'
import {REGISTER} from "../models/Actions";

export default class Register extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '',
            username: '',
            password: '',
            confirm: '',
            form: {
                validated: false,
                serverError: ''
            }
        }

    }

    handleUpdate(event) {
        switch (event.target.id) {
            case 'formEmail':
                this.setState({
                    ...this.state,
                    email: event.target.value
                })
                break
            case 'formUsername':
                this.setState({
                    ...this.state,
                    username: event.target.value
                })
                break
            case 'formPassword':
                this.setState({
                    ...this.state,
                    password: event.target.value
                })
                break
            case 'formPasswordConfirm':
                this.setState({
                    ...this.state,
                    confirm: event.target.value
                })
                break
        }
    }

    handleRegister(event) {
        event.preventDefault()

        // Perform basic client side validation
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            this.setState({
                ...this.state,
                form: {
                    ...this.state.form,
                    validated: true,
                }
            })
            return false
        }

        // Exit early if the passwords don't match
        if (this.state.password !== this.state.confirm) {
            this.setState({
                ...this.state,
                form: {
                    ...this.state.form,
                    serverError: 'The passwords do not match'
                }
            });
            return false
        }


        // If we have all the required fields, we will send it to the server and see what it says

        let body = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            password_confirmation: this.state.confirm
        }

        apiRequest('/register', 'POST', body, (response, body) => {
            if (response.status === 200) {
                store.dispatch({
                    type: REGISTER,
                    user: body.user,
                    followCount: body.followCount,
                })

                store.getState().history.push('/')
            } else if (response.status === 422) {
                let newState = {
                    ...this.state
                }

                let errors = body.errors;

                if (errors.email) {
                    newState.form.serverError = errors.email[0]
                } else if (errors.username) {
                    newState.form.serverError = errors.username[0]
                } else if (errors.password) {
                    newState.form.serverError = errors.password[0]

                    if (newState.form.serverError.includes('invalid')) {
                        newState.form.serverError = (
                            <div>
                                Password must fit these requirements:
                                <ul>
                                    <li>At least one uppercase letter</li>
                                    <li>At least one lowercase letter</li>
                                    <li>At least one digit</li>
                                    <li>At least one special character (one of these: /#?!@$%^&*-.)</li>
                                </ul>
                            </div>)
                    }

                } else if (errors.password_confirmation) {
                    newState.form.serverError = errors.password_confirmation[0]
                }
                this.setState(newState)
            } else {
                console.error('Error from endpoint', response)
            }
        })
    }

    render() {
        return (
            <Container fluid className='offsetContainer'>
                <Row className='justify-content-xl-center'>
                    <h1>
                        <img src='/logo.svg' id='public-logo'/>
                        VideoTube
                    </h1>
                </Row>
                <Row className='justify-content-xl-center'>
                    <Col lg={4}>
                        <Form onSubmit={this.handleRegister.bind(this)}
                              noValidate
                              validated={this.state.form.validated}>

                            <Alert variant='danger' className={this.state.form.serverError === '' ? 'd-none' : 'd-block'}>
                                {this.state.form.serverError}
                            </Alert>

                            <Form.Group controlId='formEmail'>
                                <Form.Label>Email:</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type='email'
                                        required
                                        placeholder='Enter email'
                                        value={this.state.email}
                                        onChange={this.handleUpdate.bind(this)}/>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter your email.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId='formUsername'>
                                <Form.Label>Username:</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>@</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control
                                        type='text'
                                        required
                                        placeholder='Enter username'
                                        onChange={this.handleUpdate.bind(this)}/>
                                    <Form.Control.Feedback type="invalid">
                                        Please choose a username.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId='formPassword'>
                                <Form.Label>Password:</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type='password'
                                        required
                                        placeholder='Enter password'
                                        onChange={this.handleUpdate.bind(this)}/>
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a password.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId='formPasswordConfirm'>
                                <Form.Label>Confirm Password:</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type='password'
                                        required
                                        placeholder='Re-enter password'
                                        onChange={this.handleUpdate.bind(this)}/>
                                    <Form.Control.Feedback type="invalid">
                                        Please confirm your password.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Button variant='primary' type='submit'>
                                Register
                            </Button>

                            {' ' /* So the buttons will appear on the same line */}

                            <Link to='/login'>
                                <Button variant='outline-primary'>
                                    Log In
                                </Button>
                            </Link>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}